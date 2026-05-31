import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema } from "./common";

export const actionUnblockerOutputSchema = z
  .object({
    schema_version: z.literal("action_unblocker_output_v1"),
    obstacle_type: z.enum(["operational", "emotional", "energy", "unclear", "crisis"]),
    first_step: meaningfulTextSchema,
    minimum_version: meaningfulTextSchema,
    suggested_focus_minutes: z.number().int().min(1).max(50),
    next_route: z.enum(["focus", "metacognition", "rest", "human_help", "manual_plan"]),
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type ActionUnblockerOutput = z.infer<typeof actionUnblockerOutputSchema>;
