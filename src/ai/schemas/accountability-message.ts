import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const accountabilityMessageTypeSchema = z.enum([
  "invite",
  "progress_update",
  "help_request",
  "delay_alert",
  "completion",
  "restart"
]);

export const accountabilitySharedFieldSchema = z.enum([
  "goal_name",
  "deadline",
  "status",
  "progress_percentage",
  "completed_milestones",
  "limited_scoreboard",
  "help_request",
  "delay_alert",
  "completion",
  "custom_message",
  "commitment_document"
]);

export const accountabilityPrivacyCheckSchema = z
  .object({
    contains_private_metacognition: z.literal(false),
    contains_full_calling: z.literal(false),
    contains_sensitive_health_data: z.literal(false),
    contains_family_finance_emotion_data: z.literal(false),
    safe_to_send: z.boolean()
  })
  .strict();

export const accountabilityMessageOutputSchema = z
  .object({
    schema_version: z.literal("accountability_message_output_v1"),
    message_type: accountabilityMessageTypeSchema,
    subject: shortTextSchema,
    body: meaningfulTextSchema,
    shared_fields: z.array(accountabilitySharedFieldSchema).min(1).max(10),
    privacy_check: accountabilityPrivacyCheckSchema,
    tone: z.enum(["supportive", "neutral", "firm"]),
    call_to_action: shortTextSchema.nullable(),
    consent_required: reviewRequiredSchema,
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type AccountabilityMessageOutput = z.infer<typeof accountabilityMessageOutputSchema>;
export type AccountabilitySharedField = z.infer<typeof accountabilitySharedFieldSchema>;
