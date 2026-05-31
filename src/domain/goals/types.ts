export type GoalStatus = "draft" | "active" | "paused" | "completed" | "abandoned" | "in_review";

export type GoalShareScope =
  | "goal_status"
  | "progress_summary"
  | "milestones"
  | "authorized_delay"
  | "help_request"
  | "limited_scoreboard"
  | "commitment_document";
