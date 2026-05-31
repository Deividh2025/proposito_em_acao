export type ProjectStatus = "draft" | "active" | "paused" | "completed" | "archived" | "needs_review";

export type ProjectSummary = {
  id: string;
  goalId: string;
  title: string;
  status: ProjectStatus;
};

export type ProjectPlanTaskDraft = {
  title: string;
  description: string;
  estimatedMinutes: number;
  energyLevel: "low" | "medium" | "high";
  microtasks: string[];
};
