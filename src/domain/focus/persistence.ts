import { z } from "zod";

import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

export const focusDurationSchema = z.coerce.number().int().min(1).max(120);

export const startFocusSessionInputSchema = z
  .object({
    taskId: z.string().trim().min(1).optional(),
    calendarBlockId: z.string().trim().min(1).optional(),
    actionUnblockerSessionId: z.string().trim().min(1).optional(),
    taskTitle: z.string().trim().min(2).max(160),
    nextStep: z.string().trim().min(2).max(240),
    reason: z.string().trim().min(2).max(500),
    durationMinutes: focusDurationSchema.default(25)
  })
  .strict();

export const completeFocusSessionInputSchema = z
  .object({
    sessionId: z.string().trim().min(1),
    completionNote: z.string().trim().max(1000).optional(),
    postEnergyLevel: z.enum(["low", "medium", "high"]).optional(),
    completeTask: z.boolean().default(false),
    taskId: z.string().trim().min(1).optional(),
    calendarBlockId: z.string().trim().min(1).optional()
  })
  .strict();

export const interruptFocusSessionInputSchema = z
  .object({
    sessionId: z.string().trim().min(1),
    status: z.enum(["interrupted", "cancelled"]).default("interrupted"),
    completionNote: z.string().trim().max(1000).optional()
  })
  .strict();

export const captureFocusDistractionInputSchema = z
  .object({
    sessionId: z.string().trim().min(1),
    type: z.enum(["thought", "idea", "reminder", "parallel_task", "concern", "link", "note"]),
    content: z.string().trim().min(2).max(500),
    routeToInbox: z.boolean().default(false)
  })
  .strict();

export const focusActionResultSchema = executionActionResultSchema.extend({
  distractionId: z.string().min(1).optional()
});

export type FocusActionResult = z.infer<typeof focusActionResultSchema>;
export type BasicFocusActionResult = ExecutionActionResult;
