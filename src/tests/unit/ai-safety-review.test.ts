import { describe, expect, it } from "vitest";
import { aiSafetyReviewSchema } from "@/ai/schemas";

describe("aiSafetyReviewSchema", () => {
  it("validates the minimum safe structured output shape", () => {
    const result = aiSafetyReviewSchema.parse({
      allowed: true,
      nextSafeStep: "Confirmar com o usuario antes de salvar qualquer dado."
    });

    expect(result.blockedReasons).toEqual([]);
    expect(result.requiresHumanHelp).toBe(false);
  });
});
