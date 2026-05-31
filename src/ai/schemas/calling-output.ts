import { z } from "zod";

import {
  confidenceLevelSchema,
  meaningfulTextSchema,
  reviewRequiredSchema,
  shortTextSchema
} from "./common";

export const callingOutputSchema = z
  .object({
    schema_version: z.literal("calling_output_v1"),
    status_suggestion: z.enum(["draft", "in_discernment"]),
    user_review_required: reviewRequiredSchema,
    calling_hypothesis: meaningfulTextSchema,
    direction_statement: meaningfulTextSchema,
    core_values: z.array(shortTextSchema).min(1).max(6),
    recurring_burdens: z.array(shortTextSchema).min(1).max(6),
    people_to_serve: z.array(shortTextSchema).min(1).max(6),
    gifts_and_inclinations: z.array(shortTextSchema).min(1).max(6),
    life_map_observations: z.array(shortTextSchema).max(8),
    alignment_notes: z.array(shortTextSchema).min(1).max(8),
    risks_or_imbalances: z.array(shortTextSchema).min(1).max(8),
    suggested_next_steps: z.array(shortTextSchema).min(1).max(3),
    confidence_level: confidenceLevelSchema,
    pastoral_safety_note: meaningfulTextSchema
  })
  .strict();

export type CallingOutput = z.infer<typeof callingOutputSchema>;
