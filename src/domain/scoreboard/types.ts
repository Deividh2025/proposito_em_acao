export type ScoreboardPeriod = "daily" | "weekly" | "monthly" | "custom";
export type ScoreboardVisibility = "private" | "atalaias_limited";
export type ScoreboardItemType =
  | "task"
  | "habit"
  | "focus"
  | "restart"
  | "behavior"
  | "commitment"
  | "manual";
export type ScoreboardEntryStatus = "done" | "partial" | "not_done" | "restarted" | "paused_consciously";

export type ScoreboardItem = {
  id: string;
  title: string;
  type: ScoreboardItemType;
  minimumSuccess: string;
  targetFrequency: string;
  linkedGoalId?: string;
  linkedHabitId?: string;
  linkedTaskId?: string;
};

export type ScoreboardEntry = {
  id: string;
  itemId: string;
  entryDate: string;
  status: ScoreboardEntryStatus;
  note?: string;
};

export type DisciplineScoreboard = {
  id: string;
  title: string;
  period: ScoreboardPeriod;
  visibility: ScoreboardVisibility;
  items: ScoreboardItem[];
};
