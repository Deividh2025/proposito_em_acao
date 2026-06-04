export type AccountabilityNotificationEvent =
  | "invite"
  | "invite_accepted"
  | "grant_revoked"
  | "commitment_document_shared"
  | "milestone_completed"
  | "delay_alert"
  | "help_request"
  | "goal_completed"
  | "abandonment_risk"
  | "important_status_authorized";

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
