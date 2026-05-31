import { z } from "zod";

import { meaningfulTextSchema, shortTextSchema, stringListSchema } from "./common";

export const metacognitionOutputSchema = z
  .object({
    schema_version: z.literal("metacognition_output_v1"),
    facts: stringListSchema,
    interpretations: stringListSchema,
    feelings: stringListSchema,
    impulses: stringListSchema,
    dominant_automatic_thought: meaningfulTextSchema,
    likely_distortions: z.array(shortTextSchema).min(1).max(6),
    logic_check_questions: z.array(shortTextSchema).min(1).max(6),
    responsible_confrontation: meaningfulTextSchema,
    reframed_thought: meaningfulTextSchema,
    next_micro_action: meaningfulTextSchema,
    routing: z.enum(["micro_action", "rest", "prayer_reflection", "human_help", "action_unblocker"]),
    crisis_detected: z.boolean(),
    human_help_recommended: z.boolean(),
    private_by_default: z.literal(true),
    share_with_accountability_allowed: z.literal(false)
  })
  .strict();

export type MetacognitionOutput = z.infer<typeof metacognitionOutputSchema>;
