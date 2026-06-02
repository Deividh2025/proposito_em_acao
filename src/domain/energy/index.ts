import { z } from "zod";

import { executionActionResultSchema } from "@/domain/execution/persistence";

import type { EnergyAdjustment } from "./types";

export * from "./types";

export const energyLevelSchema = z.enum(["low", "medium", "high"]);

export const energyCheckInInputSchema = z
  .object({
    energyLevel: energyLevelSchema,
    note: z.string().trim().max(500).optional(),
    source: z.enum(["mobile", "focus", "daily_checkin", "manual"]).default("mobile"),
    clientCreatedAt: z.string().trim().max(40).optional(),
    clientMutationId: z.string().trim().min(8).max(120).optional()
  })
  .strict();

export const mobileActionResultSchema = executionActionResultSchema.extend({
  suggestion: z.string().trim().max(500).optional()
});

export type EnergyCheckInInput = z.infer<typeof energyCheckInInputSchema>;
export type MobileActionResult = z.infer<typeof mobileActionResultSchema>;

export function buildEnergyAdjustment(input: Pick<EnergyCheckInInput, "energyLevel" | "note">): EnergyAdjustment {
  if (input.energyLevel === "low") {
    return {
      label: "Baixa energia",
      suggestion: "Escolha 5 minutos, uma versão mínima ou descanso legítimo antes de tentar ampliar.",
      nextRoute: "/mobile/focus",
      tone: "low-energy"
    };
  }

  if (input.energyLevel === "high") {
    return {
      label: "Energia alta",
      suggestion: "Use a clareza para uma ação importante, sem aumentar todas as metas do dia.",
      nextRoute: "/mobile/today",
      tone: "expansive"
    };
  }

  return {
    label: "Energia média",
    suggestion: "Escolha uma ação de 15 minutos e registre onde parar.",
    nextRoute: "/mobile/today",
    tone: "steady"
  };
}
