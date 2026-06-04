import type { ZodType } from "zod";

import type { AiAgentKey } from "@/ai/agents";
import type { AiRunAudit } from "@/ai/schemas";
import type { OpenAIErrorCategory } from "./errors";

export type AiProviderName = "mock" | "openai" | "deepseek";
export type AiProviderPreference = "automatic" | "openai" | "deepseek";
export type AiInvocationMode = "mock" | "real" | "fallback";
export type GuardrailStatus = "passed" | "blocked" | "failed";

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
  timeoutMs?: number;
  fallbackReason?: string | null;
  consentVersion?: string | null;
  realProviderAuthorized?: boolean;
  authorizationFailureReason?: OpenAIErrorCategory;
};

export type SafeInvokeAiResult<TOutput> = {
  output: TOutput;
  source: "provider" | "fallback";
  audit: AiRunAudit;
};
