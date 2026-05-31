import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema, stringListSchema } from "./common";

export const weeklyReviewOutputSchema = z
  .object({
    schema_version: z.literal("weekly_review_output_v1"),
    wins: stringListSchema,
    stuck_points: stringListSchema,
    patterns: stringListSchema,
    next_week_focus: meaningfulTextSchema,
    adjustments: stringListSchema,
    overload_warning: z.boolean(),
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type WeeklyReviewOutput = z.infer<typeof weeklyReviewOutputSchema>;
