export type WeeklyReviewPrivacyLevel = "private" | "manual_summary_only";

export type WeeklyReviewWindow = {
  weekStart: string;
  weekEnd: string;
};

export type WeeklyReviewQuestionId =
  | "advanced"
  | "stuck"
  | "completed"
  | "postponed"
  | "goalsProgressed"
  | "projectsPaused"
  | "habitsMaintained"
  | "restarts"
  | "excess"
  | "neglectedAreas"
  | "metacognition"
  | "scoreboard"
  | "adjustments"
  | "nextWeekFocus"
  | "firstActionNextWeek";

export type WeeklyReviewQuestion = {
  id: WeeklyReviewQuestionId;
  label: string;
  prompt: string;
  lowEnergyPrompt: string;
};
