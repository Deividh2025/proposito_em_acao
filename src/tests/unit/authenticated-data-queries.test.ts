import type { User } from "@supabase/supabase-js";
import { describe, expect, test, vi } from "vitest";

import { getDashboardCounts } from "@/lib/supabase/queries/dashboard";
import { getUserProfile } from "@/lib/supabase/queries/profile";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

type QueryResult = {
  count?: number | null;
  data?: unknown;
  error?: null | { message: string };
};

vi.mock("server-only", () => ({}));

function authenticatedUser(id = "user-1"): User {
  return { id } as User;
}

function createCountQuery(result: QueryResult) {
  const chain = {
    count: result.count,
    error: result.error ?? null,
    eq: vi.fn(() => chain),
    in: vi.fn(() => chain),
    select: vi.fn(() => chain)
  };

  return chain;
}

function createProfileQuery(result: QueryResult) {
  const chain = {
    eq: vi.fn(() => chain),
    maybeSingle: vi.fn(async () => result),
    select: vi.fn(() => chain)
  };

  return chain;
}

describe("authenticated data queries", () => {
  test("returns real empty-state counts as zero without requiring sample data", async () => {
    const queries = {
      goals: createCountQuery({ count: null, error: null }),
      inbox_items: createCountQuery({ count: 0, error: null }),
      projects: createCountQuery({ count: null, error: null }),
      tasks: createCountQuery({ count: 0, error: null })
    };
    const supabase = {
      from: vi.fn((table: keyof typeof queries) => queries[table])
    } as unknown as TypedSupabaseClient;

    await expect(getDashboardCounts(supabase, authenticatedUser())).resolves.toEqual({
      activeGoals: 0,
      activeProjects: 0,
      inboxItems: 0,
      pendingTasks: 0
    });

    expect(supabase.from).toHaveBeenCalledWith("goals");
    expect(supabase.from).toHaveBeenCalledWith("projects");
    expect(supabase.from).toHaveBeenCalledWith("tasks");
    expect(supabase.from).toHaveBeenCalledWith("inbox_items");
    expect(queries.goals.select).toHaveBeenCalledWith("id", { count: "exact", head: true });
    expect(queries.goals.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(queries.goals.in).toHaveBeenCalledWith("status", ["active", "needs_review"]);
  });

  test("raises a generic query error instead of leaking table or RLS details", async () => {
    const errorMessage = "permission denied for table inbox_items";
    const queries = {
      goals: createCountQuery({ count: null, error: { message: errorMessage } }),
      inbox_items: createCountQuery({ count: 0, error: null }),
      projects: createCountQuery({ count: 0, error: null }),
      tasks: createCountQuery({ count: 0, error: null })
    };
    const supabase = {
      from: vi.fn((table: keyof typeof queries) => queries[table])
    } as unknown as TypedSupabaseClient;

    await expect(getDashboardCounts(supabase, authenticatedUser())).rejects.toThrow(
      "Could not load dashboard readiness data."
    );
    await expect(getDashboardCounts(supabase, authenticatedUser())).rejects.not.toThrow(errorMessage);
  });

  test("returns null for a missing authenticated profile instead of creating a demo profile", async () => {
    const query = createProfileQuery({ data: null, error: null });
    const supabase = {
      from: vi.fn(() => query)
    } as unknown as TypedSupabaseClient;

    await expect(getUserProfile(supabase, authenticatedUser())).resolves.toBeNull();
    expect(query.eq).toHaveBeenCalledWith("id", "user-1");
  });

  test("rejects a profile row that belongs to another user", async () => {
    const query = createProfileQuery({
      data: {
        email: "other@example.com",
        id: "other-user"
      },
      error: null
    });
    const supabase = {
      from: vi.fn(() => query)
    } as unknown as TypedSupabaseClient;

    await expect(getUserProfile(supabase, authenticatedUser("user-1"))).rejects.toThrow(
      "User is not allowed to access this resource."
    );
  });

  test("normalizes optional profile fields without leaking malformed row values", async () => {
    const query = createProfileQuery({
      data: {
        display_name: 123,
        email: "owner@example.com",
        id: "user-1",
        locale: null,
        onboarding_status: "completed",
        timezone: "America/Sao_Paulo"
      },
      error: null
    });
    const supabase = {
      from: vi.fn(() => query)
    } as unknown as TypedSupabaseClient;

    await expect(getUserProfile(supabase, authenticatedUser("user-1"))).resolves.toEqual({
      displayName: null,
      email: "owner@example.com",
      id: "user-1",
      locale: null,
      onboardingStatus: "completed",
      timezone: "America/Sao_Paulo"
    });
  });
});
