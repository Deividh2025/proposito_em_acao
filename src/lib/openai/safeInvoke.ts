import { aiRunAuditSchema } from "@/ai/schemas";

import { getOpenAIErrorCategory } from "./errors";
import type { SafeInvokeAiInput, SafeInvokeAiResult } from "./types";

const rawLogKeys = new Set(["prompt", "raw_prompt", "response", "raw_response", "input", "output"]);

export async function safeInvokeAi<TOutput>({
  agentKey,
  provider,
  schema,
  schemaName,
  promptVersion,
  input,
  instructions,
  model,
  fallback
}: SafeInvokeAiInput<TOutput>): Promise<SafeInvokeAiResult<TOutput>> {
  const start = Date.now();

  try {
    const output = await provider.invoke({
      agentKey,
      schema,
      schemaName,
      promptVersion,
      input,
      instructions,
      model
    });

    return {
      output,
      source: "provider",
      audit: aiRunAuditSchema.parse({
        schema_version: "ai_run_audit_v1",
        agent_key: agentKey,
        provider: provider.name,
        model: model ?? `${provider.name}-safe-v1`,
        prompt_version: promptVersion,
        output_schema: schemaName,
        status: "success",
        latency_ms: Date.now() - start,
        error_category: "none",
        guardrail_status: "not_run",
        blocked_behaviors: [],
        contains_raw_prompt: false,
        contains_raw_response: false
      })
    };
  } catch (error) {
    if (fallback === undefined) {
      throw error;
    }

    const output = schema.parse(fallback);
    const errorCategory = getOpenAIErrorCategory(error);

    return {
      output,
      source: "fallback",
      audit: aiRunAuditSchema.parse({
        schema_version: "ai_run_audit_v1",
        agent_key: agentKey,
        provider: provider.name,
        model: model ?? `${provider.name}-safe-v1`,
        prompt_version: promptVersion,
        output_schema: schemaName,
        status: "fallback",
        latency_ms: Date.now() - start,
        error_category: errorCategory,
        guardrail_status: "not_run",
        blocked_behaviors: [],
        contains_raw_prompt: false,
        contains_raw_response: false
      })
    };
  }
}

export function redactAiLogMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const redactedFields: string[] = [];
  const safeMetadata: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (rawLogKeys.has(key)) {
      redactedFields.push(key);
      continue;
    }

    safeMetadata[key] = value;
  }

  if (redactedFields.length > 0) {
    safeMetadata.redacted_fields = redactedFields;
  }

  return safeMetadata;
}
