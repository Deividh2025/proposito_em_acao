import type { ProductAnalyticsEvent, ProductAnalyticsEventName, ProductAnalyticsMetadata } from "./types";

export * from "./types";

const allowedMetadataKeys = new Set([
  "module",
  "source",
  "step",
  "status",
  "score",
  "durationSeconds",
  "durationMinutes",
  "count",
  "attempt",
  "alignedToCalling",
  "surface",
  "device",
  "route",
  "schemaVersion",
  "consentVersion"
]);

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
  "phone"
];

type AnalyticsEventInput = {
  name: ProductAnalyticsEventName;
  consentGranted: boolean;
  metadata?: Record<string, unknown>;
  occurredAt?: string;
};

function isSensitiveMetadataKey(key: string) {
  if (key === "alignedToCalling") {
    return false;
  }

  const normalized = key.toLowerCase();

  return sensitiveKeyFragments.some((fragment) => normalized.includes(fragment.toLowerCase()));
}

function isSafeMetadataValue(value: unknown): value is boolean | number | string {
  return ["boolean", "number", "string"].includes(typeof value);
}

export function sanitizeAnalyticsMetadata(input: Record<string, unknown> = {}): ProductAnalyticsMetadata {
  return Object.entries(input).reduce<ProductAnalyticsMetadata>((safeMetadata, [key, value]) => {
    if (!allowedMetadataKeys.has(key) || isSensitiveMetadataKey(key) || !isSafeMetadataValue(value)) {
      return safeMetadata;
    }

    safeMetadata[key] = typeof value === "string" ? value.slice(0, 80) : value;
    return safeMetadata;
  }, {});
}

export function buildAnalyticsEvent(input: AnalyticsEventInput): ProductAnalyticsEvent {
  return {
    name: input.name,
    consentGranted: input.consentGranted,
    metadata: input.consentGranted ? sanitizeAnalyticsMetadata(input.metadata) : {},
    occurredAt: input.occurredAt ?? new Date().toISOString()
  };
}
