import { z } from "zod";

import { scoreboardPlanOutputSchema } from "@/ai/schemas";
import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

export const createScoreboardInputSchema = z
  .object({
    title: z.string().trim().min(2).max(120),
    period: z.enum(["daily", "weekly", "monthly", "custom"]).default("weekly")
  })
  .strict();

export const createScoreboardItemInputSchema = z
  .object({
    scoreboardId: z.string().trim().min(1).optional(),
    title: z.string().trim().min(2).max(140),
    type: z.enum(["task", "habit", "focus", "restart", "behavior", "commitment", "manual"]),
    targetFrequency: z.string().trim().min(2).max(120),
    minimumSuccess: z.string().trim().min(2).max(240),
    linkedGoalId: z.string().trim().min(1).optional(),
    linkedHabitId: z.string().trim().min(1).optional(),
    linkedTaskId: z.string().trim().min(1).optional()
  })
  .strict();

export const markScoreboardItemInputSchema = z
  .object({
    scoreboardId: z.string().trim().min(1),
    itemId: z.string().trim().min(1),
    entryDate: z.string().trim().min(8).optional(),
    status: z.enum(["done", "partial", "not_done", "restarted", "paused_consciously"]),
    note: z.string().trim().max(500).optional()
  })
  .strict();

export const generateScoreboardPlanInputSchema = z
  .object({
    focus: z.string().trim().min(2).max(240),
    period: z.enum(["daily", "weekly", "custom"]).default("weekly"),
    includeHabits: z.boolean().default(true),
    includeFocus: z.boolean().default(true),
    includeRestarts: z.boolean().default(true)
  })
  .strict();

export const persistScoreboardPlanInputSchema = z
  .object({
    output: scoreboardPlanOutputSchema
  })
  .strict();

export const scoreboardActionResultSchema = executionActionResultSchema.extend({
  output: scoreboardPlanOutputSchema.optional()
});

export type ScoreboardActionResult = z.infer<typeof scoreboardActionResultSchema>;
export type BasicScoreboardActionResult = ExecutionActionResult;
