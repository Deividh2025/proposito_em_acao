import { z } from "zod";

import { meaningfulTextSchema, shortTextSchema } from "./common";

export const blockedBehaviorSchema = z.enum([
  "diagnosis",
  "therapy_replacement",
  "specific_divine_will_claim",
  "spiritual_guilt",
  "humiliation",
  "harmful_punishment",
  "unconsented_private_sharing",
  "crisis_as_productivity"
]);

export const guardrailReviewOutputSchema = z
  .object({
    schema_version: z.literal("guardrail_review_output_v1"),
    allowed: z.boolean(),
    severity: z.enum(["none", "low", "medium", "high", "critical"]),
    blocked_behaviors: z.array(blockedBehaviorSchema),
    reasons: z.array(shortTextSchema),
    requires_human_help: z.boolean(),
    crisis_detected: z.boolean(),
    redacted_fields: z.array(shortTextSchema),
    safe_to_persist: z.boolean(),
    safe_to_share_with_accountability: z.boolean(),
    next_safe_step: meaningfulTextSchema,
    reviewed_schema_version: shortTextSchema
  })
  .strict();

export type BlockedBehavior = z.infer<typeof blockedBehaviorSchema>;
export type GuardrailReviewOutput = z.infer<typeof guardrailReviewOutputSchema>;
