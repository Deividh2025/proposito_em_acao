import { z } from "zod";

import { meaningfulTextSchema, reviewRequiredSchema, shortTextSchema } from "./common";

export const projectPlanOutputSchema = z
  .object({
    schema_version: z.literal("project_plan_output_v1"),
    goal_id: shortTextSchema,
    projects: z
      .array(
        z
          .object({
            title: shortTextSchema,
            description: meaningfulTextSchema,
            phase: shortTextSchema,
            milestones: z.array(shortTextSchema).min(1).max(8),
            risks: z.array(shortTextSchema).min(1).max(8),
            resources_needed: z.array(shortTextSchema).min(1).max(8),
            tasks: z
              .array(
                z
                  .object({
                    title: shortTextSchema,
                    description: meaningfulTextSchema,
                    estimated_minutes: z.number().int().min(5).max(180),
                    energy_level: z.enum(["low", "medium", "high"]),
                    microtasks: z.array(shortTextSchema).min(1).max(8)
                  })
                  .strict()
              )
              .min(1)
              .max(8),
            restart_plan: meaningfulTextSchema
          })
          .strict()
      )
      .min(1)
      .max(3),
    overload_warning: z.string().trim().min(1).nullable(),
    user_review_required: reviewRequiredSchema
  })
  .strict();

export type ProjectPlanOutput = z.infer<typeof projectPlanOutputSchema>;
