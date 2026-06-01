import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const metacognitionCategorySchema = z.enum([
  "anxiety",
  "anguish",
  "procrastination",
  "paralysis",
  "perfectionism",
  "rumination",
  "guilt",
  "victimization",
  "anger",
  "fear",
  "confusion",
  "avoidance",
  "overload",
  "low_energy",
  "other"
]);

export const metacognitionRouteSchema = z.enum([
  "action_unblocker",
  "focus",
  "rest",
  "prayer_reflection",
  "human_support",
  "emergency_support"
]);

export const metacognitionOutputSchema = z
  .object({
    schema_version: z.literal("metacognition_output_v1"),
    state_name: shortTextSchema,
    category: metacognitionCategorySchema,
    intensity_observed: z.enum(["low", "medium", "high"]),
    fact: meaningfulTextSchema,
    interpretation: meaningfulTextSchema,
    feeling: shortTextSchema,
    impulse: meaningfulTextSchema,
    dominant_automatic_thought: meaningfulTextSchema,
    cognitive_patterns: z.array(shortTextSchema).min(1).max(8),
    logical_deconstruction: meaningfulTextSchema,
    confrontation_question: meaningfulTextSchema,
    reframe: meaningfulTextSchema,
    next_action: meaningfulTextSchema,
    recommended_route: metacognitionRouteSchema,
    christian_anchor: meaningfulTextSchema.nullable(),
    safety_flags: z.array(shortTextSchema).max(8),
    privacy_note: meaningfulTextSchema,
    user_review_required: reviewRequiredSchema,
    private_by_default: z.literal(true),
    share_with_accountability_allowed: z.literal(false)
  })
  .strict()
  .superRefine((value, context) => {
    const hasCrisisFlag = value.safety_flags.some((flag) => /crise|risco|emerg/i.test(flag));

    if (hasCrisisFlag && value.recommended_route !== "emergency_support") {
      context.addIssue({
        code: "custom",
        message: "Risco grave deve usar rota emergency_support.",
        path: ["recommended_route"]
      });
    }

    if (value.recommended_route === "emergency_support" && value.safety_flags.length === 0) {
      context.addIssue({
        code: "custom",
        message: "Rota de emergencia precisa registrar flag de seguranca minima.",
        path: ["safety_flags"]
      });
    }
  });

export type MetacognitionOutput = z.infer<typeof metacognitionOutputSchema>;
