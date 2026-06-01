import { describe, expect, test } from "vitest";

import { habitPlanOutputSchema, scoreboardPlanOutputSchema } from "@/ai/schemas";
import {
  captureFocusDistractionInputSchema,
  completeFocusSessionInputSchema,
  focusDurationOptions,
  formatFocusTime,
  startFocusSessionInputSchema
} from "@/domain/focus";
import { buildHabitPlanMock, createHabitPlanInputSchema, logHabitInputSchema } from "@/domain/habits";
import {
  buildScoreboardPlanMock,
  generateScoreboardPlanInputSchema,
  markScoreboardItemInputSchema,
  scoreboardStatusValue
} from "@/domain/scoreboard";

describe("focus mode domain", () => {
  test("accepts the Prompt 11 focus durations and formats remaining time", () => {
    expect(focusDurationOptions.map((option) => option.value)).toEqual([5, 15, 25, 50]);
    expect(formatFocusTime(125)).toBe("02:05");
  });

  test("validates starting, completing and capturing distractions without ending focus", () => {
    const start = startFocusSessionInputSchema.parse({
      durationMinutes: 25,
      nextStep: "Abrir o documento",
      reason: "Tirar a primeira decisao da frente",
      taskTitle: "Organizar proposta"
    });

    const distraction = captureFocusDistractionInputSchema.parse({
      content: "Responder mensagem depois",
      routeToInbox: true,
      sessionId: "local-focus",
      type: "reminder"
    });

    const completion = completeFocusSessionInputSchema.parse({
      completeTask: false,
      completionNote: "Fiz o primeiro bloco",
      postEnergyLevel: "medium",
      sessionId: "local-focus"
    });

    expect(start.durationMinutes).toBe(25);
    expect(distraction.routeToInbox).toBe(true);
    expect(completion.completeTask).toBe(false);
  });
});

describe("habit domain", () => {
  test("builds a safe habit plan with minimum version and restart route", () => {
    const input = createHabitPlanInputSchema.parse({
      bestContext: "depois do almoco",
      desiredHabit: "caminhar",
      frequency: "daily",
      lifeArea: "Saude",
      likelyDifficulty: "esquecer quando o dia apertar",
      reason: "cuidar do corpo com baixa friccao"
    });

    const output = habitPlanOutputSchema.parse(buildHabitPlanMock(input));

    expect(output.minimum_version).toContain("caminhar");
    expect(output.restart_plan).toContain("sem compensar");
    expect(output.user_review_required).toBe(true);
  });

  test("allows restart and conscious pause as habit logs", () => {
    expect(logHabitInputSchema.parse({ habitId: "habit-1", status: "restarted" }).status).toBe(
      "restarted"
    );
    expect(
      logHabitInputSchema.parse({ habitId: "habit-1", status: "paused_consciously" }).status
    ).toBe("paused_consciously");
  });
});

describe("scoreboard domain", () => {
  test("builds a private, reviewable scoreboard plan", () => {
    const input = generateScoreboardPlanInputSchema.parse({
      focus: "execucao diaria",
      includeFocus: true,
      includeHabits: true,
      includeRestarts: true,
      period: "weekly"
    });

    const output = scoreboardPlanOutputSchema.parse(buildScoreboardPlanMock(input));

    expect(output.restart_tracking).toBe(true);
    expect(output.items.map((item) => item.type)).toEqual(expect.arrayContaining(["focus", "restart"]));
    expect(output.user_review_required).toBe(true);
  });

  test("maps scoreboard statuses without punishing restarts", () => {
    expect(scoreboardStatusValue("done")).toBe(1);
    expect(scoreboardStatusValue("partial")).toBe(0.5);
    expect(scoreboardStatusValue("restarted")).toBe(1);
    expect(scoreboardStatusValue("paused_consciously")).toBe(0.25);

    expect(
      markScoreboardItemInputSchema.parse({
        itemId: "item-1",
        scoreboardId: "scoreboard-1",
        status: "restarted"
      }).status
    ).toBe("restarted");
  });
});
