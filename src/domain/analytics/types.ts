export type ProductAnalyticsMetadata = Record<string, boolean | number | string>;

export type ProductAnalyticsEventName = (typeof productAnalyticsEventNames)[number];

export type ProductAnalyticsEvent = {
  name: ProductAnalyticsEventName;
  consentGranted: boolean;
  metadata: ProductAnalyticsMetadata;
  occurredAt: string;
};

export const activationEventNames = [
  "user_signed_up",
  "profile_completed",
  "life_map_completed",
  "calling_started",
  "calling_completed",
  "first_goal_created",
  "first_project_created",
  "first_task_created",
  "first_task_scheduled",
  "first_action_unblocker_used",
  "first_metacognition_completed",
  "first_focus_started",
  "first_habit_created",
  "first_scoreboard_marked",
  "first_weekly_review_completed"
] as const;

export const retentionEventNames = [
  "next_day_returned",
  "weekly_returned",
  "weekly_review_completed",
  "recurring_calendar_used",
  "recurring_action_unblocker_used",
  "recurring_metacognition_used",
  "focus_completed",
  "habit_logged",
  "scoreboard_marked",
  "restart_logged"
] as const;

export const productAnalyticsEventNames = [
  ...activationEventNames,
  ...retentionEventNames,
  "goal_created",
  "project_created",
  "task_created",
  "task_scheduled",
  "task_completed",
  "inbox_item_captured",
  "inbox_item_processed",
  "action_unblocker_used",
  "metacognition_started",
  "metacognition_completed",
  "focus_started",
  "habit_created",
  "garden_viewed",
  "accountability_invite_created",
  "mobile_capture_used"
] as const;
