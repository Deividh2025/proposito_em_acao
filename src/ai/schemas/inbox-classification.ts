import { z } from "zod";

import { confidenceLevelSchema, energyLevelSchema, meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const inboxClassificationOutputSchema = z
  .object({
    schema_version: z.literal("inbox_classification_output_v1"),
    classification: z.enum([
      "task",
      "project",
      "calendar_event",
      "habit",
      "reference",
      "future_idea",
      "concern",
      "discard",
      "needs_clarification"
    ]),
    confidence: confidenceLevelSchema,
    suggested_title: shortTextSchema,
    summary: meaningfulTextSchema,
    recommended_action: z.enum([
      "do_now",
      "schedule",
      "create_task",
      "create_project",
      "create_habit",
      "archive",
      "discard",
      "clarify",
      "reflect",
      "unblock"
    ]),
    life_area: z.string().trim().min(1).max(80).nullable(),
    estimated_minutes: z.number().int().positive().max(480).nullable(),
    energy_level: energyLevelSchema.nullable(),
    due_date_suggestion: z.string().trim().min(1).max(80).nullable(),
    clarifying_question: z.string().trim().min(1).max(500).nullable(),
    safety_note: z.string().trim().min(1).max(500).nullable(),
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type InboxClassificationOutput = z.infer<typeof inboxClassificationOutputSchema>;
