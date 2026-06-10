"use server";

import { redirect } from "next/navigation";

import { getAppRuntimeMode, getPublicEnv, getRuntimeEnvironmentStatus } from "@/lib/config";
import { appendSafeNext, sanitizeAuthNext } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuthMode = "sign-in" | "sign-up";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readMode(formData: FormData): AuthMode {
  return readText(formData, "mode") === "sign-up" ? "sign-up" : "sign-in";
}

function hasConfiguredEnvValue(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasSupabasePublicEnv() {
  const env = getPublicEnv();

  return (
    hasConfiguredEnvValue(env.NEXT_PUBLIC_SUPABASE_URL) &&
    (hasConfiguredEnvValue(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
      hasConfiguredEnvValue(env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
  );
}

function isLocalDemoRuntime() {
  try {
    return getAppRuntimeMode() === "local-demo";
  } catch {
    return false;
  }
}

function redirectToAuthStatus(status: string, next?: unknown): never {
  redirect(appendSafeNext(`/auth?status=${encodeURIComponent(status)}`, next));
}

function redirectToAuthError(status = "unavailable"): never {
  redirect(`/auth/error?status=${encodeURIComponent(status)}`);
}

function getAuthRuntimeBlockStatus() {
  const status = getRuntimeEnvironmentStatus();

  if (status.localDemoFallbackAllowed) {
    return null;
  }

  if (!status.supabase.configured) {
    return "config";
  }

  if (!status.appUrl.configured) {
    return "app-url";
  }

  return null;
}

function redirectIfAuthRuntimeBlocked() {
  const status = getAuthRuntimeBlockStatus();

  if (status) {
    redirectToAuthError(status);
  }
}

function buildAppUrl(path: string) {
  const env = getPublicEnv();
  const baseUrl = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

  return `${baseUrl}${path}`;
}

export async function submitAuthAction(formData: FormData) {
  const mode = readMode(formData);
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");
  const next = sanitizeAuthNext(readText(formData, "next"));

  if (!email.includes("@") || password.length < 6) {
    redirectToAuthStatus("invalid", next);
  }

  redirectIfAuthRuntimeBlocked();

  if (!hasSupabasePublicEnv()) {
    if (isLocalDemoRuntime()) {
      redirectToAuthStatus("local", next);
    }

    redirectToAuthError("config");
  }

  const supabase = await createSupabaseServerClient();

  if (mode === "sign-up") {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: buildAppUrl(appendSafeNext("/auth/confirm", next))
      }
    });

    if (error) {
      redirectToAuthStatus("auth-error", next);
    }

    redirectToAuthStatus("signup-sent", next);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectToAuthStatus("auth-error", next);
  }

  redirect(next);
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = readText(formData, "email").toLowerCase();

  if (!email.includes("@")) {
    redirect("/auth/forgot-password?status=sent");
  }

  redirectIfAuthRuntimeBlocked();

  if (!hasSupabasePublicEnv()) {
    if (isLocalDemoRuntime()) {
      redirect("/auth/forgot-password?status=local");
    }

    redirectToAuthError("config");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildAppUrl("/auth/update-password")
  });

  if (error) {
    redirectToAuthError("unavailable");
  }

  redirect("/auth/forgot-password?status=sent");
}

export async function updatePasswordAction(formData: FormData) {
  const password = readText(formData, "password");
  const confirmPassword = readText(formData, "confirmPassword");

  if (password.length < 6 || password !== confirmPassword) {
    redirect("/auth/update-password?status=invalid");
  }

  redirectIfAuthRuntimeBlocked();

  if (!hasSupabasePublicEnv()) {
    if (isLocalDemoRuntime()) {
      redirect("/auth/update-password?status=local");
    }

    redirectToAuthError("config");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirectToAuthError("session");
  }

  redirectToAuthStatus("password-updated");
}

export async function signOutAction(formData?: FormData) {
  const next = sanitizeAuthNext(formData ? readText(formData, "next") : undefined, "/auth");

  redirectIfAuthRuntimeBlocked();

  if (!hasSupabasePublicEnv()) {
    if (isLocalDemoRuntime()) {
      redirectToAuthStatus("signed-out", next);
    }

    redirectToAuthError("config");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirectToAuthError("unavailable");
  }

  redirectToAuthStatus("signed-out", next);
}
