import { z } from "zod";

import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

export const calendarBlockTypeSchema = z.enum([
  "task",
  "focus",
  "habit_placeholder",
  "recurring_work",
  "rest",
  "family",
  "spirituality",
  "health",
  "learning",
  "service",
  "appointment",
  "buffer"
]);

export const calendarBlockStatusSchema = z.enum(["scheduled", "completed", "missed", "cancelled"]);

export const createCalendarBlockInputSchema = z
  .object({
    title: z.string().trim().min(2).max(140),
    type: calendarBlockTypeSchema.default("task"),
    startTime: z.string().trim().min(10),
    endTime: z.string().trim().min(10),
    taskId: z.string().trim().min(1).optional(),
    notes: z.string().trim().max(1000).optional()
  })
  .strict()
  .refine((value) => Date.parse(value.endTime) > Date.parse(value.startTime), {
    message: "O fim precisa ser posterior ao inicio.",
    path: ["endTime"]
  });

export const updateCalendarBlockInputSchema = z
  .object({
    blockId: z.string().trim().min(1),
    title: z.string().trim().min(2).max(140).optional(),
    type: calendarBlockTypeSchema.optional(),
    startTime: z.string().trim().min(10).optional(),
    endTime: z.string().trim().min(10).optional(),
    status: calendarBlockStatusSchema.optional(),
    notes: z.string().trim().max(1000).optional()
  })
  .strict()
  .refine(
    (value) =>
      !value.startTime ||
      !value.endTime ||
      Date.parse(value.endTime) > Date.parse(value.startTime),
    {
      message: "O fim precisa ser posterior ao inicio.",
      path: ["endTime"]
    }
  );

export const deleteCalendarBlockInputSchema = z
  .object({
    blockId: z.string().trim().min(1)
  })
  .strict();

export const calendarActionResultSchema = executionActionResultSchema;
export type CalendarActionResult = ExecutionActionResult;
