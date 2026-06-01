import type { ActionUnblockerOutput } from "@/ai/schemas";

export type ActionUnblockerEnergyLevel = "low" | "medium" | "high";
export type ActionUnblockerTone = "leve" | "equilibrado" | "firme";

export type ActionUnblockerInput = {
  taskTitle: string;
  energyLevel: ActionUnblockerEnergyLevel;
  availableMinutes: number;
  obstacle?: string;
  tone: ActionUnblockerTone;
  taskId?: string;
  projectId?: string;
  goalId?: string;
  calendarBlockId?: string;
  inboxItemId?: string;
};

export type ActionUnblockerSession = {
  id: string;
  taskTitle: string;
  energyLevel: ActionUnblockerEnergyLevel;
  availableMinutes: number;
  obstacle?: string;
  output: ActionUnblockerOutput;
  createdAt: string;
  relatedTaskId?: string;
};
