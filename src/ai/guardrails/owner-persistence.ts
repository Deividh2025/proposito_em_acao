import type { GuardrailReviewOutput } from "@/ai/schemas";

import { reviewClinicalGuardrails } from "./clinical";
import { reviewMetacognitionGuardrails } from "./metacognition";
import { reviewPastoralGuardrails } from "./pastoral";

type OwnerPersistenceSafetyInput = {
  value: unknown;
  reviewedSchemaVersion: string;
};

export function reviewOwnerPersistenceSafety({
  reviewedSchemaVersion,
  value
}: OwnerPersistenceSafetyInput): GuardrailReviewOutput {
  const text = collectText(value);
  const reviews = [
    reviewClinicalGuardrails(text),
    reviewPastoralGuardrails(text),
    reviewMetacognitionGuardrails(text)
  ];
  const blockedBehaviors = unique(reviews.flatMap((review) => review.blocked_behaviors));
  const crisisDetected = reviews.some((review) => review.crisis_detected);
  const requiresHumanHelp = reviews.some((review) => review.requires_human_help);
  const safeToPersist = blockedBehaviors.length === 0 && !crisisDetected;

  return {
    schema_version: "guardrail_review_output_v1",
    allowed: safeToPersist,
    severity: getCompositeSeverity(reviews),
    blocked_behaviors: blockedBehaviors,
    reasons: reviews.flatMap((review) => review.reasons),
    requires_human_help: requiresHumanHelp,
    crisis_detected: crisisDetected,
    redacted_fields: [],
    safe_to_persist: safeToPersist,
    safe_to_share_with_accountability: false,
    next_safe_step: safeToPersist
      ? "Permitir persistencia owner-only apos revisao humana do usuario."
      : "Bloquear persistencia e regenerar output com guardrails clinicos, pastorais e de crise.",
    reviewed_schema_version: reviewedSchemaVersion
  };
}

function collectText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(collectText).join("\n");
  if (value && typeof value === "object") {
    return Object.values(value).map(collectText).join("\n");
  }

  return "";
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function getCompositeSeverity(reviews: GuardrailReviewOutput[]): GuardrailReviewOutput["severity"] {
  const order: GuardrailReviewOutput["severity"][] = ["none", "low", "medium", "high", "critical"];

  return reviews.reduce<GuardrailReviewOutput["severity"]>((highest, review) => {
    return order.indexOf(review.severity) > order.indexOf(highest) ? review.severity : highest;
  }, "none");
}
