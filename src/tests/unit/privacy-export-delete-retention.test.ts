import { describe, expect, test } from "vitest";

import {
  ACCOUNT_DELETION_CONFIRMATION_TEXT,
  buildAccountDeletionDecision,
  buildPrivacyExport,
  planOperationalRetentionPrune,
  privacyRetentionPolicy
} from "@/domain/privacy";

describe("privacy export contract", () => {
  test("builds owner JSON export without secrets, tokens, hashes or internal traces", () => {
    const exportDocument = buildPrivacyExport({
      ownerUserId: "user-1",
      generatedAt: "2026-06-04T12:00:00.000Z",
      sections: [
        {
          name: "profile",
          records: [
            {
              id: "profile-1",
              user_id: "user-1",
              display_name: "Ana",
              access_token: "secret-token-value",
              invite_token_hash: "hash-value",
              internal_logs: ["stack trace"],
              raw_prompt: "prompt bruto privado",
              metadata: {
                source: "settings",
                webhook_secret: "secret-webhook-value"
              }
            }
          ]
        },
        {
          name: "accountability",
          records: [
            {
              id: "grant-owned",
              user_id: "user-1",
              goal_id: "goal-1",
              permissions: ["goal_status"],
              partner_email: "atalia@example.test",
              audit_log: { stack_trace: "private stack" }
            },
            {
              id: "grant-third-party",
              user_id: "other-user",
              goal_id: "goal-2",
              permissions: ["goal_status"],
              invite_token: "third-party-token"
            }
          ]
        }
      ]
    });

    expect(exportDocument.schema_version).toBe("privacy_export_v1");
    expect(exportDocument.owner_user_id).toBe("user-1");
    expect(exportDocument.data.profile).toEqual([
      {
        id: "profile-1",
        user_id: "user-1",
        display_name: "Ana",
        metadata: {
          source: "settings"
        }
      }
    ]);
    expect(exportDocument.data.accountability).toEqual([
      {
        id: "grant-owned",
        user_id: "user-1",
        goal_id: "goal-1",
        permissions: ["goal_status"],
        partner_email: "atalia@example.test"
      }
    ]);
    expect(exportDocument.omitted_field_count).toBe(6);
    expect(exportDocument.omitted_record_count).toBe(1);

    const serialized = JSON.stringify(exportDocument);
    expect(serialized).not.toContain("secret-token-value");
    expect(serialized).not.toContain("hash-value");
    expect(serialized).not.toContain("secret-webhook-value");
    expect(serialized).not.toContain("prompt bruto privado");
    expect(serialized).not.toContain("stack trace");
    expect(serialized).not.toContain("third-party-token");
  });
});

describe("account deletion contract", () => {
  test("requires explicit confirmation before deletion can be requested", () => {
    const decision = buildAccountDeletionDecision({
      ownerUserId: "user-1",
      requestedAt: "2026-06-04T12:00:00.000Z",
      confirmationText: "excluir",
      adminDeletionAvailable: true,
      adminDeletionIsolated: true
    });

    expect(decision).toMatchObject({
      ok: false,
      mode: "blocked",
      reason: "missing_explicit_confirmation"
    });
  });

  test("falls back to a safe request when complete admin deletion is not isolated", () => {
    const decision = buildAccountDeletionDecision({
      ownerUserId: "user-1",
      requestedAt: "2026-06-04T12:00:00.000Z",
      confirmationText: ACCOUNT_DELETION_CONFIRMATION_TEXT,
      adminDeletionAvailable: true,
      adminDeletionIsolated: false,
      reason: "Quero encerrar minha conta."
    });

    expect(decision.ok).toBe(true);
    expect(decision.mode).toBe("safe-request");
    if (!decision.ok) {
      throw new Error("expected account deletion request to be accepted");
    }

    expect(decision.request).toMatchObject({
      user_id: "user-1",
      status: "pending_manual_review",
      requested_at: "2026-06-04T12:00:00.000Z",
      reason: "Quero encerrar minha conta.",
      revoke_consent_scopes: [
        "ai_provider_openai_v1",
        "ai_provider_deepseek_v1",
        "product_analytics_v1",
        "beta_feedback_v1"
      ]
    });
    expect(decision.request.admin_deletion_allowed).toBe(false);
  });
});

describe("operational retention contract", () => {
  test("keeps analytics, feedback and AI audit on a 90 day retention target", () => {
    expect(privacyRetentionPolicy.days).toBe(90);
    expect(privacyRetentionPolicy.targets).toEqual([
      "product_analytics_events",
      "beta_feedback_items",
      "ai_run_audits"
    ]);
  });

  test("plans pruning only for expired operational records", () => {
    const plan = planOperationalRetentionPrune({
      now: "2026-06-04T00:00:00.000Z",
      records: [
        {
          id: "analytics-old",
          table: "product_analytics_events",
          timestamp: "2026-02-01T00:00:00.000Z"
        },
        {
          id: "analytics-new",
          table: "product_analytics_events",
          timestamp: "2026-05-01T00:00:00.000Z"
        },
        {
          id: "feedback-old",
          table: "beta_feedback_items",
          created_at: "2026-01-15T00:00:00.000Z"
        },
        {
          id: "ai-audit-old",
          table: "ai_run_audits",
          occurred_at: "2026-02-10T00:00:00.000Z"
        },
        {
          id: "goal-old",
          table: "goals",
          created_at: "2025-01-01T00:00:00.000Z"
        }
      ]
    });

    expect(plan.cutoff).toBe("2026-03-06T00:00:00.000Z");
    expect(plan.delete.map((record) => record.id)).toEqual([
      "analytics-old",
      "feedback-old",
      "ai-audit-old"
    ]);
    expect(plan.keep.map((record) => record.id)).toEqual(["analytics-new", "goal-old"]);
  });
});
