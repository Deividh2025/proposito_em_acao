import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const accountabilityMessageOutputSchema = z
  .object({
    schema_version: z.literal("accountability_message_output_v1"),
    goal_id: shortTextSchema,
    permission_scope: z.array(z.enum(["status", "progress", "milestones", "delay", "help_request", "scoreboard_summary"])).min(1),
    preview_message: meaningfulTextSchema,
    excluded_private_categories: z.array(shortTextSchema).min(1),
    consent_required: reviewRequiredSchema,
    user_review_required: reviewRequiredSchema,
    send_allowed: z.boolean()
  })
  .strict();

export type AccountabilityMessageOutput = z.infer<typeof accountabilityMessageOutputSchema>;
