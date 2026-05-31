import type { GuardrailReviewOutput } from "@/ai/schemas";

import { reviewAccountabilityGuardrails } from "./accountability";
import { reviewClinicalGuardrails } from "./clinical";
import { reviewMetacognitionGuardrails } from "./metacognition";
import { reviewPastoralGuardrails } from "./pastoral";
import { reviewPrivacyGuardrails } from "./privacy";

export type AiSafetyReviewInput = {
  text: string;
  hasAccountabilityConsent?: boolean;
  accountabilityScopes?: string[];
};

export function reviewAiSafety({
  text,
  hasAccountabilityConsent = false,
  accountabilityScopes = []
}: AiSafetyReviewInput): GuardrailReviewOutput {
  const reviews = [
    reviewClinicalGuardrails(text),
    reviewPastoralGuardrails(text),
    reviewPrivacyGuardrails(text),
    reviewMetacognitionGuardrails(text),
    reviewAccountabilityGuardrails({
      text,
      hasExplicitConsent: hasAccountabilityConsent,
      allowedScopes: accountabilityScopes
    })
  ];
  const blockedBehaviors = unique(reviews.flatMap((review) => review.blocked_behaviors));
  const redactedFields = unique(reviews.flatMap((review) => review.redacted_fields));
  const crisisDetected = reviews.some((review) => review.crisis_detected);
  const requiresHumanHelp = reviews.some((review) => review.requires_human_help);
  const allowed = blockedBehaviors.length === 0 && !crisisDetected;

  return {
    schema_version: "guardrail_review_output_v1",
    allowed,
    severity: getCompositeSeverity(reviews),
    blocked_behaviors: blockedBehaviors,
    reasons: reviews.flatMap((review) => review.reasons),
    requires_human_help: requiresHumanHelp,
    crisis_detected: crisisDetected,
    redacted_fields: redactedFields,
    safe_to_persist: allowed && reviews.every((review) => review.safe_to_persist),
    safe_to_share_with_accountability:
      allowed && reviews.some((review) => review.safe_to_share_with_accountability),
    next_safe_step: allowed
      ? "Permitir revisao humana antes de persistir ou compartilhar."
      : "Bloquear a resposta e reformular com guardrails clinicos, pastorais e de privacidade.",
    reviewed_schema_version: "composite_ai_safety_v1"
  };
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
