import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema, shortTextSchema, stringListSchema } from "./common";

export const habitPlanOutputSchema = z
  .object({
    schema_version: z.literal("habit_plan_output_v1"),
    habit_title: shortTextSchema,
    identity_statement: shortTextSchema,
    why_it_matters: meaningfulTextSchema,
    life_area: shortTextSchema,
    trigger: shortTextSchema,
    minimum_version: shortTextSchema,
    ideal_version: shortTextSchema,
    schedule_suggestion: shortTextSchema,
    reward: shortTextSchema,
    likely_obstacle: shortTextSchema,
    if_then_plan: meaningfulTextSchema,
    environment_design: meaningfulTextSchema,
    frequency: z.enum(["daily", "weekly", "custom"]),
    metric: shortTextSchema,
    scoreboard_items: stringListSchema,
    restart_plan: meaningfulTextSchema,
    risk_of_overload: z.enum(["low", "medium", "high"]),
    adjustments: stringListSchema,
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type HabitPlanOutput = z.infer<typeof habitPlanOutputSchema>;
