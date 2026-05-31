export type FocusSessionStatus = "active" | "completed" | "cancelled" | "interrupted";

export type FocusSessionPlan = {
  taskId?: string;
  durationMinutes: number;
};
