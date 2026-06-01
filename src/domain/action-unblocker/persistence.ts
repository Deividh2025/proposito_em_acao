import { z } from "zod";

import { actionUnblockerOutputSchema } from "@/ai/schemas";
import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

export const createActionUnblockerSessionInputSchema = z
  .object({
    taskTitle: z.string().trim().min(2).max(240),
    energyLevel: z.enum(["low", "medium", "high"]),
    availableMinutes: z.coerce.number().int().min(2).max(120),
    obstacle: z.string().trim().max(500).optional(),
    tone: z.enum(["leve", "equilibrado", "firme"]).default("equilibrado"),
    taskId: z.string().trim().min(1).optional(),
    projectId: z.string().trim().min(1).optional(),
    goalId: z.string().trim().min(1).optional(),
    calendarBlockId: z.string().trim().min(1).optional(),
    inboxItemId: z.string().trim().min(1).optional()
  })
  .strict();

export const persistActionUnblockerSessionInputSchema = z
  .object({
    input: createActionUnblockerSessionInputSchema,
    output: actionUnblockerOutputSchema
  })
  .strict();

export const actionUnblockerActionResultSchema = executionActionResultSchema.extend({
  output: actionUnblockerOutputSchema.optional()
});

export type ActionUnblockerActionResult = z.infer<typeof actionUnblockerActionResultSchema>;
export type BasicActionUnblockerActionResult = ExecutionActionResult;
