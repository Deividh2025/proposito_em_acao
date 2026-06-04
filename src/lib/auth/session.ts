import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { assertAuthenticatedUser } from "@/lib/supabase/guards";

import { DEFAULT_AUTH_REDIRECT, safeNextPath } from "./redirects";

export type AuthenticatedUser = User;

export async function getOptionalUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function requireUser(next?: FormDataEntryValue | string | null) {
  const user = await getOptionalUser();

  if (!user) {
    const safeNext = safeNextPath(next);
    const suffix = safeNext === DEFAULT_AUTH_REDIRECT ? "" : `?next=${encodeURIComponent(safeNext)}`;

    redirect(`/auth${suffix}`);
  }

  assertAuthenticatedUser(user);

  return user;
}
