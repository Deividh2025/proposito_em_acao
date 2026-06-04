import type { AiAgentKey } from "@/ai/agents";
import type { AiProviderName, AiProviderPreference, AiInvocationMode, OpenAIErrorCategory } from "@/lib/openai";

export const AI_PROVIDER_CONSENT_VERSION = "ai-provider-consent-v1";

export type RealAiProviderName = Exclude<AiProviderName, "mock">;

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

const proAgentKeys = new Set<AiAgentKey>(["calling", "metacognition", "weeklyReview", "accountability"]);

export function hasRequiredAiProviderConsent({
  provider,
  requiredVersion = AI_PROVIDER_CONSENT_VERSION,
  records
}: {
  provider: RealAiProviderName;
  requiredVersion?: string;
  records: AiProviderConsentRecord[];
}) {
  return records.some((record) => {
    const grantedAt = record.grantedAt ?? record.acceptedAt;

    return (
      record.provider === provider &&
      record.version === requiredVersion &&
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
  requiredConsentVersion = AI_PROVIDER_CONSENT_VERSION
}: {
  agentKey: AiAgentKey;
  preference: AiProviderPreference;
  realEnabled: boolean;
  consentRecords: AiProviderConsentRecord[];
  models: AiProviderModels;
  requiredConsentVersion?: string;
}): AiProviderRoute {
  if (!realEnabled) {
    return mockRoute(preference, "ai_real_disabled", requiredConsentVersion);
  }

  const providerName = resolveConcreteProvider(agentKey, preference);

  if (
    !hasRequiredAiProviderConsent({
      provider: providerName,
      requiredVersion: requiredConsentVersion,
      records: consentRecords
    })
  ) {
    return mockRoute(preference, "missing_provider_consent", requiredConsentVersion, "fallback");
  }

  const model = resolveProviderModel(agentKey, providerName, models);

  if (!model) {
    return mockRoute(preference, "provider_model_missing", requiredConsentVersion, "fallback");
  }

  return {
    requestedPreference: preference,
    providerName,
    mode: "real",
    model,
    fallbackReason: null,
    consentVersion: requiredConsentVersion
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

function resolveConcreteProvider(agentKey: AiAgentKey, preference: AiProviderPreference): RealAiProviderName {
  if (preference === "openai" || preference === "deepseek") {
    return preference;
  }

  return sensitiveAgentKeys.has(agentKey) ? "openai" : "deepseek";
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
  mode: AiInvocationMode = "mock"
): AiProviderRoute {
  return {
    requestedPreference,
    providerName: "mock",
    mode,
    model: "mock-safe-v1",
    fallbackReason,
    consentVersion
  };
}
