import type { User } from "@supabase/supabase-js";

export function assertServerOnlySupabasePath() {
  if (typeof window !== "undefined") {
    throw new Error("This Supabase operation must run on the server.");
  }
}

export function assertAuthenticatedUser(user: User | null): asserts user is User {
  if (!user) {
    throw new Error("Authenticated user is required.");
  }
}

export function isOwnUserId(user: User, userId: string) {
  return user.id === userId;
}

export function assertOwnUserId(user: User, userId: string) {
  if (!isOwnUserId(user, userId)) {
    throw new Error("User is not allowed to access this resource.");
  }
}
