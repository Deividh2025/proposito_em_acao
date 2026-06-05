import { describe, expect, test } from "vitest";

import {
  buildAnalyticsEvent,
  buildAnalyticsPersistenceRecord,
  PRODUCT_ANALYTICS_CONSENT_VERSION,
  PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION,
  productAnalyticsEventNames,
  sanitizeAnalyticsMetadata
} from "@/domain/analytics";

const grantedConsent = {
  granted: true,
  version: PRODUCT_ANALYTICS_CONSENT_VERSION,
  recordedAt: "2026-06-04T09:00:00.000Z",
  revokedAt: null
} as const;

describe("product analytics first-party contract", () => {
  test("keeps collection opt-in off and blocks missing or revoked consent", () => {
    expect(
      buildAnalyticsEvent({
        name: "action_completed",
        metadata: { module: "tasks" },
        occurredAt: "2026-06-04T12:00:00.000Z"
      })
    ).toMatchObject({
      ok: false,
      reason: "analytics_consent_missing"
    });

    expect(
      buildAnalyticsEvent({
        name: "action_completed",
        consent: { ...grantedConsent, granted: false },
        metadata: { module: "tasks" },
        occurredAt: "2026-06-04T12:00:00.000Z"
      })
    ).toMatchObject({
      ok: false,
      reason: "analytics_consent_missing"
    });

    expect(
      buildAnalyticsEvent({
        name: "action_completed",
        consent: { ...grantedConsent, revokedAt: "2026-06-04T13:00:00.000Z" },
        metadata: { module: "tasks" },
        occurredAt: "2026-06-04T12:00:00.000Z"
      })
    ).toMatchObject({
      ok: false,
      reason: "analytics_consent_revoked"
    });
  });

  test("permits only the minimal canonical first-party event names and local aliases", () => {
    expect(productAnalyticsEventNames).toEqual([
      "module_navigation",
      "action_created",
      "action_completed",
      "local_fallback_used",
      "flow_error",
      "feedback_submitted"
    ]);

    const canonicalFromLocalAlias = buildAnalyticsEvent({
      name: "task_completed",
      consent: grantedConsent,
      metadata: { module: "tasks", status: "success" },
      occurredAt: "2026-06-04T12:00:00.000Z"
    });

    expect(canonicalFromLocalAlias).toMatchObject({
      ok: true,
      event: {
        name: "action_completed",
        metadata: { module: "tasks", status: "success" }
      }
    });

    expect(
      buildAnalyticsEvent({
        name: "page_view",
        consent: grantedConsent,
        metadata: { module: "dashboard" },
        occurredAt: "2026-06-04T12:00:00.000Z"
      })
    ).toMatchObject({
      ok: false,
      reason: "analytics_event_not_allowed"
    });
  });

  test("keeps metadata allowlisted, categorical, and free of sensitive text", () => {
    expect(
      sanitizeAnalyticsMetadata({
        module: "tasks",
        source: "mobile",
        surface: "mobile_hub",
        status: "success",
        fallbackReason: "missing_session",
        errorKind: "rls_denied",
        alignedToCalling: true,
        score: 4,
        durationSeconds: 90,
        schemaVersion: PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION,
        consentVersion: PRODUCT_ANALYTICS_CONSENT_VERSION,
        route: "/metacognition/private-note/123",
        step: "texto livre sobre minha vida",
        raw_prompt: "pensamento privado",
        calling_text: "meu chamado completo",
        comment: "minha senha apareceu",
        goalTitle: "alvo privado",
        nested: { note: "nao deve entrar" }
      })
    ).toEqual({
      module: "tasks",
      source: "mobile",
      surface: "mobile_hub",
      status: "success",
      fallbackReason: "missing_session",
      errorKind: "rls_denied",
      alignedToCalling: true,
      score: 4,
      durationSeconds: 90,
      schemaVersion: PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION,
      consentVersion: PRODUCT_ANALYTICS_CONSENT_VERSION
    });
  });

  test("builds a pure server-side persistence record with 90 day expiry", () => {
    const result = buildAnalyticsEvent({
      name: "action_completed",
      consent: grantedConsent,
      metadata: {
        module: "tasks",
        source: "desktop",
        status: "success",
        alignedToCalling: true
      },
      occurredAt: "2026-06-04T12:00:00.000Z"
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("expected analytics event to be built");
    }

    expect(
      buildAnalyticsPersistenceRecord({
        userId: "00000000-0000-4000-8000-000000000001",
        event: result.event
      })
    ).toEqual({
      user_id: "00000000-0000-4000-8000-000000000001",
      event_name: "action_completed",
      metadata: {
        module: "tasks",
        source: "desktop",
        status: "success",
        alignedToCalling: true,
        schemaVersion: PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION,
        consentVersion: PRODUCT_ANALYTICS_CONSENT_VERSION
      },
      occurred_at: "2026-06-04T12:00:00.000Z",
      expires_at: "2026-09-02T12:00:00.000Z",
      consent_version: PRODUCT_ANALYTICS_CONSENT_VERSION,
      schema_version: PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION
    });
  });
});
