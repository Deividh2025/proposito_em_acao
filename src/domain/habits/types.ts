export type HabitStatus = "draft" | "active" | "paused" | "archived";
export type HabitLogStatus =
  | "done_minimum"
  | "done_ideal"
  | "skipped"
  | "missed"
  | "restarted"
  | "paused_consciously";

export type HabitFrequency = "daily" | "weekly" | "custom";

export type Habit = {
  id: string;
  title: string;
  status: HabitStatus;
  identityStatement: string;
  whyItMatters: string;
  lifeArea: string;
  trigger: string;
  minimumVersion: string;
  idealVersion: string;
  frequency: HabitFrequency;
  scheduleSuggestion: string;
  reward: string;
  likelyObstacle: string;
  ifThenPlan: string;
  environmentDesign: string;
  metric: string;
  restartPlan: string;
  linkedGoalId?: string;
};
