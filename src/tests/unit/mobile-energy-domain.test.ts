import { describe, expect, test } from "vitest";

import {
  buildEnergyAdjustment,
  energyCheckInInputSchema,
  mobileActionResultSchema
} from "@/domain/energy";

describe("Prompt 14 mobile energy domain", () => {
  test("validates a low-friction energy check-in", () => {
    const input = energyCheckInInputSchema.parse({
      energyLevel: "low",
      note: "Dormi mal e preciso reduzir o escopo."
    });

    expect(input.energyLevel).toBe("low");
    expect(input.note).toContain("reduzir");
  });

  test("returns a simple adjustment without moralizing low energy", () => {
    const adjustment = buildEnergyAdjustment({
      energyLevel: "low",
      note: "Dormi mal"
    });

    expect(adjustment.label).toBe("Baixa energia");
    expect(adjustment.suggestion).toContain("5 minutos");
    expect(adjustment.nextRoute).toBe("/mobile/focus");
  });

  test("keeps mobile action result explicit about local/dev fallback", () => {
    const result = mobileActionResultSchema.parse({
      mode: "local-draft",
      ok: true,
      message: "Check-in registrado nesta sessão local/dev.",
      suggestion: "Escolha uma ação mínima."
    });

    expect(result.mode).toBe("local-draft");
    expect(result.suggestion).toContain("mínima");
  });
});
