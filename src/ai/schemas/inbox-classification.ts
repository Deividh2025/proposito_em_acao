import { z } from "zod";

import { confidenceLevelSchema, meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const inboxClassificationOutputSchema = z
  .object({
    schema_version: z.literal("inbox_classification_output_v1"),
    classification: z.enum([
      "task",
      "project",
      "habit",
      "calendar",
      "reference",
      "metacognition",
      "discard"
    ]),
    reasoning: meaningfulTextSchema,
    suggested_destination_label: shortTextSchema,
    confidence_level: confidenceLevelSchema,
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type InboxClassificationOutput = z.infer<typeof inboxClassificationOutputSchema>;
