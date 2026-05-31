import { z } from "zod";

import { confidenceLevelSchema, meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

const stringListSchema = z.array(shortTextSchema).max(12);

export const smartGoalOutputSchema = z
  .object({
    schema_version: z.literal("smart_goal_output_v1"),
    title: shortTextSchema,
    status: z.enum(["draft", "active", "paused", "completed", "abandoned", "needs_review"]).default("draft"),
    life_area: shortTextSchema,
    specific: meaningfulTextSchema,
    measurable: meaningfulTextSchema,
    achievable: meaningfulTextSchema,
    relevant: meaningfulTextSchema,
    timebound: meaningfulTextSchema,
    ecological_analysis: z
      .object({
        risks: stringListSchema,
        protected_areas: z.array(shortTextSchema).min(1).max(12),
        adjustments: stringListSchema,
        is_ecologically_safe: z.boolean()
      })
      .strict(),
    calling_alignment: z
      .object({
        alignment_level: z.enum(["low", "medium", "high"]),
        explanation: meaningfulTextSchema,
        concerns: stringListSchema
      })
      .strict(),
    first_action: meaningfulTextSchema,
    suggested_projects: z.array(shortTextSchema).min(1).max(5),
    confidence_level: confidenceLevelSchema,
    assumptions: stringListSchema,
    overload_warning: z.string().trim().min(1).nullable(),
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type SmartGoalOutput = z.infer<typeof smartGoalOutputSchema>;
