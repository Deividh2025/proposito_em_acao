import { describe, expect, test } from "vitest";

import { designModes, designTokens } from "@/lib/design/tokens";

describe("design tokens", () => {
  test("define the foundational visual system for Propósito em Ação", () => {
    expect(designTokens.colors.purpose[700]).toBe("#17633f");
    expect(designTokens.radii.card).toBe("0.5rem");
    expect(designTokens.motion.duration.base).toBe("180ms");
  });

  test("include low-energy and restart modes without punitive language", () => {
    expect(designModes.lowEnergy.name).toBe("Modo baixa energia");
    expect(designModes.restart.name).toBe("Modo recomeço");
    expect(designModes.restart.tone).toContain("retomada");
  });
});
