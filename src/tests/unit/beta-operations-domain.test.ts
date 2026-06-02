import { describe, expect, test } from "vitest";

import {
  activationEventNames,
  buildAnalyticsEvent,
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
    expect(activationEventNames).toContain("profile_completed");
    expect(activationEventNames).toContain("first_goal_created");
    expect(retentionEventNames).toContain("weekly_returned");
    expect(retentionEventNames).toContain("recurring_metacognition_used");
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
    const event = buildAnalyticsEvent({
      name: "task_completed",
      consentGranted: true,
      metadata: {
        module: "tasks",
        alignedToCalling: true,
        content: "tarefa privada",
        goalTitle: "alvo privado"
      }
    });

    expect(event.name).toBe("task_completed");
    expect(event.consentGranted).toBe(true);
    expect(event.metadata).toEqual({
      module: "tasks",
      alignedToCalling: true
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
    expect(draft.message).toContain("modo beta/local");
    expect(draft.hasSensitiveHint).toBe(false);
  });
});
