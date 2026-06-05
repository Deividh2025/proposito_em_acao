import type {
  PersistableProductAnalyticsEventName,
  ProductAnalyticsBuildResult,
  ProductAnalyticsConsent,
  ProductAnalyticsEvent,
  ProductAnalyticsEventInputName,
  ProductAnalyticsEventName,
  ProductAnalyticsMetadata,
  ProductAnalyticsMetadataValue,
  ProductAnalyticsPersistenceRecord,
  ProductAnalyticsPersistenceResult
} from "./types";
import {
  PRODUCT_ANALYTICS_CONSENT_VERSION,
  PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION,
  PRODUCT_ANALYTICS_RETENTION_DAYS,
  persistableProductAnalyticsEventNames,
  productAnalyticsEventAliases,
  productAnalyticsEventNames
} from "./types";

export * from "./types";

const allowedStringMetadataValues: Record<string, ReadonlySet<string>> = {
  module: new Set([
    "dashboard",
    "calling",
    "goals",
    "projects",
    "tasks",
    "calendar",
    "inbox",
    "action_unblocker",
    "metacognition",
    "focus",
    "habits",
    "scoreboard",
    "review",
    "garden",
    "accountability",
    "mobile",
    "settings",
    "feedback"
  ]),
  source: new Set(["desktop", "mobile", "pwa", "server_action", "domain", "local_demo", "preview", "beta", "production"]),
  surface: new Set(["app_shell", "settings", "right_panel", "mobile_hub", "server", "domain"]),
  actionType: new Set([
    "goal",
    "project",
    "task",
    "habit",
    "calendar_block",
    "inbox_item",
    "feedback",
    "accountability_invite",
    "focus_session",
    "scoreboard_entry",
    "weekly_review",
    "garden_event"
  ]),
  flow: new Set(["onboarding", "planning", "execution", "reflection", "accountability", "feedback", "settings", "pwa"]),
  step: new Set(["started", "created", "completed", "submitted", "blocked", "failed", "navigation"]),
  status: new Set(["success", "blocked", "failed", "local_draft", "local_fallback", "pending_provider_config"]),
  fallbackReason: new Set([
    "missing_session",
    "missing_config",
    "local_demo",
    "persistence_unavailable",
    "provider_blocked",
    "consent_missing",
    "consent_revoked"
  ]),
  errorKind: new Set([
    "auth_required",
    "consent_required",
    "persistence_failed",
    "rls_denied",
    "provider_unavailable",
    "validation_failed",
    "unknown"
  ]),
  device: new Set(["desktop", "mobile", "tablet"]),
  schemaVersion: new Set([PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION]),
  consentVersion: new Set([PRODUCT_ANALYTICS_CONSENT_VERSION])
};

const allowedNumberMetadataKeys = new Set(["score", "durationSeconds", "durationMinutes", "count", "attempt"]);

const allowedBooleanMetadataKeys = new Set(["alignedToCalling"]);

const sensitiveKeyFragments = [
  "prompt",
  "response",
  "raw",
  "content",
  "text",
  "note",
  "comment",
  "calling",
  "metacognition",
  "emotion",
  "health",
  "faith",
  "family",
  "finance",
  "calendarDetail",
  "token",
  "secret",
  "password",
  "email",
  "name",
  "phone",
  "title",
  "message",
  "body",
  "url",
  "route"
];

type AnalyticsEventInput = {
  name: ProductAnalyticsEventInputName;
  consent?: ProductAnalyticsConsent;
  metadata?: Record<string, unknown>;
  occurredAt?: string;
};

type AnalyticsPersistenceInput = {
  name: ProductAnalyticsEventInputName;
  consentGranted: boolean;
  consentRevoked?: boolean;
  consentVersion?: string | null;
  metadata?: Record<string, unknown>;
  occurredAt?: string;
  retentionDays?: number;
};

type ProductAnalyticsPersistenceRecordInput = {
  userId: string;
  event: ProductAnalyticsEvent;
  retentionDays?: number;
};

function isSensitiveMetadataKey(key: string) {
  if (key === "alignedToCalling") {
    return false;
  }

  const normalized = key.toLowerCase();

  return sensitiveKeyFragments.some((fragment) => normalized.includes(fragment.toLowerCase()));
}

function isAllowedStringMetadataEntry(key: string, value: string) {
  const allowedValues = allowedStringMetadataValues[key as keyof typeof allowedStringMetadataValues];

  return Boolean(allowedValues?.has(value));
}

function isAllowedNumberMetadataEntry(key: string, value: number) {
  if (!allowedNumberMetadataKeys.has(key) || !Number.isFinite(value)) {
    return false;
  }

  if (key === "score") {
    return value >= 0 && value <= 5;
  }

  return value >= 0 && value <= 86400;
}

function isAllowedBooleanMetadataEntry(key: string, value: boolean) {
  return allowedBooleanMetadataKeys.has(key) && typeof value === "boolean";
}

function isAllowedMetadataEntry(key: string, value: unknown): value is ProductAnalyticsMetadataValue {
  if (isSensitiveMetadataKey(key)) {
    return false;
  }

  if (typeof value === "string") {
    return isAllowedStringMetadataEntry(key, value);
  }

  if (typeof value === "number") {
    return isAllowedNumberMetadataEntry(key, value);
  }

  if (typeof value === "boolean") {
    return isAllowedBooleanMetadataEntry(key, value);
  }

  return false;
}

function hasUnsafeMetadata(input: Record<string, unknown> = {}) {
  return Object.entries(input).some(([key, value]) => !isAllowedMetadataEntry(key, value));
}

function isCanonicalEventName(name: string): name is ProductAnalyticsEventName {
  return productAnalyticsEventNames.includes(name as ProductAnalyticsEventName);
}

function isPersistableEventName(name: string): name is PersistableProductAnalyticsEventName {
  return persistableProductAnalyticsEventNames.includes(name as PersistableProductAnalyticsEventName);
}

export function resolveProductAnalyticsEventName(name: ProductAnalyticsEventInputName): ProductAnalyticsEventName | null {
  if (isCanonicalEventName(name)) {
    return name;
  }

  return productAnalyticsEventAliases[name as keyof typeof productAnalyticsEventAliases] ?? null;
}

function getConsentBlockReason(consent?: ProductAnalyticsConsent) {
  if (!consent?.granted || consent.version !== PRODUCT_ANALYTICS_CONSENT_VERSION) {
    return "analytics_consent_missing" as const;
  }

  if (consent.revokedAt) {
    return "analytics_consent_revoked" as const;
  }

  return null;
}

function addRetentionDays(occurredAt: string, retentionDays: number) {
  const parsed = new Date(occurredAt);
  const baseTime = Number.isFinite(parsed.getTime()) ? parsed.getTime() : Date.now();
  const safeRetentionDays =
    Number.isFinite(retentionDays) && retentionDays > 0 ? retentionDays : PRODUCT_ANALYTICS_RETENTION_DAYS;

  return new Date(baseTime + safeRetentionDays * 24 * 60 * 60 * 1000).toISOString();
}

function withRequiredMetadata(metadata: ProductAnalyticsMetadata): ProductAnalyticsMetadata {
  return {
    ...metadata,
    schemaVersion: PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION,
    consentVersion: PRODUCT_ANALYTICS_CONSENT_VERSION
  };
}

export function sanitizeAnalyticsMetadata(input: Record<string, unknown> = {}): ProductAnalyticsMetadata {
  return Object.entries(input).reduce<ProductAnalyticsMetadata>((safeMetadata, [key, value]) => {
    if (!isAllowedMetadataEntry(key, value)) {
      return safeMetadata;
    }

    safeMetadata[key] = value;
    return safeMetadata;
  }, {});
}

export function buildAnalyticsEvent(input: AnalyticsEventInput): ProductAnalyticsBuildResult {
  const eventName = resolveProductAnalyticsEventName(input.name);

  if (!eventName) {
    return {
      ok: false,
      reason: "analytics_event_not_allowed"
    };
  }

  const consentBlockReason = getConsentBlockReason(input.consent);

  if (consentBlockReason) {
    return {
      ok: false,
      reason: consentBlockReason
    };
  }

  return {
    event: {
      consentVersion: PRODUCT_ANALYTICS_CONSENT_VERSION,
      metadata: withRequiredMetadata(sanitizeAnalyticsMetadata(input.metadata)),
      name: eventName,
      occurredAt: input.occurredAt ?? new Date().toISOString(),
      schemaVersion: PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION
    },
    ok: true
  };
}

export function buildAnalyticsPersistenceRecord(
  input: ProductAnalyticsPersistenceRecordInput
): ProductAnalyticsPersistenceRecord {
  return {
    user_id: input.userId,
    event_name: input.event.name,
    metadata: withRequiredMetadata(input.event.metadata),
    occurred_at: input.event.occurredAt,
    expires_at: addRetentionDays(input.event.occurredAt, input.retentionDays ?? PRODUCT_ANALYTICS_RETENTION_DAYS),
    consent_version: PRODUCT_ANALYTICS_CONSENT_VERSION,
    schema_version: PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION
  };
}

export function prepareAnalyticsEventForPersistence(input: AnalyticsPersistenceInput): ProductAnalyticsPersistenceResult {
  if (!input.consentGranted || input.consentVersion !== PRODUCT_ANALYTICS_CONSENT_VERSION) {
    return {
      event: null,
      ok: false,
      reason: "missing_consent"
    };
  }

  if (input.consentRevoked) {
    return {
      event: null,
      ok: false,
      reason: "revoked_consent"
    };
  }

  const eventName = resolveProductAnalyticsEventName(input.name);

  if (!eventName || !isPersistableEventName(eventName)) {
    return {
      event: null,
      ok: false,
      reason: "event_not_allowlisted"
    };
  }

  if (hasUnsafeMetadata(input.metadata)) {
    return {
      event: null,
      ok: false,
      reason: "sensitive_metadata"
    };
  }

  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const metadata = withRequiredMetadata(sanitizeAnalyticsMetadata(input.metadata));

  return {
    event: {
      consentVersion: PRODUCT_ANALYTICS_CONSENT_VERSION,
      expiresAt: addRetentionDays(occurredAt, input.retentionDays ?? PRODUCT_ANALYTICS_RETENTION_DAYS),
      metadata,
      name: eventName,
      occurredAt,
      schemaVersion: PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION
    },
    ok: true,
    reason: null
  };
}
