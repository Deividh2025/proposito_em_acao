export type PrivacyActionMode = "local-demo" | "supabase";

export type AiProviderPreference = "automatic" | "openai" | "deepseek";
export type AiTonePreference = "encouraging" | "direct" | "gentle" | "structured";
export type ChristianLayerIntensity = "off" | "light" | "balanced" | "strong";

export type ConsentStatus = "granted" | "revoked" | "missing";

export type PrivacyConsentType =
  | "ai_provider_openai"
  | "ai_provider_deepseek"
  | "product_analytics"
  | "beta_feedback";

export type PrivacyConsentVersion =
  | "ai_provider_openai_v1"
  | "ai_provider_deepseek_v1"
  | "product_analytics_v1"
  | "beta_feedback_v1";

export type PrivacyConsentDefinition = {
  type: PrivacyConsentType;
  version: PrivacyConsentVersion;
  label: string;
  purpose: string;
};

export type PrivacyConsentState = PrivacyConsentDefinition & {
  acceptedAt: string | null;
  revokedAt: string | null;
  status: ConsentStatus;
};

export type UserSettingsPreferences = {
  aiProviderPreference: AiProviderPreference;
  aiTone: AiTonePreference;
  analyticsOptIn: boolean;
  christianLayerIntensity: ChristianLayerIntensity;
  lowEnergyMode: boolean;
};

export type SettingsRuntimeSummary = {
  analyticsRealEnabled: boolean;
  feedbackRealEnabled: boolean;
  aiRealEnabled: boolean;
  runtimeMode: string;
};

export type SettingsSnapshot = {
  consents: Record<PrivacyConsentType, PrivacyConsentState>;
  email: string | null;
  isAuthenticated: boolean;
  mode: PrivacyActionMode;
  preferences: UserSettingsPreferences;
  runtime: SettingsRuntimeSummary;
  statusMessage: string;
  userId: string | null;
};

export type ExportablePrivacyDocument = {
  generatedAt: string;
  schemaVersion: "user_data_export_v1";
  userId: string;
  profile: Record<string, unknown> | null;
  preferences: Record<string, unknown> | null;
  consents: Array<Record<string, unknown>>;
  modules: Record<string, Array<Record<string, unknown>>>;
  feedback: Array<Record<string, unknown>>;
  accountability: Record<string, Array<Record<string, unknown>>>;
};

export type PrivacyExportSectionInput = {
  name: string;
  records: Array<Record<string, unknown>>;
};

export type PrivacyExportInput = {
  ownerUserId: string;
  generatedAt?: string;
  sections: PrivacyExportSectionInput[];
};

export type PrivacyExportDocument = {
  schema_version: "privacy_export_v1";
  owner_user_id: string;
  generated_at: string;
  data: Record<string, Array<Record<string, unknown>>>;
  omitted_field_count: number;
  omitted_record_count: number;
};

export type AccountDeletionValidationResult =
  | {
      ok: true;
      confirmationPhrase: string;
    }
  | {
      ok: false;
      message: string;
    };

export type AccountDeletionRequestStatus = "pending_manual_review" | "pending_admin_deletion";

export type AccountDeletionRequestDraft = {
  user_id: string;
  status: AccountDeletionRequestStatus;
  requested_at: string;
  reason: string | null;
  admin_deletion_allowed: boolean;
  revoke_consent_scopes: PrivacyConsentVersion[];
  processing_restriction: "block_nonessential_processing";
};

export type AccountDeletionDecision =
  | {
      ok: false;
      mode: "blocked";
      reason: "missing_explicit_confirmation";
      message: string;
      request: null;
    }
  | {
      ok: true;
      mode: "safe-request" | "admin-delete-eligible";
      message: string;
      request: AccountDeletionRequestDraft;
    };

export type OperationalRetentionTarget =
  | "product_analytics_events"
  | "beta_feedback_items"
  | "ai_run_audits";

export type PrivacyRetentionPolicy = {
  days: 90;
  targets: readonly OperationalRetentionTarget[];
};

export type OperationalRetentionRecord = {
  id: string;
  table: string;
  created_at?: string | null;
  occurred_at?: string | null;
  timestamp?: string | null;
  expires_at?: string | null;
};

export type OperationalRetentionPruneInput = {
  now?: string;
  records: OperationalRetentionRecord[];
};

export type OperationalRetentionPrunePlan = {
  policy: PrivacyRetentionPolicy;
  cutoff: string;
  delete: OperationalRetentionRecord[];
  keep: OperationalRetentionRecord[];
};
