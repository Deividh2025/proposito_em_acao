import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

const weeklyReviewStringListSchema = z.array(shortTextSchema).max(10);

export const weeklyReviewPatternSchema = z
  .object({
    pattern: shortTextSchema,
    evidence: z.array(shortTextSchema).min(1).max(6),
    impact: z.enum(["low", "medium", "high"]),
    suggested_adjustment: shortTextSchema
  })
  .strict();

export const weeklyReviewOutputSchema = z
  .object({
    schema_version: z.literal("weekly_review_output_v1"),
    week_summary: meaningfulTextSchema,
    wins: weeklyReviewStringListSchema,
    stuck_points: weeklyReviewStringListSchema,
    patterns: z.array(weeklyReviewPatternSchema).max(8),
    overload_alerts: weeklyReviewStringListSchema,
    neglected_life_areas: weeklyReviewStringListSchema,
    restart_moments: weeklyReviewStringListSchema,
    metacognition_insights: weeklyReviewStringListSchema,
    scoreboard_insights: weeklyReviewStringListSchema,
    next_week_focus: meaningfulTextSchema,
    recommended_actions: weeklyReviewStringListSchema,
    first_action_next_week: shortTextSchema,
    encouragement: shortTextSchema,
    christian_reflection: shortTextSchema.nullable(),
    safety_notes: weeklyReviewStringListSchema,
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type WeeklyReviewOutput = z.infer<typeof weeklyReviewOutputSchema>;
export type WeeklyReviewPattern = z.infer<typeof weeklyReviewPatternSchema>;
