import { buildProjectPlanMock } from "@/domain/projects";
import { breakTaskIntoMicrotasks } from "@/domain/tasks";
import { buildSmartGoalMockDraft } from "@/domain/goals";

export const sampleSmartGoal = buildSmartGoalMockDraft({
  desire: "organizar minha vida financeira",
  callingSummary: "Servir minha familia com constancia e mordomia.",
  lifeArea: "financas",
  lifeMapWarnings: ["descanso", "familia"]
});

export const sampleProjectPlan = buildProjectPlanMock({
  goalId: "goal-financas",
  goalTitle: sampleSmartGoal.title,
  lifeArea: sampleSmartGoal.life_area,
  firstAction: sampleSmartGoal.first_action
});

export const sampleTaskBreakdown = breakTaskIntoMicrotasks({
  title: "organizar finanças",
  reason: "reduzir ansiedade e decidir a primeira conta a quitar",
  estimatedMinutes: 50,
  energyLevel: "medium"
});

export const sampleExecutionLinks = {
  goalId: "goal-financas",
  projectId: "project-financas",
  taskId: "task-financas"
};
