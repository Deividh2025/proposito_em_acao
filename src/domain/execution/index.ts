import type { GoalStatus } from "@/domain/goals";
import type { ProjectStatus } from "@/domain/projects";
import type { ExecutionMicrotaskSummary, ExecutionTaskSummary } from "@/domain/tasks";

type ExecutionOverviewInput = {
  goals: Array<{ id: string; status: GoalStatus }>;
  projects: Array<{ id: string; status: ProjectStatus }>;
  tasks: ExecutionTaskSummary[];
  microtasks: ExecutionMicrotaskSummary[];
};

export type ExecutionOverview = {
  progressPercent: number;
  nextAction: string;
  activeGoals: number;
  activeProjects: number;
  completedTasks: number;
  stuckTasks: number;
};

export function buildExecutionOverview(input: ExecutionOverviewInput): ExecutionOverview {
  const actionableTask =
    input.tasks.find((task) => task.status === "stuck" && task.nextAction) ??
    input.tasks.find((task) => task.status !== "completed" && task.nextAction);
  const completedTasks = input.tasks.filter((task) => task.status === "completed").length;
  const completedMicrotasks = input.microtasks.filter((microtask) => microtask.status === "completed").length;
  const totalProgressItems = input.tasks.length + input.microtasks.length;
  const completedProgressItems = completedTasks + completedMicrotasks;

  return {
    progressPercent: totalProgressItems === 0 ? 0 : Math.round((completedProgressItems / totalProgressItems) * 100),
    nextAction: actionableTask?.nextAction ?? "Escolher a menor microacao fiel de agora.",
    activeGoals: input.goals.filter((goal) => goal.status === "active").length,
    activeProjects: input.projects.filter((project) => project.status === "active").length,
    completedTasks,
    stuckTasks: input.tasks.filter((task) => task.status === "stuck").length
  };
}
