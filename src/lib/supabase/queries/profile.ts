import "server-only";

import type { User } from "@supabase/supabase-js";
import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { assertAuthenticatedUser, assertOwnUserId } from "@/lib/supabase/guards";

export type UserProfileSummary = {
  id: string;
  email: string | null;
  displayName: string | null;
  timezone: string | null;
  locale: string | null;
  onboardingStatus: string | null;
};

type ProfileRow = {
  id?: unknown;
  email?: unknown;
  display_name?: unknown;
  timezone?: unknown;
  locale?: unknown;
  onboarding_status?: unknown;
};

function stringOrNull(value: unknown) {
  return typeof value === "string" ? value : null;
}

function normalizeProfile(row: ProfileRow): UserProfileSummary | null {
  if (typeof row.id !== "string") {
    return null;
  }

  return {
    displayName: stringOrNull(row.display_name),
    email: stringOrNull(row.email),
    id: row.id,
    locale: stringOrNull(row.locale),
    onboardingStatus: stringOrNull(row.onboarding_status),
    timezone: stringOrNull(row.timezone)
  };
}

export async function getUserProfile(supabase: TypedSupabaseClient, user: User) {
  assertAuthenticatedUser(user);

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,display_name,timezone,locale,onboarding_status")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load the authenticated user profile.");
  }

  if (!data) {
    return null;
  }

  const profile = normalizeProfile(data);

  if (profile) {
    assertOwnUserId(user, profile.id);
  }

  return profile;
}
