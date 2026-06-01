import { z } from "zod";

import { confidenceLevelSchema, meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const actionUnblockerObstacleTypeSchema = z.enum([
  "operational",
  "emotional",
  "energy",
  "unclear",
  "crisis"
]);

export const actionUnblockerMicrotaskSchema = z
  .object({
    title: shortTextSchema,
    estimated_minutes: z.number().int().min(1).max(5),
    order: z.number().int().min(1).max(12)
  })
  .strict();

export const actionUnblockerOutputSchema = z
  .object({
    schema_version: z.literal("action_unblocker_output_v1"),
    obstacle_type: actionUnblockerObstacleTypeSchema.default("operational"),
    obstacle_key: z
      .enum(["clarity", "fear", "energy", "time", "perfectionism", "overload", "avoidance", "other"])
      .default("other"),
    state_summary: meaningfulTextSchema,
    first_step: meaningfulTextSchema,
    minimum_viable_action: meaningfulTextSchema,
    microtasks: z.array(actionUnblockerMicrotaskSchema).min(1).max(6),
    recommended_focus_minutes: z.number().int().min(2).max(25),
    immediate_reward: meaningfulTextSchema,
    reorientation_phrase: meaningfulTextSchema,
    restart_plan: meaningfulTextSchema,
    next_route: z.enum(["focus", "metacognition", "rest", "human_help", "manual_plan"]).default("focus"),
    suggest_metacognition: z.boolean(),
    reason_to_suggest_metacognition: meaningfulTextSchema.nullable(),
    crisis_detected: z.boolean().default(false),
    human_help_recommended: z.boolean().default(false),
    safety_note: meaningfulTextSchema.nullable(),
    confidence_level: confidenceLevelSchema.default("medium"),
    user_review_required: reviewRequiredSchema
  })
  .strict()
  .superRefine((value, context) => {
    if (value.crisis_detected || value.obstacle_type === "crisis") {
      if (value.next_route !== "human_help") {
        context.addIssue({
          code: "custom",
          message: "Crise emocional grave deve sair do fluxo de produtividade.",
          path: ["next_route"]
        });
      }

      if (!value.human_help_recommended) {
        context.addIssue({
          code: "custom",
          message: "Crise emocional grave exige recomendacao de ajuda humana.",
          path: ["human_help_recommended"]
        });
      }
    }

    if (value.suggest_metacognition && !value.reason_to_suggest_metacognition) {
      context.addIssue({
        code: "custom",
        message: "Sugestao de Metacognicao precisa explicar o motivo.",
        path: ["reason_to_suggest_metacognition"]
      });
    }
  });

export type ActionUnblockerOutput = z.infer<typeof actionUnblockerOutputSchema>;
