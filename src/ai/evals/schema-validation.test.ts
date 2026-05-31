import { describe, expect, it } from "vitest";

import { getAiAgentDefinition } from "@/ai/agents";
import { guardrailReviewOutputSchema } from "@/ai/schemas";

import { callingEvalCases } from "./calling.cases";
import { metacognitionEvalCases } from "./metacognition.cases";
import { safetyEvalCases } from "./safety.cases";

const allEvalCases = [...callingEvalCases, ...metacognitionEvalCases, ...safetyEvalCases];

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
    for (const evalCase of safetyEvalCases) {
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
});
