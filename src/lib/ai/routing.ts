import type { AiAgentKey } from "@/ai/agents";
import type { AiProviderName, AiProviderPreference, AiInvocationMode, OpenAIErrorCategory } from "@/lib/openai";

export type RealAiProviderName = Exclude<AiProviderName, "mock">;

export const AI_PROVIDER_CONSENT_VERSIONS = {
  deepseek: "ai_provider_deepseek_v1",
  openai: "ai_provider_openai_v1"
} as const satisfies Record<RealAiProviderName, string>;
export const AI_PROVIDER_CONSENT_VERSION = AI_PROVIDER_CONSENT_VERSIONS.deepseek;

export type AiProviderConsentRecord = {
  provider: RealAiProviderName;
  version: string;
  grantedAt?: string | null;
  acceptedAt?: string | null;
  revokedAt?: string | null;
};

export type AiProviderModels = {
  openaiFast?: string;
  openaiPro?: string;
  deepseekFlash?: string;
  deepseekPro?: string;
  legacyOpenAI?: string;
};

export type AiProviderRoute = {
  requestedPreference: AiProviderPreference;
  providerName: AiProviderName;
  mode: AiInvocationMode;
  model: string;
  fallbackReason: OpenAIErrorCategory | null;
  consentVersion: string | null;
};

export type AiDailyLimitResult =
  | { allowed: true; remaining: number | null; reason: null }
  | { allowed: false; remaining: 0; reason: "daily_user_limit_reached" };

/*
const sensitiveAgentKeys = new Set<AiAgentKey>([
  "calling",
  "lifeMap",
  "smartGoal",
  "metacognition",
  "weeklyReview",
  "accountability",
  "commitmentDocument",
  "guardrailReviewer"
]);
*/

const proAgentKeys = new Set<AiAgentKey>(["calling", "metacognition", "weeklyReview", "accountability"]);

export function hasRequiredAiProviderConsent({
  provider,
  requiredVersion,
  records
}: {
  provider: RealAiProviderName;
  requiredVersion?: string;
  records: AiProviderConsentRecord[];
}) {
  const expectedVersion = requiredVersion ?? AI_PROVIDER_CONSENT_VERSIONS[provider];

  return records.some((record) => {
    const grantedAt = record.grantedAt ?? record.acceptedAt;

    return (
      record.provider === provider &&
      record.version === expectedVersion &&
      Boolean(grantedAt) &&
      !record.revokedAt
    );
  });
}

export function resolveAiProviderRoute({
  agentKey,
  preference,
  realEnabled,
  consentRecords,
  models,
  requiredConsentVersion
}: {
  agentKey: AiAgentKey;
  preference: AiProviderPreference;
  realEnabled: boolean;
  consentRecords: AiProviderConsentRecord[];
  models: AiProviderModels;
  requiredConsentVersion?: string;
}): AiProviderRoute {
  if (!realEnabled) {
    return mockRoute(preference, "ai_real_disabled", requiredConsentVersion ?? null);
  }

  const providerName = resolveConcreteProvider(agentKey, preference);
  const providerConsentVersion = requiredConsentVersion ?? AI_PROVIDER_CONSENT_VERSIONS[providerName];

  if (
    !hasRequiredAiProviderConsent({
      provider: providerName,
      requiredVersion: providerConsentVersion,
      records: consentRecords
    })
  ) {
    return fallbackRoute(preference, providerName, "missing_provider_consent", providerConsentVersion);
  }

  const model = resolveProviderModel(agentKey, providerName, models);

  if (!model) {
    return fallbackRoute(preference, providerName, "provider_model_missing", providerConsentVersion);
  }

  return {
    requestedPreference: preference,
    providerName,
    mode: "real",
    model,
    fallbackReason: null,
    consentVersion: providerConsentVersion
  };
}

export function checkAiDailyLimit({
  usedToday,
  dailyLimit
}: {
  usedToday: number;
  dailyLimit?: number | null;
}): AiDailyLimitResult {
  if (!dailyLimit || dailyLimit < 1) {
    return { allowed: true, remaining: null, reason: null };
  }

  const remaining = Math.max(dailyLimit - usedToday, 0);

  if (remaining <= 0) {
    return { allowed: false, remaining: 0, reason: "daily_user_limit_reached" };
  }

  return { allowed: true, remaining, reason: null };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function resolveConcreteProvider(agentKey: AiAgentKey, preference: AiProviderPreference): RealAiProviderName {
  return "deepseek";
}

function resolveProviderModel(agentKey: AiAgentKey, providerName: RealAiProviderName, models: AiProviderModels) {
  if (providerName === "openai") {
    return proAgentKeys.has(agentKey) ? models.openaiPro || models.legacyOpenAI : models.openaiFast || models.legacyOpenAI;
  }

  return proAgentKeys.has(agentKey) ? models.deepseekPro : models.deepseekFlash;
}

function mockRoute(
  requestedPreference: AiProviderPreference,
  fallbackReason: OpenAIErrorCategory,
  consentVersion: string | null,
): AiProviderRoute {
  return {
    requestedPreference,
    providerName: "mock",
    mode: "mock",
    model: "mock-safe-v1",
    fallbackReason,
    consentVersion
  };
}

function fallbackRoute(
  requestedPreference: AiProviderPreference,
  providerName: RealAiProviderName,
  fallbackReason: OpenAIErrorCategory,
  consentVersion: string
): AiProviderRoute {
  return {
    requestedPreference,
    providerName,
    mode: "fallback",
    model: `${providerName}-safe-v1`,
    fallbackReason,
    consentVersion
  };
}
