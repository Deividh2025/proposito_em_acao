import { reviewAccountabilityGuardrails, reviewClinicalGuardrails, reviewMetacognitionGuardrails, reviewOwnerPersistenceSafety, reviewPastoralGuardrails } from "@/ai/guardrails";
import { aiRunAuditSchema, type BlockedBehavior, type GuardrailReviewOutput } from "@/ai/schemas";
import { redactAiAuditMetadata } from "@/lib/ai/redaction";

import { getOpenAIErrorCategory, OpenAIProviderError } from "./errors";
import type { SafeInvokeAiInput, SafeInvokeAiResult } from "./types";

const DEFAULT_AI_TIMEOUT_MS = 20_000;
const providerInputSensitiveKeys = new Set([
  "api_key",
  "apikey",
  "authorization",
  "raw_prompt",
  "raw_response",
  "secret",
  "token"
]);
const accountabilityOutputAgents = new Set(["accountability", "commitmentDocument"]);

export async function safeInvokeAi<TOutput>({
  agentKey,
  provider,
  schema,
  schemaName,
  promptVersion,
  input,
  instructions,
  model,
  fallback,
  timeoutMs = DEFAULT_AI_TIMEOUT_MS,
  fallbackReason = null,
  consentVersion = null,
  realProviderAuthorized = false,
  authorizationFailureReason = "missing_provider_consent"
}: SafeInvokeAiInput<TOutput>): Promise<SafeInvokeAiResult<TOutput>> {
  const start = Date.now();
  const inputReview = reviewProviderBoundaryText(toGuardrailText(input), provider.name === "mock");

  if (!inputReview.allowed) {
    const { output: fallbackOutput } = parseSafeFallback({ schema, schemaName, fallback });

    return {
      output: fallbackOutput,
      source: "fallback",
      audit: aiRunAuditSchema.parse({
        schema_version: "ai_run_audit_v1",
        agent_key: agentKey,
        provider: provider.name,
        invocation_mode: "fallback",
        model: model ?? `${provider.name}-safe-v1`,
        prompt_version: promptVersion,
        output_schema: schemaName,
        status: "blocked",
        latency_ms: Date.now() - start,
        error_category: "guardrail_blocked",
        guardrail_status: "blocked",
        blocked_behaviors: inputReview.blockedBehaviors,
        contains_raw_prompt: false,
        contains_raw_response: false,
        fallback_reason: "guardrail_blocked",
        consent_version: consentVersion,
        timestamp: new Date().toISOString()
      })
    };
  }

  if (provider.name !== "mock" && !realProviderAuthorized) {
    const { output: fallbackOutput } = parseSafeFallback({ schema, schemaName, fallback });

    return {
      output: fallbackOutput,
      source: "fallback",
      audit: aiRunAuditSchema.parse({
        schema_version: "ai_run_audit_v1",
        agent_key: agentKey,
        provider: provider.name,
        invocation_mode: "fallback",
        model: model ?? `${provider.name}-safe-v1`,
        prompt_version: promptVersion,
        output_schema: schemaName,
        status: "fallback",
        latency_ms: Date.now() - start,
        error_category: authorizationFailureReason,
        guardrail_status: "passed",
        blocked_behaviors: [],
        contains_raw_prompt: false,
        contains_raw_response: false,
        fallback_reason: fallbackReason ?? authorizationFailureReason,
        consent_version: consentVersion,
        timestamp: new Date().toISOString()
      })
    };
  }

  try {
    const abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
    const minimizedInput = minimizeProviderInput(input);
    const output = schema.parse(
      await withTimeout(
        provider.invoke({
          agentKey,
          schema,
          schemaName,
          promptVersion,
          input: minimizedInput,
          instructions,
          model,
          signal: abortController?.signal
        }),
        timeoutMs,
        () => abortController?.abort()
      )
    );
    const outputReview = reviewProviderOutputSafety({
      agentKey,
      reviewedSchemaVersion: schemaName,
      value: output
    });

    if (!outputReview.safe_to_persist) {
      const { output: fallbackOutput } = parseSafeFallback({ schema, schemaName, fallback });

      return {
        output: fallbackOutput,
        source: "fallback",
        audit: aiRunAuditSchema.parse({
          schema_version: "ai_run_audit_v1",
          agent_key: agentKey,
          provider: provider.name,
          invocation_mode: "fallback",
          model: model ?? `${provider.name}-safe-v1`,
          prompt_version: promptVersion,
          output_schema: schemaName,
          status: "blocked",
          latency_ms: Date.now() - start,
          error_category: "guardrail_blocked",
          guardrail_status: "blocked",
          blocked_behaviors: outputReview.blocked_behaviors,
          contains_raw_prompt: false,
          contains_raw_response: false,
          fallback_reason: "output_guardrail_blocked",
          consent_version: consentVersion,
          timestamp: new Date().toISOString()
        })
      };
    }

    return {
      output,
      source: "provider",
      audit: aiRunAuditSchema.parse({
        schema_version: "ai_run_audit_v1",
        agent_key: agentKey,
        provider: provider.name,
        invocation_mode: provider.name === "mock" ? "mock" : "real",
        model: model ?? `${provider.name}-safe-v1`,
        prompt_version: promptVersion,
        output_schema: schemaName,
        status: "success",
        latency_ms: Date.now() - start,
        error_category: "none",
        guardrail_status: "passed",
        blocked_behaviors: [],
        contains_raw_prompt: false,
        contains_raw_response: false,
        fallback_reason: fallbackReason,
        consent_version: consentVersion,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    if (fallback === undefined) {
      throw error;
    }

    const { output } = parseSafeFallback({ schema, schemaName, fallback });
    const errorCategory = getOpenAIErrorCategory(error);

    return {
      output,
      source: "fallback",
      audit: aiRunAuditSchema.parse({
        schema_version: "ai_run_audit_v1",
        agent_key: agentKey,
        provider: provider.name,
        invocation_mode: "fallback",
        model: model ?? `${provider.name}-safe-v1`,
        prompt_version: promptVersion,
        output_schema: schemaName,
        status: "fallback",
        latency_ms: Date.now() - start,
        error_category: errorCategory,
        guardrail_status: "passed",
        blocked_behaviors: [],
        contains_raw_prompt: false,
        contains_raw_response: false,
        fallback_reason: fallbackReason ?? errorCategory,
        consent_version: consentVersion,
        timestamp: new Date().toISOString()
      })
    };
  }
}

export function redactAiLogMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  return redactAiAuditMetadata(metadata);
}

function parseFallback<TOutput>({
  schema,
  fallback
}: {
  schema: SafeInvokeAiInput<TOutput>["schema"];
  fallback: unknown;
}) {
  if (fallback === undefined) {
    throw new OpenAIProviderError("guardrail_blocked", "AI output was blocked and no fallback was configured.");
  }

  return schema.parse(fallback);
}

function parseSafeFallback<TOutput>({
  schema,
  schemaName,
  fallback
}: {
  schema: SafeInvokeAiInput<TOutput>["schema"];
  schemaName: string;
  fallback: unknown;
}) {
  const output = parseFallback({ schema, fallback });
  const review = reviewOwnerPersistenceSafety({
    reviewedSchemaVersion: schemaName,
    value: output
  });

  if (!review.safe_to_persist) {
    throw new OpenAIProviderError("guardrail_blocked", "AI fallback failed output guardrails.");
  }

  return { output, review };
}

function toGuardrailText(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value);
}

function minimizeProviderInput(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(minimizeProviderInput);
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const safe: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    if (providerInputSensitiveKeys.has(key.toLowerCase())) {
      continue;
    }

    safe[key] = minimizeProviderInput(nestedValue);
  }

  return safe;
}

function reviewProviderOutputSafety({
  agentKey,
  reviewedSchemaVersion,
  value
}: {
  agentKey: string;
  reviewedSchemaVersion: string;
  value: unknown;
}): GuardrailReviewOutput {
  const ownerReview = reviewOwnerPersistenceSafety({
    reviewedSchemaVersion,
    value
  });

  if (!accountabilityOutputAgents.has(agentKey)) {
    return ownerReview;
  }

  const accountabilityReview = reviewAccountabilityGuardrails({
    text: toGuardrailText(value),
    hasExplicitConsent: false,
    allowedScopes: []
  });

  return combineOutputReviews(reviewedSchemaVersion, [ownerReview, accountabilityReview]);
}

function combineOutputReviews(
  reviewedSchemaVersion: string,
  reviews: GuardrailReviewOutput[]
): GuardrailReviewOutput {
  const blockedBehaviors = unique(reviews.flatMap((review) => review.blocked_behaviors));
  const redactedFields = unique(reviews.flatMap((review) => review.redacted_fields));
  const crisisDetected = reviews.some((review) => review.crisis_detected);
  const requiresHumanHelp = reviews.some((review) => review.requires_human_help);
  const safeToPersist =
    blockedBehaviors.length === 0 && !crisisDetected && reviews.every((review) => review.safe_to_persist);

  return {
    schema_version: "guardrail_review_output_v1",
    allowed: safeToPersist,
    severity: highestSeverity(reviews),
    blocked_behaviors: blockedBehaviors,
    reasons: unique(reviews.flatMap((review) => review.reasons)),
    requires_human_help: requiresHumanHelp,
    crisis_detected: crisisDetected,
    redacted_fields: redactedFields,
    safe_to_persist: safeToPersist,
    safe_to_share_with_accountability: false,
    next_safe_step: safeToPersist
      ? "Permitir persistencia owner-only apos revisao humana do usuario."
      : "Bloquear output antes de persistir ou compartilhar com Atalaia.",
    reviewed_schema_version: reviewedSchemaVersion
  };
}

function highestSeverity(reviews: GuardrailReviewOutput[]): GuardrailReviewOutput["severity"] {
  const order: GuardrailReviewOutput["severity"][] = ["none", "low", "medium", "high", "critical"];

  return reviews.reduce<GuardrailReviewOutput["severity"]>((highest, review) => {
    return order.indexOf(review.severity) > order.indexOf(highest) ? review.severity : highest;
  }, "none");
}

function reviewProviderBoundaryText(text: string, isMockProvider: boolean) {
  const reviews = [
    reviewClinicalGuardrails(text),
    reviewPastoralGuardrails(text),
    reviewMetacognitionGuardrails(text),
    reviewAccountabilityGuardrails({
      text,
      hasExplicitConsent: false,
      allowedScopes: []
    })
  ];
  const blockedBehaviors = [...new Set(reviews.flatMap((review) => review.blocked_behaviors))];
  const crisisDetected = reviews.some((review) => review.crisis_detected);
  const blocksForMock = blockedBehaviors.filter((behavior) => behavior !== "unconsented_private_sharing");
  const effectiveBlockedBehaviors = isMockProvider ? blocksForMock : blockedBehaviors;

  return {
    allowed: effectiveBlockedBehaviors.length === 0 && !crisisDetected,
    blockedBehaviors: effectiveBlockedBehaviors as BlockedBehavior[]
  };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, onTimeout?: () => void) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      onTimeout?.();
      reject(new OpenAIProviderError("provider_timeout", "AI provider request timed out."));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
