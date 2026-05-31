import { describe, expect, test } from "vitest";

import { projectPlanOutputSchema, smartGoalOutputSchema, taskBreakdownOutputSchema } from "@/ai/schemas";
import { buildExecutionOverview } from "@/domain/execution";
import { buildProjectPlanMock } from "@/domain/projects";
import { buildSmartGoalMockDraft } from "@/domain/goals";
import { breakTaskIntoMicrotasks } from "@/domain/tasks";

describe("execution domain", () => {
  test("turns a vague desire into a reviewed SMART-E goal with ecology and calling alignment", () => {
    const output = buildSmartGoalMockDraft({
      desire: "quero organizar minha vida financeira",
      callingSummary: "Servir minha familia com constancia e mordomia.",
      lifeArea: "financas",
      lifeMapWarnings: ["descanso", "familia"]
    });

    const parsed = smartGoalOutputSchema.parse(output);

    expect(parsed.title).toContain("vida financeira");
    expect(parsed.ecological_analysis.protected_areas).toEqual(expect.arrayContaining(["descanso", "familia"]));
    expect(parsed.ecological_analysis.is_ecologically_safe).toBe(true);
    expect(parsed.calling_alignment.alignment_level).toBe("high");
    expect(parsed.first_action.length).toBeGreaterThan(8);
    expect(parsed.user_review_required).toBe(true);
  });

  test("generates a project plan from an approved goal without creating calendar blocks", () => {
    const output = buildProjectPlanMock({
      goalId: "goal-financas",
      goalTitle: "Organizar minha vida financeira em 30 dias",
      lifeArea: "financas",
      firstAction: "Abrir o extrato bancario"
    });

    const parsed = projectPlanOutputSchema.parse(output);

    expect(parsed.goal_id).toBe("goal-financas");
    expect(parsed.projects).toHaveLength(1);
    expect(parsed.projects[0]?.tasks[0]?.microtasks.length).toBeGreaterThanOrEqual(3);
    expect(parsed.projects[0]?.restart_plan).toContain("menor retorno");
    expect(JSON.stringify(parsed)).not.toContain("calendar_blocks");
  });

  test("breaks an oversized task into ordered microtasks and a first micro action", () => {
    const output = breakTaskIntoMicrotasks({
      title: "organizar finanças",
      reason: "reduzir ansiedade e decidir a primeira conta a quitar",
      estimatedMinutes: 50,
      energyLevel: "medium"
    });

    const parsed = taskBreakdownOutputSchema.parse(output);

    expect(parsed.task_title).toBe("organizar finanças");
    expect(parsed.microtasks.map((item) => item.order)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(parsed.microtasks[0]?.estimated_minutes).toBeLessThanOrEqual(10);
    expect(parsed.first_micro_action).toBe(parsed.microtasks[0]?.title);
    expect(parsed.if_stuck_suggestion).toContain("Desbloqueador");
  });

  test("calculates execution overview from tasks and microtasks", () => {
    const overview = buildExecutionOverview({
      goals: [{ id: "g1", status: "active" }],
      projects: [{ id: "p1", status: "active" }],
      tasks: [
        { id: "t1", status: "completed", nextAction: "Registrar avanço" },
        { id: "t2", status: "stuck", nextAction: "Abrir extrato" }
      ],
      microtasks: [
        { id: "m1", taskId: "t2", status: "completed" },
        { id: "m2", taskId: "t2", status: "pending" }
      ]
    });

    expect(overview.progressPercent).toBe(50);
    expect(overview.nextAction).toBe("Abrir extrato");
    expect(overview.stuckTasks).toBe(1);
  });
});
