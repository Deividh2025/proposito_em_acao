export type ProjectStatus = "draft" | "active" | "paused" | "completed" | "archived";

export type ProjectSummary = {
  id: string;
  goalId: string;
  title: string;
  status: ProjectStatus;
};
