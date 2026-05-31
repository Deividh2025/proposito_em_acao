import type { GoalShareScope } from "@/domain/goals/types";

export type AccountabilityStatus = "invited" | "active" | "revoked" | "expired";

export type AccountabilityPermissions = Partial<Record<GoalShareScope, boolean>>;
