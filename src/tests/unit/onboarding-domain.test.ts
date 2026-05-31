import { describe, expect, it } from "vitest";

import { buildCallingMockDraft, callingDraftSchema, reviewCallingDraftSafety } from "@/ai/schemas/calling";
import { analyzeLifeMap, lifeMapAreas } from "@/domain/life-map";
import { callingQuestions, getProgressiveUnlockState } from "@/domain/onboarding";

describe("life map analysis", () => {
  it("classifies strong, fragile and neglected areas without shaming language", () => {
    const analysis = analyzeLifeMap([
      { areaSlug: "faith", score: 8, note: "Tenho mantido constancia." },
      { areaSlug: "health", score: 3, note: "Sono e energia muito baixos." },
      { areaSlug: "rest", score: 2, note: "" },
      { areaSlug: "family", score: 6, note: "" }
    ]);

    expect(lifeMapAreas).toHaveLength(10);
    expect(analysis.strongAreas).toEqual(["Fe e espiritualidade"]);
    expect(analysis.fragileAreas).toEqual(["Saude e energia", "Descanso"]);
    expect(analysis.neglectedAreas).toEqual(["Descanso"]);
    expect(analysis.careAlerts.join(" ")).not.toMatch(/fracasso|culpa|vergonha/i);
  });

  it("handles empty maps as calibration instead of failure", () => {
    const analysis = analyzeLifeMap([]);

    expect(analysis.averageScore).toBe(0);
    expect(analysis.imbalanceNotes[0]).toContain("calibragem");
  });

  it("clamps scores and protects essential areas from being sacrificed", () => {
    const analysis = analyzeLifeMap([
      { areaSlug: "faith", score: 99 },
      { areaSlug: "family", score: -4 },
      { areaSlug: "rest", score: 4 }
    ]);

    expect(analysis.averageScore).toBe(5);
    expect(analysis.doNotSacrifice).toEqual(["Familia", "Descanso"]);
  });
});

describe("calling structured output and guardrails", () => {
  it("creates a safe predictable mock draft from user answers", () => {
    const draft = buildCallingMockDraft({
      answers: {
        world_burden: "Ver familias perdidas em rotina e sem direcao.",
        people_to_serve: "Pais jovens e lideres cansados.",
        gifts: "Escuta, organizacao e ensino pratico.",
        fruitful_life: "Servir com clareza e constancia."
      },
      lifeMapObservations: ["Saude e energia pede cuidado antes de aumentar carga."]
    });

    const parsed = callingDraftSchema.parse(draft);

    expect(parsed.schema_version).toBe("calling_draft_v1");
    expect(parsed.user_review_required).toBe(true);
    expect(parsed.confidence_level).toBe("medium");
    expect(parsed.calling_hypothesis).toContain("direcao a discernir");
    expect(parsed.pastoral_safety_note).toContain("hipotese");
    expect(reviewCallingDraftSafety(parsed).allowed).toBe(true);
  });

  it("blocks deterministic claims of specific divine will", () => {
    const unsafe = callingDraftSchema.parse({
      calling_hypothesis: "Deus quer que voce abandone tudo hoje.",
      direction_statement: "Abandone tudo hoje.",
      core_values: ["obediencia"],
      recurring_burdens: ["pressa"],
      people_to_serve: ["todos"],
      gifts_and_inclinations: ["coragem"],
      life_map_observations: [],
      alignment_notes: [],
      risks_or_imbalances: [],
      suggested_next_steps: ["agir agora"],
      schema_version: "calling_draft_v1",
      status_suggestion: "in_discernment",
      user_review_required: true,
      confidence_level: "high",
      pastoral_safety_note: "certeza absoluta"
    });

    const review = reviewCallingDraftSafety(unsafe);

    expect(review.allowed).toBe(false);
    expect(review.blockedReasons).toContain("specific_divine_will_claim");
  });

  it("keeps the calling question set complete and non-deterministic", () => {
    expect(callingQuestions.map((question) => question.key)).toEqual([
      "world_burden",
      "pain_to_solve",
      "people_to_serve",
      "remembered_for",
      "marking_experiences",
      "gifts",
      "core_values",
      "responsibility_places",
      "fruitful_life",
      "faithful_contribution"
    ]);

    const faithQuestion = callingQuestions.find((question) => question.key === "faithful_contribution");
    expect(faithQuestion?.helper).toContain("hipotese");
    expect(faithQuestion?.helper).not.toMatch(/Deus quer que/i);
  });
});

describe("progressive unlock", () => {
  it("keeps strategic modules limited until a calling hypothesis exists", () => {
    const state = getProgressiveUnlockState({ hasCallingHypothesis: false });

    expect(state.availableModules).toContain("Perfil");
    expect(state.availableModules).toContain("Mapa da Vida");
    expect(state.limitedModules).toContain("Alvos completos");
    expect(state.message).toContain("direcao");
  });

  it("unlocks strategic planning after a provisional calling exists", () => {
    const state = getProgressiveUnlockState({ hasCallingHypothesis: true });

    expect(state.limitedModules).not.toContain("Alvos completos");
    expect(state.nextRecommendedStep).toContain("alvo");
  });
});
