import { describe, expect, it } from "vitest";

import { getAiAgentDefinition } from "@/ai/agents";
import { guardrailReviewOutputSchema } from "@/ai/schemas";
import { reviewAiSafety, reviewMetacognitionGuardrails } from "@/ai/guardrails";

import { callingEvalCases } from "./calling.cases";
import { actionUnblockerEvalCases } from "./action-unblocker.cases";
import { crisisGuardrailEvalCases } from "./crisis-guardrail.cases";
import { consentEvalCases } from "./consent.cases";
import { guardrailIoEvalCases } from "./guardrail-io.cases";
import { metacognitionEvalCases } from "./metacognition.cases";
import { providerRuntimeEvalCases } from "./provider-runtime.cases";
import { safetyEvalCases } from "./safety.cases";

const allEvalCases = [
  ...callingEvalCases,
  ...actionUnblockerEvalCases,
  ...metacognitionEvalCases,
  ...crisisGuardrailEvalCases,
  ...safetyEvalCases
];
const providerEvalCases = [...providerRuntimeEvalCases, ...consentEvalCases, ...guardrailIoEvalCases];

describe("Prompt 7 eval case registry", () => {
  it("links every eval case to an existing agent and expected schema", () => {
    for (const evalCase of allEvalCases) {
      const agent = getAiAgentDefinition(evalCase.agentKey);

      expect(agent.key).toBe(evalCase.agentKey);
      expect(evalCase.expectedSchema).toMatch(/_v1$/);
      expect(evalCase.safeExpectation.length).toBeGreaterThan(20);
    }
  });

  it("keeps safety eval cases compatible with guardrail review schema", () => {
    for (const evalCase of [...safetyEvalCases, ...metacognitionEvalCases, ...crisisGuardrailEvalCases]) {
      const parsed = guardrailReviewOutputSchema.parse({
        schema_version: "guardrail_review_output_v1",
        allowed: !evalCase.shouldBlock,
        severity: evalCase.shouldBlock ? "high" : "none",
        blocked_behaviors: evalCase.expectedBlockedBehaviors,
        reasons: [evalCase.safeExpectation],
        requires_human_help: evalCase.category === "crisis",
        crisis_detected: evalCase.category === "crisis",
        redacted_fields: [],
        safe_to_persist: !evalCase.shouldBlock,
        safe_to_share_with_accountability: false,
        next_safe_step: evalCase.safeExpectation,
        reviewed_schema_version: evalCase.expectedSchema
      });

      expect(parsed.schema_version).toBe("guardrail_review_output_v1");
    }
  });

  it("executes negative guardrail eval cases against deterministic safety checks", () => {
    const negativeCases = allEvalCases.filter((evalCase) => evalCase.shouldBlock);

    for (const evalCase of negativeCases) {
      const review =
        evalCase.category === "crisis"
          ? reviewMetacognitionGuardrails(evalCase.input)
          : reviewAiSafety({
              text: evalCase.input,
              hasAccountabilityConsent: false,
              accountabilityScopes: ["status"]
            });

      expect(review.allowed, evalCase.id).toBe(false);
      expect(review.blocked_behaviors, evalCase.id).toEqual(
        expect.arrayContaining(evalCase.expectedBlockedBehaviors)
      );

      if (evalCase.category === "crisis") {
        expect(review.crisis_detected, evalCase.id).toBe(true);
        expect(review.requires_human_help, evalCase.id).toBe(true);
      }
    }
  });

  it("keeps provider runtime eval cases explicit and non-networked", () => {
    for (const evalCase of providerEvalCases) {
      const agent = getAiAgentDefinition(evalCase.agentKey);

      expect(agent.key).toBe(evalCase.agentKey);
      expect(evalCase.expectedSchema).toMatch(/_v1$/);
      expect(evalCase.safeExpectation.length).toBeGreaterThan(20);
      expect(["mock", "openai", "deepseek"]).toContain(evalCase.expectedProvider);
      expect(["automatic", "openai", "deepseek"]).toContain(evalCase.preference);

      if (!evalCase.realEnabled || evalCase.consentState !== "granted") {
        expect(evalCase.providerCanBeCalled, evalCase.id).toBe(false);
        expect(evalCase.expectedFallbackReason, evalCase.id).toBeTruthy();
      }

      if (evalCase.expectedFallbackReason === "guardrail_blocked" && evalCase.providerCanBeCalled === false) {
        expect(evalCase.shouldBlock, evalCase.id).toBe(true);
      }
    }
  });
});
