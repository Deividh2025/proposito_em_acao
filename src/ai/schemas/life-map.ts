import { z } from "zod";

import { attentionLevelSchema, meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const lifeMapAnalysisOutputSchema = z
  .object({
    schema_version: z.literal("life_map_analysis_output_v1"),
    summary: meaningfulTextSchema,
    area_insights: z
      .array(
        z
          .object({
            area_slug: shortTextSchema,
            score: z.number().int().min(0).max(10),
            attention_level: attentionLevelSchema,
            reading: meaningfulTextSchema
          })
          .strict()
      )
      .min(1),
    strengths: z.array(shortTextSchema).min(1).max(8),
    imbalances: z.array(shortTextSchema).min(1).max(8),
    suggested_reflections: z.array(shortTextSchema).min(1).max(6),
    next_safe_step: meaningfulTextSchema,
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type LifeMapAnalysisOutput = z.infer<typeof lifeMapAnalysisOutputSchema>;
