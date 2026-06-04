import { reviewAccountabilityGuardrails, reviewClinicalGuardrails, reviewMetacognitionGuardrails, reviewOwnerPersistenceSafety, reviewPastoralGuardrails } from "@/ai/guardrails";
import { aiRunAuditSchema, type BlockedBehavior } from "@/ai/schemas";
import { redactAiAuditMetadata } from "@/lib/ai/redaction";

import { getOpenAIErrorCategory, OpenAIProviderError } from "./errors";
import type { SafeInvokeAiInput, SafeInvokeAiResult } from "./types";

const DEFAULT_AI_TIMEOUT_MS = 20_000;

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
    const output = schema.parse(
      await withTimeout(
        provider.invoke({
          agentKey,
          schema,
          schemaName,
          promptVersion,
          input,
          instructions,
          model
        }),
        timeoutMs
      )
    );
    const outputReview = reviewOwnerPersistenceSafety({
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

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
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
