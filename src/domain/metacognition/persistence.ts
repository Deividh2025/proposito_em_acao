import { z } from "zod";

import { metacognitionOutputSchema } from "@/ai/schemas";
import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

export const createMetacognitionSessionInputSchema = z
  .object({
    stateText: z.string().trim().min(2).max(2000),
    intensity: z.coerce.number().int().min(1).max(10),
    automaticThought: z.string().trim().min(2).max(1000),
    impulse: z.string().trim().max(1000).default("evitar a proxima acao"),
    allowChristianAnchor: z.boolean().default(false),
    relatedTaskId: z.string().trim().min(1).optional(),
    relatedProjectId: z.string().trim().min(1).optional(),
    relatedGoalId: z.string().trim().min(1).optional()
  })
  .strict();

export const persistMetacognitionSessionInputSchema = z
  .object({
    input: createMetacognitionSessionInputSchema,
    output: metacognitionOutputSchema
  })
  .strict();

export const metacognitionActionResultSchema = executionActionResultSchema.extend({
  output: metacognitionOutputSchema.optional()
});

export type MetacognitionActionResult = z.infer<typeof metacognitionActionResultSchema>;
export type BasicMetacognitionActionResult = ExecutionActionResult;
