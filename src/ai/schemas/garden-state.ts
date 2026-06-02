import { z } from "zod";

import { shortTextSchema } from "./common";

export const gardenVisualStateSchema = z.enum(["seed", "sprout", "growing", "fruitful", "needs_care"]);

export const gardenAreaStateSchema = z
  .object({
    area: shortTextSchema,
    growth_level: z.coerce.number().int().min(1).max(5),
    recent_events: z.array(shortTextSchema).max(6),
    care_needed: z.boolean(),
    care_message: shortTextSchema,
    visual_state: gardenVisualStateSchema
  })
  .strict();

export const gardenStateOutputSchema = z
  .object({
    schema_version: z.literal("garden_state_output_v1"),
    garden_state: z
      .object({
        life_areas: z.array(gardenAreaStateSchema).min(1).max(12),
        unlocked_items: z.array(shortTextSchema).max(12),
        weekly_growth_summary: shortTextSchema
      })
      .strict()
  })
  .strict();

export type GardenVisualState = z.infer<typeof gardenVisualStateSchema>;
export type GardenAreaState = z.infer<typeof gardenAreaStateSchema>;
export type GardenStateOutput = z.infer<typeof gardenStateOutputSchema>;
