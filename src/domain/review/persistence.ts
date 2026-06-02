import { z } from "zod";

import { gardenStateOutputSchema, weeklyReviewOutputSchema } from "@/ai/schemas";
import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

const weeklyReviewAnswersSchema = z
  .object({
    advanced: z.string().trim().max(1200).optional(),
    stuck: z.string().trim().max(1200).optional(),
    completed: z.string().trim().max(1200).optional(),
    postponed: z.string().trim().max(1200).optional(),
    goalsProgressed: z.string().trim().max(1200).optional(),
    projectsPaused: z.string().trim().max(1200).optional(),
    habitsMaintained: z.string().trim().max(1200).optional(),
    restarts: z.string().trim().max(1200).optional(),
    excess: z.string().trim().max(1200).optional(),
    neglectedAreas: z.string().trim().max(1200).optional(),
    metacognition: z.string().trim().max(1200).optional(),
    scoreboard: z.string().trim().max(1200).optional(),
    adjustments: z.string().trim().max(1200).optional(),
    nextWeekFocus: z.string().trim().max(1200).optional(),
    firstActionNextWeek: z.string().trim().max(1200).optional()
  })
  .strict();

export const createWeeklyReviewInputSchema = z
  .object({
    weekStart: z.string().trim().min(8).max(20),
    weekEnd: z.string().trim().min(8).max(20),
    answers: weeklyReviewAnswersSchema,
    christianReflectionEnabled: z.boolean().default(false)
  })
  .strict();

export const persistWeeklyReviewInputSchema = z
  .object({
    weekStart: z.string().trim().min(8).max(20),
    weekEnd: z.string().trim().min(8).max(20),
    answers: weeklyReviewAnswersSchema,
    output: weeklyReviewOutputSchema,
    garden: gardenStateOutputSchema
  })
  .strict();

export const weeklyReviewActionResultSchema = executionActionResultSchema.extend({
  output: weeklyReviewOutputSchema.optional(),
  garden: gardenStateOutputSchema.optional()
});

export type WeeklyReviewActionResult = z.infer<typeof weeklyReviewActionResultSchema>;
export type BasicWeeklyReviewActionResult = ExecutionActionResult;
export type WeeklyReviewAnswers = z.infer<typeof weeklyReviewAnswersSchema>;

export function sanitizeWeeklyReviewAnswersForPersistence(answers: WeeklyReviewAnswers): WeeklyReviewAnswers {
  return {
    ...answers,
    metacognition: answers.metacognition?.trim()
      ? "Resumo agregado/redigido informado pelo usuario; conteudo bruto de Metacognicao nao foi persistido na revisao."
      : undefined
  };
}
