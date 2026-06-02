import { describe, expect, test } from "vitest";

import { reviewOwnerPersistenceSafety } from "@/ai/guardrails";
import { actionUnblockerOutputSchema, metacognitionOutputSchema } from "@/ai/schemas";
import { buildActionUnblockerMock } from "@/domain/action-unblocker";
import { buildMetacognitionMock } from "@/domain/metacognition";

describe("Prompt 10 action unblocker domain", () => {
  test("generates a short first step and minimum viable action", () => {
    const output = actionUnblockerOutputSchema.parse(
      buildActionUnblockerMock({
        taskTitle: "Organizar documentos da semana",
        energyLevel: "low",
        availableMinutes: 5,
        obstacle: "Nao sei por onde comecar",
        tone: "leve"
      })
    );

    expect(output.first_step).toContain("2 minutos");
    expect(output.microtasks[0]?.estimated_minutes).toBeLessThanOrEqual(5);
    expect(output.recommended_focus_minutes).toBeLessThanOrEqual(5);
    expect(output.user_review_required).toBe(true);
  });

  test("suggests metacognition when fear or perfectionism is the blocker", () => {
    const output = actionUnblockerOutputSchema.parse(
      buildActionUnblockerMock({
        taskTitle: "Enviar proposta",
        energyLevel: "medium",
        availableMinutes: 15,
        obstacle: "Tenho medo de errar e ficar perfeito demais",
        tone: "equilibrado"
      })
    );

    expect(output.suggest_metacognition).toBe(true);
    expect(output.next_route).toBe("metacognition");
    expect(output.reason_to_suggest_metacognition).toContain("pensamento");
  });

  test("routes crisis away from productivity", () => {
    const output = actionUnblockerOutputSchema.parse(
      buildActionUnblockerMock({
        taskTitle: "Terminar relatorio",
        energyLevel: "low",
        availableMinutes: 5,
        obstacle: "Se eu nao terminar, vou me machucar",
        tone: "firme"
      })
    );

    expect(output.crisis_detected).toBe(true);
    expect(output.next_route).toBe("human_help");
    expect(output.human_help_recommended).toBe(true);
  });
});

describe("Prompt 10 metacognition domain", () => {
  test("separates fact, interpretation, feeling and impulse", () => {
    const output = metacognitionOutputSchema.parse(
      buildMetacognitionMock({
        stateText: "Estou ansioso porque a tarefa ficou parada e acho que sempre falho.",
        intensity: 6,
        automaticThought: "Eu sempre falho",
        impulse: "evitar abrir a tarefa",
        allowChristianAnchor: false
      })
    );

    expect(output.fact).toContain("tarefa");
    expect(output.interpretation).toContain("sempre");
    expect(output.feeling).toContain("ansiedade");
    expect(output.impulse).toContain("evitar");
    expect(output.cognitive_patterns).toEqual(expect.arrayContaining(["generalizacao excessiva"]));
    expect(output.share_with_accountability_allowed).toBe(false);
  });

  test("does not turn crisis into a productivity route", () => {
    const output = metacognitionOutputSchema.parse(
      buildMetacognitionMock({
        stateText: "Nao quero acordar amanha e quero sumir.",
        intensity: 9,
        automaticThought: "Nao ha saida",
        impulse: "sumir",
        allowChristianAnchor: true
      })
    );

    expect(output.recommended_route).toBe("emergency_support");
    expect(output.safety_flags).toContain("risco_emocional_grave");
    expect(output.next_action).toContain("ajuda humana");
    expect(output.christian_anchor).toBeNull();
  });
});

describe("owner-only persistence safety", () => {
  test("blocks client-supplied structured output with pastoral coercion before persistence", () => {
    const output = actionUnblockerOutputSchema.parse(
      buildActionUnblockerMock({
        taskTitle: "Enviar proposta",
        energyLevel: "medium",
        availableMinutes: 15,
        obstacle: "medo de errar",
        tone: "firme"
      })
    );

    const review = reviewOwnerPersistenceSafety({
      reviewedSchemaVersion: output.schema_version,
      value: {
        ...output,
        first_step: "Deus mandou voce enviar agora, se voce nao fizer isso e pecado."
      }
    });

    expect(review.safe_to_persist).toBe(false);
    expect(review.blocked_behaviors).toEqual(
      expect.arrayContaining(["specific_divine_will_claim", "spiritual_guilt"])
    );
  });
});
