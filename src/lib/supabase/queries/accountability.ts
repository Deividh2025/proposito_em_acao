import "server-only";

import type { User } from "@supabase/supabase-js";

import {
  accountabilityLevelSchema,
  accountabilityNotificationFrequencySchema,
  accountabilityPermissionSchema,
  type AccountabilityGrantAccessView,
  type AccountabilityGrantSharedData,
  type AccountabilityPermission
} from "@/domain/accountability";
import { assertAuthenticatedUser } from "@/lib/supabase/guards";
import {
  nullableStringFromRow,
  numberFromRow,
  recordFromUnknown,
  stringFromRow,
  type GenericSupabaseRow
} from "@/lib/supabase/queries/mappers";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

export type AccountabilityOverview = {
  ownedGrants: AccountabilityGrantAccessView[];
  partnerGrants: AccountabilityGrantAccessView[];
};

function nestedRecordFromRow(row: GenericSupabaseRow, key: string) {
  const value = row[key];

  if (Array.isArray(value)) {
    return recordFromUnknown(value[0]);
  }

  return recordFromUnknown(value);
}

function permissionsFromValue(value: unknown): AccountabilityPermission[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is AccountabilityPermission => accountabilityPermissionSchema.safeParse(item).success);
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  return Object.entries(value as Record<string, unknown>)
    .filter(([, enabled]) => enabled === true)
    .map(([permission]) => permission)
    .filter((permission): permission is AccountabilityPermission => accountabilityPermissionSchema.safeParse(permission).success);
}

function sharedDataFromGoal(goal: GenericSupabaseRow, permissions: AccountabilityPermission[]): AccountabilityGrantSharedData {
  return {
    completedMilestones: [],
    deadline: permissions.includes("deadline") ? nullableStringFromRow(goal, "time_bound") : null,
    goalStatus: permissions.includes("status") ? nullableStringFromRow(goal, "status") : null,
    goalTitle: permissions.includes("goal_name") ? stringFromRow(goal, "title", "Alvo autorizado") : null,
    progressPercentage: permissions.includes("progress_percentage") ? numberFromRow(goal, "progress_percent", 0) : null
  };
}

export function mapAccountabilityGrantRow(rowValue: unknown, viewer: User): AccountabilityGrantAccessView | null {
  assertAuthenticatedUser(viewer);

  const row = recordFromUnknown(rowValue);
  const id = stringFromRow(row, "id");
  const goalId = stringFromRow(row, "goal_id");

  if (!id || !goalId) {
    return null;
  }

  const ownerUserId = stringFromRow(row, "user_id");
  const viewerRole = ownerUserId === viewer.id ? "owner" : "partner";
  const permissions = permissionsFromValue(row.permissions);
  const goal = nestedRecordFromRow(row, "goals");
  const partner = nestedRecordFromRow(row, "accountability_partners");
  const sharedData = sharedDataFromGoal(goal, permissions);
  const ownerVisibleTitle = stringFromRow(goal, "title", "Alvo autorizado");

  return {
    acceptedAt: nullableStringFromRow(row, "accepted_at"),
    expiresAt: nullableStringFromRow(row, "expires_at"),
    goalId,
    goalTitle: viewerRole === "owner" ? ownerVisibleTitle : sharedData.goalTitle ?? "Alvo autorizado",
    id,
    level: accountabilityLevelSchema.catch("balanced").parse(row.tracking_level),
    notificationFrequency: accountabilityNotificationFrequencySchema.catch("weekly").parse(row.notification_frequency),
    partnerEmail: nullableStringFromRow(partner, "email"),
    partnerName: nullableStringFromRow(partner, "name"),
    permissions,
    reviewedAt: nullableStringFromRow(row, "last_previewed_at"),
    revokedAt: nullableStringFromRow(row, "revoked_at"),
    sharedData,
    status: accountabilityStatusFromRow(row),
    viewerRole
  };
}

function accountabilityStatusFromRow(row: GenericSupabaseRow): AccountabilityGrantAccessView["status"] {
  const status = stringFromRow(row, "status");

  if (status === "active" || status === "revoked" || status === "expired" || status === "invited") {
    return status;
  }

  return "expired";
}

const grantSelect =
  "id,user_id,goal_id,permissions,status,tracking_level,notification_frequency,last_previewed_at,accepted_at,expires_at,revoked_at,accountability_partners(name,email,status,revoked_at),goals(title,status,time_bound,progress_percent)";

async function getGrantRows(
  supabase: TypedSupabaseClient,
  user: User,
  mode: "owned" | "partner",
  grantId?: string
): Promise<AccountabilityGrantAccessView[]> {
  assertAuthenticatedUser(user);

  let query = supabase.from("accountability_grants").select(grantSelect);

  if (grantId) {
    query = query.eq("id", grantId);
  }

  if (mode === "owned") {
    query = query.eq("user_id", user.id);
  } else {
    query = query.eq("status", "active").is("revoked_at", null);
  }

  const { data, error } = grantId ? await query.maybeSingle() : await query.order("updated_at", { ascending: false }).limit(8);

  if (error) {
    throw new Error("Could not load accountability grants.");
  }

  const rows = grantId ? [data] : Array.isArray(data) ? data : [];

  return rows
    .map((row) => mapAccountabilityGrantRow(row, user))
    .filter((grant): grant is AccountabilityGrantAccessView => Boolean(grant));
}

export async function getAccountabilityOverview(
  supabase: TypedSupabaseClient,
  user: User
): Promise<AccountabilityOverview> {
  const [ownedGrants, partnerGrants] = await Promise.all([
    getGrantRows(supabase, user, "owned"),
    getGrantRows(supabase, user, "partner")
  ]);

  return {
    ownedGrants,
    partnerGrants
  };
}

export async function getAccountabilityGrantDetail(
  supabase: TypedSupabaseClient,
  user: User,
  grantId: string
): Promise<AccountabilityGrantAccessView | null> {
  const [grant] = await getGrantRows(supabase, user, "partner", grantId);

  if (grant) {
    return grant;
  }

  const [ownedGrant] = await getGrantRows(supabase, user, "owned", grantId);
  return ownedGrant ?? null;
}
