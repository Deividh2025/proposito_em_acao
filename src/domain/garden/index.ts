import { z } from "zod";

import { lifeMapAreas } from "@/domain/life-map";

import type { GardenEventType, GardenSourceType } from "./types";

export * from "./types";

export const lifeGardenAreas = lifeMapAreas.map((area) => area.name);

export const gardenEventTypeSchema = z.enum([
  "area_progressed",
  "area_neglected",
  "area_care_needed",
  "weekly_review_completed",
  "goal_progressed",
  "project_progressed",
  "task_completed",
  "focus_completed",
  "habit_logged",
  "habit_restarted",
  "metacognition_action_completed",
  "protected_rest"
]) satisfies z.ZodType<GardenEventType>;

export const gardenSourceTypeSchema = z.enum([
  "weekly_review",
  "goal",
  "project",
  "task",
  "focus",
  "habit",
  "scoreboard",
  "metacognition",
  "calendar",
  "manual"
]) satisfies z.ZodType<GardenSourceType>;

const safeMetadataValueSchema = z.union([z.string().trim().max(120), z.number(), z.boolean(), z.null()]);

export const gardenEventInputSchema = z
  .object({
    area: z.string().trim().min(2).max(120),
    eventType: gardenEventTypeSchema,
    impact: z.coerce.number().int().min(0).max(5),
    sourceType: gardenSourceTypeSchema,
    sourceId: z.string().trim().min(1).max(120).optional(),
    metadataMinimal: z.record(z.string(), safeMetadataValueSchema).default({})
  })
  .strict()
  .superRefine((value, context) => {
    const forbiddenKeys = ["raw_thought", "private_note", "prompt", "raw_response", "metacognition_text"];

    for (const key of forbiddenKeys) {
      if (Object.hasOwn(value.metadataMinimal, key)) {
        context.addIssue({
          code: "custom",
          message: `metadataMinimal must not contain sensitive key ${key}`,
          path: ["metadataMinimal", key]
        });
      }
    }
  });

export function normalizeLifeAreaName(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

  const match = lifeMapAreas.find((area) => {
    const name = area.name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
    return normalized === area.slug || normalized === name || name.includes(normalized);
  });

  return match?.name ?? value.trim();
}
