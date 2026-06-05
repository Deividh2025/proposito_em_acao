"use server";

import { z } from "zod";

import {
  createAccountDeletionRequest,
  grantPrivacyConsent,
  persistBetaFeedback,
  revokePrivacyConsent,
  saveUserSettings
} from "@/lib/supabase/queries/privacy-settings";
import {
  ACCOUNT_DELETION_CONFIRMATION,
  type PrivacyConsentType,
  type UserSettingsPreferences
} from "@/domain/privacy";
import type {
  PersistableBetaFeedback,
  PersistBetaFeedbackActionResult
} from "@/domain/feedback";

const aiProviderPreferenceSchema = z.enum(["automatic", "openai", "deepseek"]);
const aiConsentProviderSchema = z.enum(["openai", "deepseek"]);
const consentDecisionSchema = z.enum(["grant", "revoke"]);
const aiToneSchema = z.enum(["encouraging", "direct", "gentle", "structured"]);
const christianLayerIntensitySchema = z.enum(["off", "light", "balanced", "strong"]);

const preferencesSchema = z.object({
  aiProviderPreference: aiProviderPreferenceSchema,
  aiTone: aiToneSchema,
  analyticsOptIn: z.boolean(),
  christianLayerIntensity: christianLayerIntensitySchema,
  lowEnergyMode: z.boolean()
});

type PrivacyActionLike = {
  ok: boolean;
  message: string;
  mode: "local-demo" | "supabase";
  reason?: string;
};

export type SettingsActionResult = {
  ok: boolean;
  persisted: boolean;
  status: "blocked" | "invalid" | "local_draft" | "saved";
  message: string;
  scope?: string;
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function invalidResult(message: string): SettingsActionResult {
  return {
    ok: false,
    persisted: false,
    status: "invalid",
    message
  };
}

function fromPrivacyResult(result: PrivacyActionLike, scope: string): SettingsActionResult {
  return {
    ok: result.ok,
    persisted: result.ok && result.mode === "supabase",
    scope,
    status: result.ok ? (result.mode === "local-demo" ? "local_draft" : "saved") : "blocked",
    message: result.ok ? result.message : `${result.message} (${result.reason ?? "blocked"})`
  };
}

function aiConsentType(provider: "openai" | "deepseek"): PrivacyConsentType {
  return provider === "openai" ? "ai_provider_openai" : "ai_provider_deepseek";
}

export async function saveSettingsPreferencesAction(formData: FormData): Promise<SettingsActionResult> {
  const parsed = preferencesSchema.safeParse({
    aiProviderPreference: readText(formData, "aiProviderPreference"),
    aiTone: readText(formData, "aiTone"),
    analyticsOptIn: readBoolean(formData, "analyticsOptIn"),
    christianLayerIntensity: readText(formData, "christianLayerIntensity"),
    lowEnergyMode: readBoolean(formData, "lowEnergyMode")
  });

  if (!parsed.success) {
    return invalidResult("Revise provider, tom e intensidade antes de salvar.");
  }

  const preferences: UserSettingsPreferences = parsed.data;
  const result = await saveUserSettings(preferences);

  return fromPrivacyResult(result, "settings_preferences");
}

export async function updateAiProviderConsentAction(formData: FormData): Promise<SettingsActionResult> {
  const provider = aiConsentProviderSchema.safeParse(readText(formData, "provider"));
  const decision = consentDecisionSchema.safeParse(readText(formData, "decision"));

  if (!provider.success || !decision.success) {
    return invalidResult("Consentimento de IA invalido. Escolha OpenAI ou DeepSeek e tente novamente.");
  }

  if (decision.data === "grant" && !readBoolean(formData, "confirmProviderConsent")) {
    return invalidResult(`Confirme o consentimento ai_provider_${provider.data}_v1 antes de autorizar.`);
  }

  const type = aiConsentType(provider.data);
  const result = decision.data === "grant" ? await grantPrivacyConsent(type) : await revokePrivacyConsent(type);

  return fromPrivacyResult(result, type);
}

export async function updateProductAnalyticsConsentAction(formData: FormData): Promise<SettingsActionResult> {
  const decision = consentDecisionSchema.safeParse(readText(formData, "decision"));

  if (!decision.success) {
    return invalidResult("Escolha autorizar ou revogar analytics.");
  }

  if (decision.data === "grant" && !readBoolean(formData, "confirmAnalyticsConsent")) {
    return invalidResult("Confirme o opt-in product_analytics_v1 antes de autorizar.");
  }

  const result =
    decision.data === "grant"
      ? await grantPrivacyConsent("product_analytics")
      : await revokePrivacyConsent("product_analytics");

  return fromPrivacyResult(result, "product_analytics");
}

export async function updateBetaFeedbackConsentAction(formData: FormData): Promise<SettingsActionResult> {
  const decision = consentDecisionSchema.safeParse(readText(formData, "decision"));

  if (!decision.success) {
    return invalidResult("Escolha autorizar ou revogar feedback beta.");
  }

  if (decision.data === "grant" && !readBoolean(formData, "confirmFeedbackConsent")) {
    return invalidResult("Confirme o consentimento beta_feedback_v1 antes de autorizar.");
  }

  const result =
    decision.data === "grant"
      ? await grantPrivacyConsent("beta_feedback")
      : await revokePrivacyConsent("beta_feedback");

  return fromPrivacyResult(result, "beta_feedback");
}

export async function requestAccountDeletionAction(formData: FormData): Promise<SettingsActionResult> {
  if (readText(formData, "confirmation") !== ACCOUNT_DELETION_CONFIRMATION) {
    return invalidResult(`Digite ${ACCOUNT_DELETION_CONFIRMATION} para registrar a solicitacao com seguranca.`);
  }

  const result = await createAccountDeletionRequest();

  return fromPrivacyResult(result, "account_deletion_request");
}

export async function persistPreparedBetaFeedbackAction(
  payload: PersistableBetaFeedback
): Promise<PersistBetaFeedbackActionResult> {
  const result = await persistBetaFeedback(
    {
      blocked: payload.blocked,
      clarityScore: payload.clarityScore,
      comment: payload.comment ?? "",
      confused: payload.confused,
      frictionScore: payload.frictionScore,
      module: payload.module,
      usefulnessScore: payload.usefulnessScore,
      worked: payload.worked
    },
    payload.noticeAccepted
  );

  return {
    message: result.message,
    mode: result.mode === "supabase" ? "supabase" : "local-draft",
    ok: result.ok
  };
}
