import { z } from "zod";

import { habitPlanOutputSchema } from "@/ai/schemas";
import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

export const createHabitPlanInputSchema = z
  .object({
    desiredHabit: z.string().trim().min(2).max(240),
    reason: z.string().trim().min(2).max(500),
    lifeArea: z.string().trim().min(2).max(80),
    frequency: z.enum(["daily", "weekly", "custom"]).default("daily"),
    likelyDifficulty: z.string().trim().min(2).max(240),
    bestContext: z.string().trim().min(2).max(240),
    linkedGoalId: z.string().trim().min(1).optional(),
    callingRelation: z.string().trim().max(500).optional()
  })
  .strict();

export const persistHabitPlanInputSchema = z
  .object({
    linkedGoalId: z.string().trim().min(1).optional(),
    output: habitPlanOutputSchema
  })
  .strict();

export const logHabitInputSchema = z
  .object({
    habitId: z.string().trim().min(1),
    status: z.enum([
      "done_minimum",
      "done_ideal",
      "skipped",
      "missed",
      "restarted",
      "paused_consciously"
    ]),
    logDate: z.string().trim().min(8).optional(),
    notes: z.string().trim().max(500).optional()
  })
  .strict();

export const updateHabitStatusInputSchema = z
  .object({
    habitId: z.string().trim().min(1),
    status: z.enum(["draft", "active", "paused", "archived"])
  })
  .strict();

export const habitActionResultSchema = executionActionResultSchema.extend({
  output: habitPlanOutputSchema.optional()
});

export type HabitActionResult = z.infer<typeof habitActionResultSchema>;
export type BasicHabitActionResult = ExecutionActionResult;
