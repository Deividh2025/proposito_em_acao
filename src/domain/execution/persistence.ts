import { z } from "zod";

import {
  projectPlanOutputSchema,
  smartGoalOutputSchema,
  taskBreakdownOutputSchema
} from "@/ai/schemas";

export const executionActionResultSchema = z
  .object({
    mode: z.enum(["supabase", "local-draft"]),
    ok: z.boolean(),
    message: z.string().min(1),
    id: z.string().min(1).optional()
  })
  .strict();

export type ExecutionActionResult = z.infer<typeof executionActionResultSchema>;

export const createManualGoalInputSchema = z
  .object({
    title: z.string().trim().min(2),
    lifeArea: z.string().trim().min(2),
    specific: z.string().trim().min(2),
    measurable: z.string().trim().min(2),
    achievable: z.string().trim().min(2),
    relevant: z.string().trim().min(2),
    timebound: z.string().trim().min(2),
    firstAction: z.string().trim().min(2),
    status: z.enum(["draft", "active", "paused", "completed", "abandoned", "needs_review"]).default("draft")
  })
  .strict();

export const createSmartGoalDraftInputSchema = z
  .object({
    desire: z.string().trim().min(2),
    callingSummary: z.string().trim().optional(),
    lifeArea: z.string().trim().optional(),
    lifeMapWarnings: z.array(z.string().trim().min(1)).default([])
  })
  .strict();

export const persistSmartGoalInputSchema = z
  .object({
    output: smartGoalOutputSchema
  })
  .strict();

export const createProjectFromGoalInputSchema = z
  .object({
    goalId: z.string().trim().min(1),
    goalTitle: z.string().trim().min(2),
    lifeArea: z.string().trim().optional(),
    firstAction: z.string().trim().optional()
  })
  .strict();

export const persistProjectPlanInputSchema = z
  .object({
    output: projectPlanOutputSchema
  })
  .strict();

export const createTaskInputSchema = z
  .object({
    goalId: z.string().trim().optional(),
    projectId: z.string().trim().optional(),
    title: z.string().trim().min(2),
    description: z.string().trim().optional(),
    taskType: z.enum(["one_off", "project_task", "recurring_work", "microtask", "restart_task"]).default("one_off"),
    status: z.enum(["pending", "scheduled", "in_focus", "completed", "deferred", "stuck", "cancelled"]).default("pending"),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    energyLevel: z.enum(["low", "medium", "high"]).default("medium"),
    estimatedMinutes: z.coerce.number().int().min(1).max(240).default(25),
    dueDate: z.string().trim().optional(),
    reason: z.string().trim().optional(),
    nextAction: z.string().trim().min(2)
  })
  .strict();

export const persistTaskBreakdownInputSchema = z
  .object({
    taskId: z.string().trim().min(1).optional(),
    output: taskBreakdownOutputSchema
  })
  .strict();

export const updateMicrotaskStatusInputSchema = z
  .object({
    microtaskId: z.string().trim().min(1),
    status: z.enum(["pending", "completed", "skipped"])
  })
  .strict();
