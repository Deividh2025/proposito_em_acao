import type { ZodType } from "zod";

import type { AiAgentKey } from "@/ai/agents";
import type { AiRunAudit } from "@/ai/schemas";

export type AiProviderName = "mock" | "openai";

export type AiProviderRequest<TOutput> = {
  agentKey: AiAgentKey;
  schema: ZodType<TOutput>;
  schemaName: string;
  promptVersion: string;
  input: unknown;
  instructions?: string;
  model?: string;
};

export type AiProvider = {
  name: AiProviderName;
  invoke<TOutput>(request: AiProviderRequest<TOutput>): Promise<TOutput>;
};

export type SafeInvokeAiInput<TOutput> = AiProviderRequest<TOutput> & {
  provider: AiProvider;
  fallback?: unknown;
};

export type SafeInvokeAiResult<TOutput> = {
  output: TOutput;
  source: "provider" | "fallback";
  audit: AiRunAudit;
};
