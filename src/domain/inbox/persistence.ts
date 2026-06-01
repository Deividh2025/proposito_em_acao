import { z } from "zod";

import { inboxClassificationOutputSchema } from "@/ai/schemas";
import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

export const inboxContentTypeSchema = z.enum(["text", "voice_note", "image_placeholder", "file", "link"]);

export const inboxDestinationTypeSchema = z.enum([
  "task",
  "project",
  "calendar_event",
  "habit",
  "reference",
  "future_idea",
  "discard",
  "needs_clarification"
]);

export const captureInboxItemInputSchema = z
  .object({
    content: z.string().trim().min(2).max(2000),
    contentType: inboxContentTypeSchema.default("text")
  })
  .strict();

export const classifyInboxItemInputSchema = z
  .object({
    itemId: z.string().trim().min(1).optional(),
    content: z.string().trim().min(2).max(2000)
  })
  .strict();

export const processInboxItemInputSchema = z
  .object({
    itemId: z.string().trim().min(1),
    content: z.string().trim().min(2).max(2000).optional(),
    classification: inboxClassificationOutputSchema.optional(),
    destinationType: inboxDestinationTypeSchema,
    destinationId: z.string().trim().min(1).optional(),
    note: z.string().trim().max(1000).optional()
  })
  .strict();

export const inboxActionResultSchema = executionActionResultSchema.extend({
  classification: inboxClassificationOutputSchema.optional()
});

export type InboxActionResult = z.infer<typeof inboxActionResultSchema>;
export type BasicInboxActionResult = ExecutionActionResult;
