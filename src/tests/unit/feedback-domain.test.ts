import { describe, expect, test } from "vitest";

import {
  BETA_FEEDBACK_CONSENT_VERSION,
  betaFeedbackInputSchema,
  detectSensitiveFeedbackHint,
  prepareBetaFeedbackForPersistence,
  type BetaFeedbackInput
} from "@/domain/feedback";

const safeInput: BetaFeedbackInput = {
  module: "dashboard",
  worked: "A proxima acao ficou clara.",
  confused: "Nao entendi se era rascunho ou dado salvo.",
  blocked: "Nada travou.",
  clarityScore: 4,
  usefulnessScore: 5,
  frictionScore: 2,
  comment: "Usaria no beta depois do trabalho."
};

describe("beta feedback safe persistence contract", () => {
  test("requires explicit beta consent and notice before preparing persistence", () => {
    expect(
      prepareBetaFeedbackForPersistence({
        consentGranted: false,
        input: safeInput,
        noticeAccepted: true
      })
    ).toMatchObject({
      feedback: null,
      ok: false,
      reason: "missing_consent"
    });

    expect(
      prepareBetaFeedbackForPersistence({
        consentGranted: true,
        input: safeInput,
        noticeAccepted: false
      })
    ).toMatchObject({
      feedback: null,
      ok: false,
      reason: "missing_consent"
    });
  });

  test("blocks sensitive hints, private links and raw technical payloads before persistence", () => {
    expect(detectSensitiveFeedbackHint("Minha senha apareceu na tela")).toBe(true);
    expect(detectSensitiveFeedbackHint("https://app.example.test/reset?token=abc123")).toBe(true);
    expect(detectSensitiveFeedbackHint("Authorization: Bearer abcdefghijklmnopqrstuvwxyz")).toBe(
      true
    );
    expect(detectSensitiveFeedbackHint("Error: falhou\n    at action (src/app/page.ts:10:3)")).toBe(
      true
    );

    const result = prepareBetaFeedbackForPersistence({
      consentGranted: true,
      input: {
        ...safeInput,
        comment: "Meu token apareceu em um link privado."
      },
      noticeAccepted: true
    });

    expect(result).toMatchObject({
      feedback: null,
      ok: false,
      reason: "sensitive_hint"
    });
  });

  test("sanitizes and limits the first-party payload without analytics fields", () => {
    const result = prepareBetaFeedbackForPersistence({
      consentGranted: true,
      consentVersion: BETA_FEEDBACK_CONSENT_VERSION,
      input: {
        ...safeInput,
        worked: "  A proxima   acao\nficou clara.\u0000  ",
        comment: "  Uma frase curta.\nOutra linha. "
      },
      noticeAccepted: true,
      submittedAt: "2026-06-04T12:00:00.000Z"
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error("expected feedback payload to be prepared");
    }

    expect(Object.keys(result.feedback).sort()).toEqual(
      [
        "blocked",
        "clarityScore",
        "comment",
        "confused",
        "consentVersion",
        "expiresAt",
        "frictionScore",
        "module",
        "noticeAccepted",
        "submittedAt",
        "usefulnessScore",
        "worked"
      ].sort()
    );
    expect(result.feedback).toMatchObject({
      consentVersion: BETA_FEEDBACK_CONSENT_VERSION,
      expiresAt: "2026-09-02T12:00:00.000Z",
      noticeAccepted: true,
      submittedAt: "2026-06-04T12:00:00.000Z",
      worked: "A proxima acao ficou clara."
    });
    expect(JSON.stringify(result.feedback)).not.toContain("analytics");
  });

  test("rejects fields outside the beta feedback allowlist", () => {
    const parsed = betaFeedbackInputSchema.safeParse({
      ...safeInput,
      rawPayload: "nao deve ser aceito"
    });

    expect(parsed.success).toBe(false);
  });
});
