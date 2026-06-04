import "server-only";

import type { User } from "@supabase/supabase-js";
import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { assertAuthenticatedUser } from "@/lib/supabase/guards";

export type DashboardCounts = {
  activeGoals: number;
  activeProjects: number;
  pendingTasks: number;
  inboxItems: number;
};

async function countOwnedRows(
  supabase: TypedSupabaseClient,
  table: "goals" | "projects" | "tasks" | "inbox_items",
  userId: string,
  statuses: readonly string[]
) {
  let query = supabase.from(table).select("id", { count: "exact", head: true }).eq("user_id", userId);

  if (statuses.length > 0) {
    query = query.in("status", [...statuses]);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error("Could not load dashboard readiness data.");
  }

  return count ?? 0;
}

export async function getDashboardCounts(supabase: TypedSupabaseClient, user: User): Promise<DashboardCounts> {
  assertAuthenticatedUser(user);

  const [activeGoals, activeProjects, pendingTasks, inboxItems] = await Promise.all([
    countOwnedRows(supabase, "goals", user.id, ["active", "needs_review"]),
    countOwnedRows(supabase, "projects", user.id, ["active", "needs_review"]),
    countOwnedRows(supabase, "tasks", user.id, ["pending", "scheduled", "in_focus", "stuck"]),
    countOwnedRows(supabase, "inbox_items", user.id, ["captured", "triaged"])
  ]);

  return {
    activeGoals,
    activeProjects,
    inboxItems,
    pendingTasks
  };
}
