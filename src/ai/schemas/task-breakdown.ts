import { z } from "zod";

import { energyLevelSchema, meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const taskBreakdownOutputSchema = z
  .object({
    schema_version: z.literal("task_breakdown_output_v1"),
    task_title: shortTextSchema,
    reason: meaningfulTextSchema,
    estimated_minutes: z.number().int().min(1).max(240),
    energy_level: energyLevelSchema,
    microtasks: z
      .array(
        z
          .object({
            title: shortTextSchema,
            estimated_minutes: z.number().int().min(1).max(30),
            order: z.number().int().min(1)
          })
          .strict()
      )
      .min(1)
      .max(12),
    first_micro_action: meaningfulTextSchema,
    if_stuck_suggestion: meaningfulTextSchema,
    fallback_minimum_version: meaningfulTextSchema,
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type TaskBreakdownOutput = z.infer<typeof taskBreakdownOutputSchema>;
