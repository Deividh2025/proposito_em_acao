export type GardenEventType =
  | "area_progressed"
  | "area_neglected"
  | "area_care_needed"
  | "weekly_review_completed"
  | "goal_progressed"
  | "project_progressed"
  | "task_completed"
  | "focus_completed"
  | "habit_logged"
  | "habit_restarted"
  | "metacognition_action_completed"
  | "protected_rest";

export type GardenSourceType =
  | "weekly_review"
  | "goal"
  | "project"
  | "task"
  | "focus"
  | "habit"
  | "scoreboard"
  | "metacognition"
  | "calendar"
  | "manual";
