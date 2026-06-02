import { describe, expect, test } from "vitest";

import { gardenStateOutputSchema, weeklyReviewOutputSchema } from "@/ai/schemas";
import {
  buildGardenStateFromWeeklyReview,
  buildWeeklyReviewMock,
  createWeeklyReviewInputSchema,
  weeklyReviewQuestions
} from "@/domain/review";
import { gardenEventInputSchema, lifeGardenAreas } from "@/domain/garden";

describe("weekly review domain", () => {
  test("keeps the guided review short enough for low-friction completion", () => {
    expect(weeklyReviewQuestions).toHaveLength(15);
    expect(weeklyReviewQuestions[0]?.id).toBe("advanced");
    expect(weeklyReviewQuestions.at(-1)?.id).toBe("firstActionNextWeek");
  });

  test("builds a structured weekly review that values restart and avoids shame", () => {
    const input = createWeeklyReviewInputSchema.parse({
      weekStart: "2026-06-01",
      weekEnd: "2026-06-07",
      answers: {
        advanced: "Conclui dois blocos de foco e retomei caminhada.",
        stuck: "Adiei uma tarefa grande por cansaço.",
        completed: "Finalizei a primeira revisão do projeto.",
        postponed: "Empurrei a revisão financeira.",
        goalsProgressed: "Saúde e trabalho caminharam.",
        projectsPaused: "Finanças ficou parada.",
        habitsMaintained: "Caminhada mínima duas vezes.",
        restarts: "Voltei depois de falhar na terça.",
        excess: "Agenda apertada sem descanso.",
        neglectedAreas: "Família e descanso.",
        metacognition: "Percebi pensamento de tudo ou nada.",
        scoreboard: "Placar mostrou retomada e pausa consciente.",
        adjustments: "Reduzir escopo das manhãs.",
        nextWeekFocus: "Proteger descanso e concluir uma tarefa essencial.",
        firstActionNextWeek: "Bloquear 25 minutos para revisar finanças."
      },
      christianReflectionEnabled: true
    });

    const output = weeklyReviewOutputSchema.parse(buildWeeklyReviewMock(input));

    expect(output.schema_version).toBe("weekly_review_output_v1");
    expect(output.week_summary).toContain("Conclui dois blocos");
    expect(output.restart_moments).toEqual(expect.arrayContaining(["Voltei depois de falhar na terça."]));
    expect(output.overload_alerts[0]).toContain("Agenda apertada");
    expect(output.neglected_life_areas).toEqual(expect.arrayContaining(["Familia", "Descanso"]));
    expect(output.first_action_next_week).toContain("Bloquear 25 minutos");
    expect(output.encouragement.toLowerCase()).not.toContain("fracasso");
    expect(output.christian_reflection).toContain("graca");
    expect(output.user_review_required).toBe(true);
  });
});

describe("life garden domain", () => {
  test("builds a non-punitive garden from weekly review events", () => {
    const review = weeklyReviewOutputSchema.parse(
      buildWeeklyReviewMock(
        createWeeklyReviewInputSchema.parse({
          weekStart: "2026-06-01",
          weekEnd: "2026-06-07",
          answers: {
            advanced: "Retomei o cuidado com a saúde.",
            stuck: "Descanso ficou sem espaço.",
            restarts: "Retomada registrada no hábito.",
            excess: "Muitos blocos sem pausa.",
            neglectedAreas: "Descanso.",
            nextWeekFocus: "Proteger energia.",
            firstActionNextWeek: "Dormir 30 minutos mais cedo hoje."
          }
        })
      )
    );

    const garden = gardenStateOutputSchema.parse(buildGardenStateFromWeeklyReview(review));
    const restArea = garden.garden_state.life_areas.find((area) => area.area === "Descanso");

    expect(garden.schema_version).toBe("garden_state_output_v1");
    expect(garden.garden_state.life_areas).toHaveLength(lifeGardenAreas.length);
    expect(restArea?.care_needed).toBe(true);
    expect(restArea?.visual_state).toBe("needs_care");
    expect(restArea?.care_message.toLowerCase()).toContain("cuidado");
    expect(restArea?.care_message.toLowerCase()).not.toContain("falhou");
    expect(garden.garden_state.unlocked_items).toEqual(expect.arrayContaining(["Retomada visivel"]));
  });

  test("accepts garden events without storing sensitive raw notes", () => {
    const event = gardenEventInputSchema.parse({
      area: "Saúde e energia",
      eventType: "habit_restarted",
      impact: 3,
      sourceType: "habit",
      sourceId: "habit-1",
      metadataMinimal: {
        label: "retomada registrada",
        count: 1
      }
    });

    expect(event.impact).toBe(3);
    expect(event.metadataMinimal).not.toHaveProperty("raw_thought");
    expect(event.metadataMinimal).not.toHaveProperty("private_note");
  });
});
