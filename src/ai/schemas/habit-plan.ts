import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const habitPlanOutputSchema = z
  .object({
    schema_version: z.literal("habit_plan_output_v1"),
    habit_title: shortTextSchema,
    trigger: shortTextSchema,
    minimum_version: shortTextSchema,
    ideal_version: shortTextSchema,
    reward: shortTextSchema,
    if_then_plan: meaningfulTextSchema,
    frequency: shortTextSchema,
    restart_plan: meaningfulTextSchema,
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type HabitPlanOutput = z.infer<typeof habitPlanOutputSchema>;
