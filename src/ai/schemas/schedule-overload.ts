import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema, stringListSchema } from "./common";

export const scheduleOverloadOutputSchema = z
  .object({
    schema_version: z.literal("schedule_overload_output_v1"),
    overload_level: z.enum(["low", "medium", "high"]),
    message: meaningfulTextSchema,
    reasons: stringListSchema,
    recommended_adjustments: stringListSchema,
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type ScheduleOverloadOutput = z.infer<typeof scheduleOverloadOutputSchema>;
