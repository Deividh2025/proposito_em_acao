export type TaskStatus =
  | "pending"
  | "scheduled"
  | "in_focus"
  | "completed"
  | "deferred"
  | "stuck"
  | "cancelled";

export type EnergyLevel = "low" | "medium" | "high";

export type TaskType = "one_off" | "project_task" | "recurring_work" | "microtask" | "restart_task";

export type MicrotaskStatus = "pending" | "completed" | "skipped";
