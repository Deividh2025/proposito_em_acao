export const productAnalyticsEventNames = [
  "module_navigation",
  "action_created",
  "action_completed",
  "local_fallback_used",
  "flow_error",
  "feedback_submitted"
] as const;

export type ProductAnalyticsEventName = (typeof productAnalyticsEventNames)[number];

export const activationEventNames = ["action_created"] as const;

export const retentionEventNames = ["module_navigation", "action_completed"] as const;

export const persistableProductAnalyticsEventNames = productAnalyticsEventNames;

export type PersistableProductAnalyticsEventName = (typeof persistableProductAnalyticsEventNames)[number];

export const productAnalyticsEventAliases = {
  first_goal_created: "action_created",
  first_project_created: "action_created",
  first_task_created: "action_created",
  goal_created: "action_created",
  project_created: "action_created",
  task_created: "action_created",
  habit_created: "action_created",
  inbox_item_captured: "action_created",
  accountability_invite_created: "action_created",
  task_completed: "action_completed",
  focus_completed: "action_completed",
  habit_logged: "action_completed",
  scoreboard_marked: "action_completed",
  weekly_review_completed: "action_completed",
  inbox_item_processed: "action_completed",
  mobile_capture_used: "action_completed",
  fallback_local_used: "local_fallback_used",
  local_draft_prepared: "local_fallback_used",
  beta_feedback_submitted: "feedback_submitted"
} as const satisfies Record<string, ProductAnalyticsEventName>;

export type ProductAnalyticsEventAlias = keyof typeof productAnalyticsEventAliases;

export type ProductAnalyticsEventInputName = ProductAnalyticsEventName | ProductAnalyticsEventAlias | string;

export const PRODUCT_ANALYTICS_CONSENT_VERSION = "product_analytics_v1" as const;

export const PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION = "product_analytics_event_v1" as const;

export const PRODUCT_ANALYTICS_RETENTION_DAYS = 90 as const;

export type ProductAnalyticsMetadataValue = boolean | number | string;

export type ProductAnalyticsMetadata = Record<string, ProductAnalyticsMetadataValue>;

export type ProductAnalyticsConsent = {
  granted: boolean;
  version?: string | null;
  recordedAt?: string | null;
  revokedAt?: string | null;
};

export type ProductAnalyticsBlockReason =
  | "analytics_consent_missing"
  | "analytics_consent_revoked"
  | "analytics_event_not_allowed";

export type ProductAnalyticsEvent = {
  name: ProductAnalyticsEventName;
  metadata: ProductAnalyticsMetadata;
  occurredAt: string;
  consentVersion: typeof PRODUCT_ANALYTICS_CONSENT_VERSION;
  schemaVersion: typeof PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION;
};

export type ProductAnalyticsBuildResult =
  | {
      ok: true;
      event: ProductAnalyticsEvent;
    }
  | {
      ok: false;
      reason: ProductAnalyticsBlockReason;
    };

export type ProductAnalyticsPersistenceBlockReason =
  | "missing_consent"
  | "revoked_consent"
  | "event_not_allowlisted"
  | "sensitive_metadata";

export type PersistableProductAnalyticsEvent = {
  name: PersistableProductAnalyticsEventName;
  metadata: ProductAnalyticsMetadata;
  occurredAt: string;
  consentVersion: typeof PRODUCT_ANALYTICS_CONSENT_VERSION;
  schemaVersion: typeof PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION;
  expiresAt: string;
};

export type ProductAnalyticsPersistenceResult =
  | {
      ok: true;
      event: PersistableProductAnalyticsEvent;
      reason: null;
    }
  | {
      ok: false;
      event: null;
      reason: ProductAnalyticsPersistenceBlockReason;
    };

export type ProductAnalyticsPersistenceRecord = {
  user_id: string;
  event_name: ProductAnalyticsEventName;
  metadata: ProductAnalyticsMetadata;
  occurred_at: string;
  expires_at: string;
  consent_version: typeof PRODUCT_ANALYTICS_CONSENT_VERSION;
  schema_version: typeof PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION;
};
