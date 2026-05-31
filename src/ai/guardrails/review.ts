import type { BlockedBehavior, GuardrailReviewOutput } from "@/ai/schemas";

export type GuardrailMatch = {
  behavior: BlockedBehavior;
  reason: string;
  pattern: RegExp;
};

export type GuardrailReviewOptions = {
  reviewedSchemaVersion?: string;
  redactedFields?: string[];
  crisisDetected?: boolean;
  requiresHumanHelp?: boolean;
  safeToPersist?: boolean;
  safeToShareWithAccountability?: boolean;
  nextSafeStep?: string;
};

export function buildGuardrailReview(
  matches: GuardrailMatch[],
  options: GuardrailReviewOptions = {}
): GuardrailReviewOutput {
  const blockedBehaviors = [...new Set(matches.map((match) => match.behavior))];
  const allowed = blockedBehaviors.length === 0 && !options.crisisDetected;
  const severity = getSeverity(blockedBehaviors, options.crisisDetected);

  return {
    schema_version: "guardrail_review_output_v1",
    allowed,
    severity,
    blocked_behaviors: blockedBehaviors,
    reasons: matches.map((match) => match.reason),
    requires_human_help: options.requiresHumanHelp ?? Boolean(options.crisisDetected),
    crisis_detected: options.crisisDetected ?? false,
    redacted_fields: options.redactedFields ?? [],
    safe_to_persist: options.safeToPersist ?? allowed,
    safe_to_share_with_accountability: options.safeToShareWithAccountability ?? false,
    next_safe_step:
      options.nextSafeStep ??
      (allowed
        ? "Permitir revisao humana antes de persistir ou compartilhar."
        : "Bloquear a resposta e reformular com limites de seguranca."),
    reviewed_schema_version: options.reviewedSchemaVersion ?? "unversioned_text"
  };
}

export function findGuardrailMatches(text: string, checks: GuardrailMatch[]) {
  return checks.filter((check) => check.pattern.test(text));
}

function getSeverity(
  blockedBehaviors: BlockedBehavior[],
  crisisDetected: boolean | undefined
): GuardrailReviewOutput["severity"] {
  if (crisisDetected || blockedBehaviors.includes("crisis_as_productivity")) {
    return "critical";
  }

  if (
    blockedBehaviors.includes("diagnosis") ||
    blockedBehaviors.includes("therapy_replacement") ||
    blockedBehaviors.includes("unconsented_private_sharing")
  ) {
    return "high";
  }

  if (blockedBehaviors.length > 0) {
    return "medium";
  }

  return "none";
}
