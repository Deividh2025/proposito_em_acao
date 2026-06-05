import { describe, expect, test } from "vitest";

import {
  PRODUCT_ANALYTICS_CONSENT_VERSION,
  PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION,
  activationEventNames,
  buildAnalyticsEvent,
  productAnalyticsEventNames,
  retentionEventNames,
  sanitizeAnalyticsMetadata
} from "@/domain/analytics";
import {
  betaFeedbackInputSchema,
  buildFeedbackDraft,
  detectSensitiveFeedbackHint
} from "@/domain/feedback";

describe("Prompt 17 beta analytics domain", () => {
  test("defines activation and retention events without sensitive payload names", () => {
    expect(productAnalyticsEventNames).toEqual([
      "module_navigation",
      "action_created",
      "action_completed",
      "local_fallback_used",
      "flow_error",
      "feedback_submitted"
    ]);
    expect(activationEventNames).toEqual(["action_created"]);
    expect(retentionEventNames).toEqual(["module_navigation", "action_completed"]);
  });

  test("keeps analytics metadata minimal and strips sensitive keys", () => {
    const metadata = sanitizeAnalyticsMetadata({
      module: "metacognition",
      source: "mobile",
      step: "completed",
      raw_prompt: "meu pensamento privado",
      calling_text: "meu chamado completo",
      score: 4,
      nested: { note: "nao deve entrar" }
    });

    expect(metadata).toEqual({
      module: "metacognition",
      source: "mobile",
      step: "completed",
      score: 4
    });
  });

  test("builds a consent-aware analytics event without user content", () => {
    const eventResult = buildAnalyticsEvent({
      name: "task_completed",
      consent: {
        granted: true,
        version: PRODUCT_ANALYTICS_CONSENT_VERSION,
        recordedAt: "2026-06-04T09:00:00.000Z",
        revokedAt: null
      },
      metadata: {
        module: "tasks",
        alignedToCalling: true,
        content: "tarefa privada",
        goalTitle: "alvo privado"
      }
    });

    expect(eventResult.ok).toBe(true);

    if (!eventResult.ok) {
      throw new Error("expected analytics event to be built");
    }

    expect(eventResult.event.name).toBe("action_completed");
    expect(eventResult.event.metadata).toEqual({
      module: "tasks",
      alignedToCalling: true,
      schemaVersion: PRODUCT_ANALYTICS_EVENT_SCHEMA_VERSION,
      consentVersion: PRODUCT_ANALYTICS_CONSENT_VERSION
    });
  });
});

describe("Prompt 17 beta feedback domain", () => {
  test("validates a low-friction beta feedback draft", () => {
    const input = betaFeedbackInputSchema.parse({
      module: "dashboard",
      worked: "A proxima acao ficou clara.",
      confused: "Nao entendi o que era beta.",
      blocked: "Nada travou.",
      clarityScore: 4,
      usefulnessScore: 5,
      frictionScore: 2,
      comment: "Usaria de manha antes de abrir outras tarefas."
    });

    expect(input.module).toBe("dashboard");
    expect(input.usefulnessScore).toBe(5);
  });

  test("detects sensitive hints before feedback is sent outside the app", () => {
    expect(detectSensitiveFeedbackHint("minha senha e meus exames apareceram na tela")).toBe(true);
    expect(detectSensitiveFeedbackHint("o botão de começar ficou claro")).toBe(false);
  });

  test("prepares feedback locally and avoids promising production persistence", () => {
    const draft = buildFeedbackDraft({
      module: "metacognition",
      worked: "A separacao fato e interpretacao ajudou.",
      confused: "Fiquei em duvida sobre salvar.",
      blocked: "Nao travou.",
      clarityScore: 4,
      usefulnessScore: 4,
      frictionScore: 3,
      comment: "Talvez precise ser mais curto."
    });

    expect(draft.mode).toBe("local-draft");
    expect(draft.message).toContain("Rascunho local/dev preparado");
    expect(draft.message).toContain("Nada foi enviado para canal externo");
    expect(draft.hasSensitiveHint).toBe(false);
  });
});
