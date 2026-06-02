export type AccountabilityNotificationEvent =
  | "invite"
  | "invite_accepted"
  | "milestone_completed"
  | "delay_alert"
  | "help_request"
  | "goal_completed"
  | "abandonment_risk";

export type NotificationQueueStatus =
  | "draft"
  | "previewed"
  | "pending_provider_config"
  | "queued"
  | "sent"
  | "cancelled"
  | "blocked";

export type SafeNotificationQueueItem = {
  event: AccountabilityNotificationEvent;
  status: NotificationQueueStatus;
  templateKey: string;
  templateVersion: string;
  recipientEmailHash?: string;
  goalId: string;
  grantId?: string;
  safeSummary: string;
};
