"use server";

import { redirect } from "next/navigation";

import { getPublicEnv } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuthMode = "sign-in" | "sign-up";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readMode(formData: FormData): AuthMode {
  return readText(formData, "mode") === "sign-up" ? "sign-up" : "sign-in";
}

function hasSupabasePublicEnv() {
  const env = getPublicEnv();

  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function redirectToAuthStatus(status: string): never {
  redirect(`/auth?status=${encodeURIComponent(status)}`);
}

export async function submitAuthAction(formData: FormData) {
  const mode = readMode(formData);
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");

  if (!email.includes("@") || password.length < 6) {
    redirectToAuthStatus("invalid");
  }

  if (!hasSupabasePublicEnv()) {
    redirectToAuthStatus("local");
  }

  const env = getPublicEnv();
  const supabase = await createSupabaseServerClient();

  if (mode === "sign-up") {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/dashboard`
      }
    });

    if (error) {
      redirectToAuthStatus("auth-error");
    }

    redirectToAuthStatus("signup-sent");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectToAuthStatus("auth-error");
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  if (hasSupabasePublicEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirectToAuthStatus("signed-out");
}
