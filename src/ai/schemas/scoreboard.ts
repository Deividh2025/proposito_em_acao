import { z } from "zod";

import { reviewRequiredSchema, shortTextSchema, stringListSchema } from "./common";

export const scoreboardItemTypeSchema = z.enum([
  "habit",
  "task",
  "focus",
  "restart",
  "behavior",
  "commitment",
  "manual"
]);

export const scoreboardPeriodSchema = z.enum(["daily", "weekly", "monthly", "custom"]);

export const scoreboardPlanOutputSchema = z
  .object({
    schema_version: z.literal("scoreboard_plan_output_v1"),
    scoreboard_title: shortTextSchema,
    period: scoreboardPeriodSchema,
    items: z
      .array(
        z
          .object({
            title: shortTextSchema,
            type: scoreboardItemTypeSchema,
            target_frequency: shortTextSchema,
            minimum_success: shortTextSchema,
            linked_goal_id: z.string().trim().min(1).nullable(),
            linked_habit_id: z.string().trim().min(1).nullable(),
            linked_task_id: z.string().trim().min(1).nullable()
          })
          .strict()
      )
      .min(1)
      .max(8),
    restart_tracking: z.literal(true),
    visual_guidance: shortTextSchema,
    risk_notes: stringListSchema,
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type ScoreboardPlanOutput = z.infer<typeof scoreboardPlanOutputSchema>;
