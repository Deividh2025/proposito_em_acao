import "server-only";

import type { ZodType } from "zod";

import type { AiAgentKey } from "@/ai/agents";
import { createDeepSeekProvider } from "@/lib/deepseek/provider";
import { createOpenAIProvider } from "@/lib/openai/provider";
import {
  createMockAiProvider,
  safeInvokeAi,
  type AiProvider,
  type AiProviderPreference,
  type SafeInvokeAiResult
} from "@/lib/openai";

import {
  AI_PROVIDER_CONSENT_VERSION,
  checkAiDailyLimit,
  resolveAiProviderRoute,
  type AiProviderConsentRecord,
  type AiProviderModels,
  type RealAiProviderName
} from "./routing";

type AiProviderOverrides = Partial<Record<RealAiProviderName, AiProvider>>;

export type InvokeAiWithSafeRoutingInput<TOutput> = {
  agentKey: AiAgentKey;
  schema: ZodType<TOutput>;
  schemaName: string;
  promptVersion: string;
  input: unknown;
  instructions?: string;
  fallback: TOutput;
  mockOutput?: TOutput;
  preference?: AiProviderPreference;
  consentRecords?: AiProviderConsentRecord[];
  requiredConsentVersion?: string;
  realEnabled?: boolean;
  models?: AiProviderModels;
  timeoutMs?: number;
  providers?: AiProviderOverrides;
  usedToday?: number;
};

export async function invokeAiWithSafeRouting<TOutput>({
  agentKey,
  schema,
  schemaName,
  promptVersion,
  input,
  instructions,
  fallback,
  mockOutput = fallback,
  preference,
  consentRecords = [],
  requiredConsentVersion = AI_PROVIDER_CONSENT_VERSION,
  realEnabled,
  models,
  timeoutMs,
  providers,
  usedToday = 0
}: InvokeAiWithSafeRoutingInput<TOutput>): Promise<SafeInvokeAiResult<TOutput>> {
  const env = getAiInvocationEnv();
  const route = resolveAiProviderRoute({
    agentKey,
    preference: preference ?? env.AI_PROVIDER_DEFAULT,
    realEnabled: realEnabled ?? env.AI_REAL_ENABLED,
    consentRecords,
    requiredConsentVersion,
    models:
      models ??
      {
        openaiFast: env.OPENAI_MODEL_FAST,
        openaiPro: env.OPENAI_MODEL_PRO,
        legacyOpenAI: env.OPENAI_MODEL,
        deepseekFlash: env.DEEPSEEK_MODEL_FLASH,
        deepseekPro: env.DEEPSEEK_MODEL_PRO
      }
  });

  const limit =
    route.mode === "real"
      ? checkAiDailyLimit({
          usedToday,
          dailyLimit: env.AI_DAILY_USER_LIMIT
        })
      : { allowed: true as const, remaining: null, reason: null };
  const provider =
    route.providerName === "mock"
      ? createMockAiProvider({ [agentKey]: mockOutput })
      : resolveRealProvider(route.providerName, providers);
  const fallbackReason = limit.allowed ? route.fallbackReason : limit.reason;

  return safeInvokeAi({
    agentKey,
    provider,
    schema,
    schemaName,
    promptVersion,
    input,
    instructions,
    fallback,
    model: route.model,
    timeoutMs: timeoutMs ?? env.AI_REQUEST_TIMEOUT_MS,
    fallbackReason,
    consentVersion: route.consentVersion,
    realProviderAuthorized: route.mode === "real" && limit.allowed,
    authorizationFailureReason: fallbackReason ?? "missing_provider_consent"
  });
}

function resolveRealProvider(providerName: RealAiProviderName, providers?: AiProviderOverrides) {
  if (providers?.[providerName]) {
    return providers[providerName];
  }

  return providerName === "openai" ? createOpenAIProvider() : createDeepSeekProvider();
}

function getAiInvocationEnv() {
  return {
    AI_PROVIDER_DEFAULT: parseProviderPreference(process.env.AI_PROVIDER_DEFAULT),
    AI_REAL_ENABLED: process.env.AI_REAL_ENABLED === "true",
    AI_REQUEST_TIMEOUT_MS: parsePositiveInteger(process.env.AI_REQUEST_TIMEOUT_MS, 20_000),
    AI_DAILY_USER_LIMIT: parsePositiveInteger(process.env.AI_DAILY_USER_LIMIT, 50),
    OPENAI_MODEL: process.env.OPENAI_MODEL || "",
    OPENAI_MODEL_FAST: process.env.OPENAI_MODEL_FAST || "gpt-5.4-mini",
    OPENAI_MODEL_PRO: process.env.OPENAI_MODEL_PRO || "gpt-5.5",
    DEEPSEEK_MODEL_FLASH: process.env.DEEPSEEK_MODEL_FLASH || "deepseek-chat",
    DEEPSEEK_MODEL_PRO: process.env.DEEPSEEK_MODEL_PRO || "deepseek-reasoner"
  };
}

function parseProviderPreference(value: string | undefined): AiProviderPreference {
  return value === "openai" || value === "deepseek" || value === "automatic" ? value : "automatic";
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
