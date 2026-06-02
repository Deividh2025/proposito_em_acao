import { z } from "zod";

import { accountabilitySharedFieldSchema } from "./accountability-message";
import { meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const commitmentDocumentOutputSchema = z
  .object({
    schema_version: z.literal("commitment_document_output_v1"),
    goal_id: shortTextSchema,
    title: shortTextSchema,
    commitment_statement: meaningfulTextSchema,
    calling_summary: z.string().trim().min(1).max(800).nullable(),
    deadline: shortTextSchema,
    linked_projects: z.array(shortTextSchema).max(8),
    supporting_habits: z.array(shortTextSchema).max(8),
    scoreboard_items: z.array(shortTextSchema).max(8),
    accountability_partner: z
      .object({
        name: shortTextSchema,
        email: z.string().trim().email()
      })
      .strict(),
    reward: z.string().trim().min(1).max(400).nullable(),
    restorative_consequence: z.string().trim().min(1).max(500).nullable(),
    first_action: shortTextSchema,
    sharing_permissions: z.array(accountabilitySharedFieldSchema).max(10),
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type CommitmentDocumentOutput = z.infer<typeof commitmentDocumentOutputSchema>;
