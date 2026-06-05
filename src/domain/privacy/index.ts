import type {
  AccountDeletionDecision,
  AccountDeletionRequestDraft,
  AccountDeletionValidationResult,
  AiProviderPreference,
  AiTonePreference,
  ChristianLayerIntensity,
  ExportablePrivacyDocument,
  OperationalRetentionPruneInput,
  OperationalRetentionRecord,
  PrivacyConsentDefinition,
  PrivacyConsentState,
  PrivacyConsentType,
  PrivacyConsentVersion,
  PrivacyExportDocument,
  PrivacyExportInput,
  PrivacyRetentionPolicy,
  SettingsSnapshot,
  UserSettingsPreferences
} from "./types";

export * from "./types";

export const PRIVACY_RETENTION_DAYS = 90;
export const ACCOUNT_DELETION_CONFIRMATION = "EXCLUIR MINHA CONTA";
export const ACCOUNT_DELETION_CONFIRMATION_TEXT = ACCOUNT_DELETION_CONFIRMATION;

export const privacyConsentDefinitions = {
  ai_provider_openai: {
    label: "OpenAI",
    purpose:
      "Permitir chamadas server-side ao provider OpenAI somente quando IA real estiver habilitada.",
    type: "ai_provider_openai",
    version: "ai_provider_openai_v1"
  },
  ai_provider_deepseek: {
    label: "DeepSeek",
    purpose:
      "Permitir chamadas server-side ao provider DeepSeek somente quando IA real estiver habilitada.",
    type: "ai_provider_deepseek",
    version: "ai_provider_deepseek_v1"
  },
  product_analytics: {
    label: "Analytics first-party",
    purpose: "Medir uso do produto com eventos allowlisted e sem conteudo sensivel.",
    type: "product_analytics",
    version: "product_analytics_v1"
  },
  beta_feedback: {
    label: "Feedback beta",
    purpose: "Salvar feedback explicito do beta por 90 dias, sem enviar a terceiros.",
    type: "beta_feedback",
    version: "beta_feedback_v1"
  }
} satisfies Record<PrivacyConsentType, PrivacyConsentDefinition>;

export const defaultSettingsPreferences: UserSettingsPreferences = {
  aiProviderPreference: "automatic",
  aiTone: "encouraging",
  analyticsOptIn: false,
  christianLayerIntensity: "balanced",
  lowEnergyMode: false
};

const preferenceOptions = {
  aiProviderPreference: new Set<AiProviderPreference>(["automatic", "openai", "deepseek"]),
  aiTone: new Set<AiTonePreference>(["encouraging", "direct", "gentle", "structured"]),
  christianLayerIntensity: new Set<ChristianLayerIntensity>(["off", "light", "balanced", "strong"])
};

const sensitiveExportKeys = [
  "accesstoken",
  "apikey",
  "auditlog",
  "authorization",
  "authtoken",
  "cookie",
  "hash",
  "internal",
  "jwt",
  "password",
  "rawprompt",
  "rawresponse",
  "refreshtoken",
  "secret",
  "servicekey",
  "servicerole",
  "session",
  "stacktrace",
  "token",
  "traceback"
];

const sensitiveExportExactKeys = new Set(["log", "logs", "stack", "trace"]);

const privacyExportOwnerKeys = ["user_id", "userId", "owner_user_id", "ownerUserId"];

export const privacyRetentionPolicy = {
  days: PRIVACY_RETENTION_DAYS,
  targets: ["product_analytics_events", "beta_feedback_items", "ai_run_audits"]
} as const satisfies PrivacyRetentionPolicy;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeChoice<T extends string>(value: unknown, allowed: Set<T>, fallback: T): T {
  return typeof value === "string" && allowed.has(value as T) ? (value as T) : fallback;
}

function normalizeBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function isSensitiveExportKey(key: string) {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");

  return (
    sensitiveExportExactKeys.has(normalized) ||
    sensitiveExportKeys.some((fragment) => normalized.includes(fragment))
  );
}

function isSensitiveExportValue(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();

  return (
    /^sk-[a-z0-9_-]{10,}$/i.test(trimmed) ||
    /^eyJ[a-z0-9_-]+\.[a-z0-9_-]+/i.test(trimmed) ||
    /\b(openai_api_key|deepseek_api_key|resend_api_key|supabase_service_role_key)\b/i.test(
      trimmed
    ) ||
    /\bservice[_-]?role\b/i.test(trimmed)
  );
}

function getRecordOwnerId(record: Record<string, unknown>) {
  for (const key of privacyExportOwnerKeys) {
    const value = record[key];

    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return null;
}

function sanitizeExportValue(value: unknown): { omittedCount: number; value: unknown } {
  if (Array.isArray(value)) {
    let omittedCount = 0;
    const safeItems: unknown[] = [];

    for (const item of value) {
      const sanitized = sanitizeExportValue(item);
      omittedCount += sanitized.omittedCount;

      if (sanitized.value !== undefined) {
        safeItems.push(sanitized.value);
      }
    }

    return { omittedCount, value: safeItems };
  }

  if (isSensitiveExportValue(value)) {
    return { omittedCount: 1, value: undefined };
  }

  if (!isRecord(value)) {
    return { omittedCount: 0, value };
  }

  let omittedCount = 0;
  const safeRecord: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    if (isSensitiveExportKey(key) || isSensitiveExportValue(nestedValue)) {
      omittedCount += 1;
      continue;
    }

    const sanitized = sanitizeExportValue(nestedValue);
    omittedCount += sanitized.omittedCount;

    if (sanitized.value !== undefined) {
      safeRecord[key] = sanitized.value;
    }
  }

  return { omittedCount, value: safeRecord };
}

function parseIsoDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function getRetentionRecordDate(record: OperationalRetentionRecord) {
  return (
    parseIsoDate(record.expires_at) ??
    parseIsoDate(record.created_at) ??
    parseIsoDate(record.occurred_at) ??
    parseIsoDate(record.timestamp)
  );
}

function isRetentionTarget(table: string) {
  return privacyRetentionPolicy.targets.some((target) => target === table);
}

function buildConsentRevocationScopes(): PrivacyConsentVersion[] {
  return Object.values(privacyConsentDefinitions).map((definition) => definition.version);
}

export function buildConsentState(
  definition: PrivacyConsentDefinition,
  record?: { acceptedAt?: string | null; revokedAt?: string | null; version?: string | null }
): PrivacyConsentState {
  if (!record || record.version !== definition.version || !record.acceptedAt) {
    return {
      ...definition,
      acceptedAt: null,
      revokedAt: null,
      status: "missing"
    };
  }

  return {
    ...definition,
    acceptedAt: record.acceptedAt,
    revokedAt: record.revokedAt ?? null,
    status: record.revokedAt ? "revoked" : "granted"
  };
}

export function hasActiveConsent(state: PrivacyConsentState) {
  return state.status === "granted" && state.acceptedAt !== null && state.revokedAt === null;
}

export function normalizeSettingsPreferences(
  input: Partial<Record<keyof UserSettingsPreferences, unknown>>
) {
  return {
    aiProviderPreference: normalizeChoice(
      input.aiProviderPreference,
      preferenceOptions.aiProviderPreference,
      defaultSettingsPreferences.aiProviderPreference
    ),
    aiTone: normalizeChoice(
      input.aiTone,
      preferenceOptions.aiTone,
      defaultSettingsPreferences.aiTone
    ),
    analyticsOptIn: normalizeBoolean(
      input.analyticsOptIn,
      defaultSettingsPreferences.analyticsOptIn
    ),
    christianLayerIntensity: normalizeChoice(
      input.christianLayerIntensity,
      preferenceOptions.christianLayerIntensity,
      defaultSettingsPreferences.christianLayerIntensity
    ),
    lowEnergyMode: normalizeBoolean(input.lowEnergyMode, defaultSettingsPreferences.lowEnergyMode)
  } satisfies UserSettingsPreferences;
}

export function buildLocalDemoSettingsSnapshot(): SettingsSnapshot {
  const consents = Object.fromEntries(
    Object.values(privacyConsentDefinitions).map((definition) => [
      definition.type,
      buildConsentState(definition)
    ])
  ) as SettingsSnapshot["consents"];

  return {
    consents,
    email: null,
    isAuthenticated: false,
    mode: "local-demo",
    preferences: defaultSettingsPreferences,
    runtime: {
      aiRealEnabled: false,
      analyticsRealEnabled: false,
      feedbackRealEnabled: false,
      runtimeMode: "local-demo"
    },
    statusMessage: "Modo local-demo: controles renderizam sem persistir dados reais.",
    userId: null
  };
}

export function redactForUserExport(value: unknown): unknown {
  return sanitizeExportValue(value).value;
}

export function buildUserDataExport(
  input: Omit<ExportablePrivacyDocument, "generatedAt" | "schemaVersion">
) {
  return redactForUserExport({
    ...input,
    generatedAt: new Date().toISOString(),
    schemaVersion: "user_data_export_v1"
  }) as ExportablePrivacyDocument;
}

export function buildPrivacyExport(input: PrivacyExportInput): PrivacyExportDocument {
  let omittedFieldCount = 0;
  let omittedRecordCount = 0;
  const data: PrivacyExportDocument["data"] = {};

  for (const section of input.sections) {
    const records: Array<Record<string, unknown>> = [];

    for (const record of section.records) {
      const ownerId = getRecordOwnerId(record);

      if (ownerId !== null && ownerId !== input.ownerUserId) {
        omittedRecordCount += 1;
        continue;
      }

      const sanitized = sanitizeExportValue(record);
      omittedFieldCount += sanitized.omittedCount;

      if (isRecord(sanitized.value)) {
        records.push(sanitized.value);
      }
    }

    data[section.name] = records;
  }

  return {
    schema_version: "privacy_export_v1",
    owner_user_id: input.ownerUserId,
    generated_at: input.generatedAt ?? new Date().toISOString(),
    data,
    omitted_field_count: omittedFieldCount,
    omitted_record_count: omittedRecordCount
  };
}

export function validateAccountDeletionConfirmation(
  value: string
): AccountDeletionValidationResult {
  if (value.trim() !== ACCOUNT_DELETION_CONFIRMATION) {
    return {
      message: `Digite exatamente "${ACCOUNT_DELETION_CONFIRMATION}" para registrar a solicitacao.`,
      ok: false
    };
  }

  return {
    confirmationPhrase: ACCOUNT_DELETION_CONFIRMATION,
    ok: true
  };
}

export function buildAccountDeletionDecision(input: {
  ownerUserId: string;
  requestedAt?: string;
  confirmationText: string;
  adminDeletionAvailable: boolean;
  adminDeletionIsolated: boolean;
  reason?: string;
}): AccountDeletionDecision {
  const confirmation = validateAccountDeletionConfirmation(input.confirmationText);

  if (!confirmation.ok) {
    return {
      ok: false,
      mode: "blocked",
      reason: "missing_explicit_confirmation",
      message: confirmation.message,
      request: null
    };
  }

  const adminDeletionAllowed = input.adminDeletionAvailable && input.adminDeletionIsolated;
  const request: AccountDeletionRequestDraft = {
    user_id: input.ownerUserId,
    status: adminDeletionAllowed ? "pending_admin_deletion" : "pending_manual_review",
    requested_at: input.requestedAt ?? new Date().toISOString(),
    reason: input.reason?.trim() || null,
    admin_deletion_allowed: adminDeletionAllowed,
    revoke_consent_scopes: buildConsentRevocationScopes(),
    processing_restriction: "block_nonessential_processing"
  };

  return {
    ok: true,
    mode: adminDeletionAllowed ? "admin-delete-eligible" : "safe-request",
    message: adminDeletionAllowed
      ? "Confirmacao registrada. A exclusao completa exige execucao server-side isolada e auditoria minima."
      : "Confirmacao registrada como solicitacao segura. A conta deve ser revisada antes de qualquer remocao completa.",
    request
  };
}

export function calculateRetentionExpiry(
  createdAt: string,
  retentionDays = PRIVACY_RETENTION_DAYS
) {
  const parsed = new Date(createdAt);
  const baseTime = Number.isFinite(parsed.getTime()) ? parsed.getTime() : Date.now();

  return new Date(baseTime + retentionDays * 24 * 60 * 60 * 1000).toISOString();
}

export function isExpiredForRetention(expiresAt: string, now = new Date().toISOString()) {
  return new Date(expiresAt).getTime() <= new Date(now).getTime();
}

export function planOperationalRetentionPrune(input: OperationalRetentionPruneInput) {
  const now = parseIsoDate(input.now) ?? new Date();
  const cutoffDate = new Date(now.getTime() - privacyRetentionPolicy.days * 24 * 60 * 60 * 1000);
  const plan = input.records.reduce(
    (result, record) => {
      if (!isRetentionTarget(record.table)) {
        result.keep.push(record);
        return result;
      }

      const recordDate = getRetentionRecordDate(record);

      if (!recordDate) {
        result.keep.push(record);
        return result;
      }

      const hasExplicitExpiry = Boolean(record.expires_at);
      const expired = hasExplicitExpiry
        ? recordDate.getTime() <= now.getTime()
        : recordDate.getTime() <= cutoffDate.getTime();

      if (expired) {
        result.delete.push(record);
      } else {
        result.keep.push(record);
      }

      return result;
    },
    {
      delete: [] as OperationalRetentionRecord[],
      keep: [] as OperationalRetentionRecord[]
    }
  );

  return {
    policy: privacyRetentionPolicy,
    cutoff: cutoffDate.toISOString(),
    ...plan
  };
}

export function consentTypeForVersion(version: PrivacyConsentVersion): PrivacyConsentType {
  const entry = Object.values(privacyConsentDefinitions).find(
    (definition) => definition.version === version
  );

  if (!entry) {
    throw new Error("Unknown consent version.");
  }

  return entry.type;
}
