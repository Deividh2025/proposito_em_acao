export type FocusSessionStatus = "active" | "completed" | "cancelled" | "interrupted";

export type FocusDistractionType =
  | "thought"
  | "idea"
  | "reminder"
  | "parallel_task"
  | "concern"
  | "link"
  | "note";

export type FocusSessionPlan = {
  taskId?: string;
  calendarBlockId?: string;
  actionUnblockerSessionId?: string;
  taskTitle: string;
  nextStep: string;
  reason: string;
  durationMinutes: number;
};

export type FocusSession = FocusSessionPlan & {
  id: string;
  status: FocusSessionStatus;
  startedAt: string;
  endedAt?: string;
  pauseCount: number;
  completionNote?: string;
  postEnergyLevel?: "low" | "medium" | "high";
};

export type FocusDistraction = {
  id: string;
  focusSessionId: string;
  type: FocusDistractionType;
  content: string;
  capturedAt: string;
  routedToInbox: boolean;
};
