import "server-only";

import type { User } from "@supabase/supabase-js";

import {
  buildConsentState,
  buildLocalDemoSettingsSnapshot,
  buildUserDataExport,
  calculateRetentionExpiry,
  consentTypeForVersion,
  defaultSettingsPreferences,
  hasActiveConsent,
  normalizeSettingsPreferences,
  privacyConsentDefinitions,
  type ExportablePrivacyDocument,
  type PrivacyConsentState,
  type PrivacyConsentType,
  type PrivacyConsentVersion,
  type SettingsSnapshot,
  type UserSettingsPreferences
} from "@/domain/privacy";
import { prepareAnalyticsEventForPersistence } from "@/domain/analytics";
import { prepareBetaFeedbackForPersistence, type BetaFeedbackInput } from "@/domain/feedback";
import {
  formatMissingEnvVars,
  getAppRuntimeMode,
  getRealIntegrationFlags,
  getRuntimeEnvironmentStatus,
  getServerEnv
} from "@/lib/config";
import { hasEssentialSupabaseConfig } from "@/lib/supabase/guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

type ConsentRecordRow = {
  accepted_at?: unknown;
  consent_type?: unknown;
  revoked_at?: unknown;
  version?: unknown;
};

type ProfilePreferencesRow = {
  ai_tone?: unknown;
  christian_layer_intensity?: unknown;
  email?: unknown;
};

type UserPreferencesRow = {
  ai_provider_preference?: unknown;
  analytics_opt_in?: unknown;
  low_energy_mode?: unknown;
};

type AnalyticsRecordInput = {
  name: string;
  metadata?: Record<string, unknown>;
};

type PrivacyActionResult = {
  ok: boolean;
  message: string;
  mode: "local-demo" | "supabase";
  reason?: string;
};

const moduleExportTables = [
  "life_areas",
  "life_map_assessments",
  "life_map_area_scores",
  "callings",
  "calling_session_entries",
  "goals",
  "projects",
  "tasks",
  "microtasks",
  "calendar_blocks",
  "inbox_items",
  "focus_sessions",
  "focus_distractions",
  "habits",
  "habit_logs",
  "scoreboard_entries",
  "metacognition_sessions",
  "action_unblock_sessions",
  "weekly_reviews",
  "garden_states",
  "garden_events",
  "product_analytics_events"
] as const;

const accountabilityExportTables = [
  "accountability_partners",
  "accountability_grants",
  "accountability_events",
  "accountability_notifications",
  "commitment_documents",
  "commitment_levers"
] as const;

function stringOrNull(value: unknown) {
  return typeof value === "string" ? value : null;
}

function latestConsentState(records: ConsentRecordRow[], type: PrivacyConsentType): PrivacyConsentState {
  const definition = privacyConsentDefinitions[type];
  const matchingRecords = records
    .filter(
      (record) =>
        record.consent_type === definition.type &&
        record.version === definition.version &&
        typeof record.accepted_at === "string"
    )
    .sort((a, b) => String(b.accepted_at).localeCompare(String(a.accepted_at)));
  const latest = matchingRecords[0];

  return buildConsentState(definition, {
    acceptedAt: stringOrNull(latest?.accepted_at),
    revokedAt: stringOrNull(latest?.revoked_at),
    version: stringOrNull(latest?.version)
  });
}

function mapConsentStates(records: ConsentRecordRow[]): SettingsSnapshot["consents"] {
  return Object.fromEntries(
    Object.keys(privacyConsentDefinitions).map((type) => [
      type,
      latestConsentState(records, type as PrivacyConsentType)
    ])
  ) as SettingsSnapshot["consents"];
}

function normalizeSnapshotPreferences(profile: ProfilePreferencesRow | null, preferences: UserPreferencesRow | null) {
  return normalizeSettingsPreferences({
    aiProviderPreference: preferences?.ai_provider_preference,
    aiTone: profile?.ai_tone,
    analyticsOptIn: preferences?.analytics_opt_in,
    christianLayerIntensity: profile?.christian_layer_intensity,
    lowEnergyMode: preferences?.low_energy_mode
  });
}

async function getAuthenticatedUser(supabase: TypedSupabaseClient) {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

function localDemoResult(message: string): PrivacyActionResult {
  return {
    message,
    mode: "local-demo",
    ok: true
  };
}

function blockedResult(message: string, reason: string): PrivacyActionResult {
  return {
    message,
    mode: "supabase",
    ok: false,
    reason
  };
}

function buildBlockedSettingsSnapshot(message: string): SettingsSnapshot {
  const env = getServerEnv();
  const flags = getRealIntegrationFlags();

  return {
    ...buildLocalDemoSettingsSnapshot(),
    isAuthenticated: false,
    mode: "supabase",
    runtime: {
      aiRealEnabled: flags.ai,
      analyticsRealEnabled: flags.analytics,
      feedbackRealEnabled: flags.feedback,
      runtimeMode: env.APP_RUNTIME_MODE
    },
    statusMessage: message
  };
}

function createAdminClientOrNull() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

async function ensureAuthenticatedSupabase() {
  if (!hasEssentialSupabaseConfig()) {
    if (getAppRuntimeMode() === "local-demo") {
      return { mode: "local-demo" as const, supabase: null, user: null };
    }

    return { blockedReason: "missing_config" as const, mode: "supabase" as const, supabase: null, user: null };
  }

  const supabase = await createSupabaseServerClient();
  const user = await getAuthenticatedUser(supabase);

  if (!user) {
    return { mode: "supabase" as const, supabase, user: null };
  }

  return { mode: "supabase" as const, supabase, user };
}

async function fetchConsentRecords(supabase: TypedSupabaseClient, user: User) {
  const { data, error } = await supabase
    .from("consent_records")
    .select("consent_type,version,accepted_at,revoked_at")
    .eq("user_id", user.id);

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data as ConsentRecordRow[];
}

export async function loadSettingsSnapshot(): Promise<SettingsSnapshot> {
  if (!hasEssentialSupabaseConfig()) {
    if (getAppRuntimeMode() === "local-demo") {
      return buildLocalDemoSettingsSnapshot();
    }

    const status = getRuntimeEnvironmentStatus();

    return buildBlockedSettingsSnapshot(
      `Configuracoes reais indisponiveis neste ambiente. Variaveis ausentes: ${formatMissingEnvVars(status.supabase.missing)}.`
    );
  }

  const supabase = await createSupabaseServerClient();
  const user = await getAuthenticatedUser(supabase);
  const env = getServerEnv();
  const flags = getRealIntegrationFlags();

  if (!user) {
    return {
      ...buildLocalDemoSettingsSnapshot(),
      isAuthenticated: false,
      mode: "supabase",
      runtime: {
        aiRealEnabled: flags.ai,
        analyticsRealEnabled: flags.analytics,
        feedbackRealEnabled: flags.feedback,
        runtimeMode: env.APP_RUNTIME_MODE
      },
      statusMessage: "Entre na sua conta para salvar configuracoes e consentimentos."
    };
  }

  const [{ data: profile }, { data: preferences }, consentRecords] = await Promise.all([
    supabase
      .from("profiles")
      .select("email,ai_tone,christian_layer_intensity")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("user_preferences")
      .select("ai_provider_preference,analytics_opt_in,low_energy_mode")
      .eq("user_id", user.id)
      .maybeSingle(),
    fetchConsentRecords(supabase, user)
  ]);
  const consents = mapConsentStates(consentRecords);

  return {
    consents,
    email: stringOrNull((profile as ProfilePreferencesRow | null)?.email) ?? user.email ?? null,
    isAuthenticated: true,
    mode: "supabase",
    preferences: normalizeSnapshotPreferences(profile as ProfilePreferencesRow | null, preferences as UserPreferencesRow | null),
    runtime: {
      aiRealEnabled: flags.ai,
      analyticsRealEnabled: flags.analytics,
      feedbackRealEnabled: flags.feedback,
      runtimeMode: env.APP_RUNTIME_MODE
    },
    statusMessage: "Configuracoes carregadas da sessao autenticada.",
    userId: user.id
  };
}

export async function saveUserSettings(preferences: UserSettingsPreferences): Promise<PrivacyActionResult> {
  const auth = await ensureAuthenticatedSupabase();

  if (auth.mode === "local-demo") {
    return localDemoResult("Modo local-demo: preferencias validadas sem persistencia real.");
  }

  if (!auth.supabase) {
    return blockedResult("Supabase/Auth nao esta configurado para salvar configuracoes reais.", "missing_config");
  }

  if (!auth.user) {
    return blockedResult("Entre na sua conta para salvar configuracoes.", "missing_session");
  }

  const normalized = normalizeSettingsPreferences(preferences);
  const [{ error: profileError }, { error: preferencesError }] = await Promise.all([
    auth.supabase
      .from("profiles")
      .update({
        ai_tone: normalized.aiTone,
        christian_layer_intensity: normalized.christianLayerIntensity
      })
      .eq("id", auth.user.id),
    auth.supabase
      .from("user_preferences")
      .upsert({
        ai_provider_preference: normalized.aiProviderPreference,
        analytics_opt_in: normalized.analyticsOptIn,
        low_energy_mode: normalized.lowEnergyMode,
        user_id: auth.user.id
      }, { onConflict: "user_id" })
  ]);

  if (profileError || preferencesError) {
    return blockedResult("Nao foi possivel salvar configuracoes agora.", "persistence_failed");
  }

  return {
    message: "Configuracoes salvas.",
    mode: "supabase",
    ok: true
  };
}

export async function grantPrivacyConsent(type: PrivacyConsentType): Promise<PrivacyActionResult> {
  const auth = await ensureAuthenticatedSupabase();

  if (auth.mode === "local-demo") {
    return localDemoResult("Modo local-demo: consentimento revisado sem persistencia real.");
  }

  if (!auth.supabase) {
    return blockedResult("Supabase/Auth nao esta configurado para registrar consentimento real.", "missing_config");
  }

  if (!auth.user) {
    return blockedResult("Entre na sua conta para registrar consentimento.", "missing_session");
  }

  const definition = privacyConsentDefinitions[type];
  const admin = createAdminClientOrNull();

  if (!admin) {
    return blockedResult("Consentimento exige service role server-side configurada.", "missing_service_role");
  }

  const now = new Date().toISOString();
  const { error: revokeError } = await admin
    .from("consent_records")
    .update({ revoked_at: now })
    .eq("user_id", auth.user.id)
    .eq("consent_type", definition.type)
    .is("revoked_at", null);

  if (revokeError) {
    return blockedResult("Nao foi possivel encerrar consentimentos anteriores.", "consent_revoke_failed");
  }

  const { error } = await admin.from("consent_records").insert({
    accepted_at: now,
    consent_type: definition.type,
    metadata: {
      purpose: definition.purpose,
      retention_days: type === "product_analytics" || type === "beta_feedback" ? 90 : null
    },
    scope: type.startsWith("ai_provider") ? "ai_provider" : "product",
    user_id: auth.user.id,
    version: definition.version
  });

  if (error) {
    return blockedResult("Nao foi possivel registrar consentimento agora.", "consent_insert_failed");
  }

  return {
    message: "Consentimento registrado.",
    mode: "supabase",
    ok: true
  };
}

export async function revokePrivacyConsent(type: PrivacyConsentType): Promise<PrivacyActionResult> {
  const auth = await ensureAuthenticatedSupabase();

  if (auth.mode === "local-demo") {
    return localDemoResult("Modo local-demo: revogacao revisada sem persistencia real.");
  }

  if (!auth.supabase) {
    return blockedResult("Supabase/Auth nao esta configurado para revogar consentimento real.", "missing_config");
  }

  if (!auth.user) {
    return blockedResult("Entre na sua conta para revogar consentimento.", "missing_session");
  }

  const definition = privacyConsentDefinitions[type];
  const revokedAt = new Date().toISOString();
  const admin = createAdminClientOrNull();

  if (!admin) {
    return blockedResult("Revogacao exige service role server-side configurada.", "missing_service_role");
  }

  const { error } = await admin
    .from("consent_records")
    .update({ revoked_at: revokedAt })
    .eq("user_id", auth.user.id)
    .eq("consent_type", definition.type)
    .eq("version", definition.version)
    .is("revoked_at", null);

  if (error) {
    return blockedResult("Nao foi possivel revogar consentimento agora.", "consent_revoke_failed");
  }

  return {
    message: "Consentimento revogado.",
    mode: "supabase",
    ok: true
  };
}

export async function persistProductAnalyticsEvent(input: AnalyticsRecordInput): Promise<PrivacyActionResult> {
  const auth = await ensureAuthenticatedSupabase();
  const flags = getRealIntegrationFlags();

  if (auth.mode === "local-demo" || !flags.analytics) {
    return localDemoResult("Analytics real esta desligado; nenhum evento foi persistido.");
  }

  if (!auth.supabase) {
    return blockedResult("Supabase/Auth nao esta configurado para persistir analytics real.", "missing_config");
  }

  if (!auth.user) {
    return blockedResult("Analytics bloqueado sem sessao autenticada.", "missing_session");
  }

  const snapshot = await loadSettingsSnapshot();
  const analyticsConsent = snapshot.consents.product_analytics;
  const prepared = prepareAnalyticsEventForPersistence({
    consentGranted: hasActiveConsent(analyticsConsent),
    consentRevoked: analyticsConsent.status === "revoked",
    consentVersion: analyticsConsent.version,
    metadata: input.metadata,
    name: input.name
  });

  if (!prepared.ok) {
    return blockedResult("Analytics bloqueado por consentimento, allowlist ou metadata insegura.", prepared.reason);
  }

  const admin = createAdminClientOrNull();

  if (!admin) {
    return blockedResult("Analytics exige service role server-side configurada.", "missing_service_role");
  }

  const { error } = await admin.from("product_analytics_events").insert({
    consent_version: prepared.event.consentVersion,
    event_name: prepared.event.name,
    expires_at: prepared.event.expiresAt,
    metadata: prepared.event.metadata,
    occurred_at: prepared.event.occurredAt,
    schema_version: prepared.event.schemaVersion,
    user_id: auth.user.id
  });

  if (error) {
    return blockedResult("Falha segura de analytics; fluxo principal nao deve ser interrompido.", "analytics_insert_failed");
  }

  return {
    message: "Evento de analytics registrado com minimizacao.",
    mode: "supabase",
    ok: true
  };
}

export async function persistBetaFeedback(input: BetaFeedbackInput, noticeAccepted: boolean): Promise<PrivacyActionResult> {
  const auth = await ensureAuthenticatedSupabase();
  const flags = getRealIntegrationFlags();

  if (auth.mode === "local-demo" || !flags.feedback) {
    return localDemoResult("Feedback real esta desligado; use o rascunho local/dev.");
  }

  if (!auth.supabase) {
    return blockedResult("Supabase/Auth nao esta configurado para persistir feedback real.", "missing_config");
  }

  if (!auth.user) {
    return blockedResult("Feedback bloqueado sem sessao autenticada.", "missing_session");
  }

  if (!noticeAccepted) {
    return blockedResult("Confirme o aviso de privacidade antes de enviar feedback beta.", "privacy_notice_required");
  }

  const snapshot = await loadSettingsSnapshot();
  const feedbackConsent = snapshot.consents.beta_feedback;
  const prepared = prepareBetaFeedbackForPersistence({
    consentGranted: hasActiveConsent(feedbackConsent),
    consentVersion: feedbackConsent.version,
    input,
    noticeAccepted
  });

  if (!prepared.ok) {
    return blockedResult(prepared.message, prepared.reason);
  }

  const admin = createAdminClientOrNull();

  if (!admin) {
    return blockedResult("Feedback beta exige service role server-side configurada.", "missing_service_role");
  }

  const { error } = await admin.from("beta_feedback_items").insert({
    blocked: prepared.feedback.blocked,
    clarity_score: prepared.feedback.clarityScore,
    comment: prepared.feedback.comment,
    confused: prepared.feedback.confused,
    consent_version: prepared.feedback.consentVersion,
    expires_at: prepared.feedback.expiresAt,
    friction_score: prepared.feedback.frictionScore,
    has_sensitive_hint: false,
    module: prepared.feedback.module,
    status: "submitted",
    usefulness_score: prepared.feedback.usefulnessScore,
    user_id: auth.user.id,
    worked: prepared.feedback.worked
  });

  if (error) {
    return blockedResult("Nao foi possivel salvar feedback beta agora.", "feedback_insert_failed");
  }

  return {
    message: prepared.message,
    mode: "supabase",
    ok: true
  };
}

async function selectOwnerRows(supabase: TypedSupabaseClient, table: string, userId: string) {
  const { data, error } = await supabase.from(table).select("*").eq("user_id", userId);

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data as Array<Record<string, unknown>>;
}

export async function buildAuthenticatedUserDataExport(): Promise<ExportablePrivacyDocument> {
  const auth = await ensureAuthenticatedSupabase();

  if (auth.mode === "local-demo") {
    return buildUserDataExport({
      accountability: {},
      consents: [],
      feedback: [],
      modules: {},
      preferences: defaultSettingsPreferences,
      profile: null,
      userId: "local-demo"
    });
  }

  if (!auth.supabase) {
    throw new Error("Supabase/Auth configuration is required for export.");
  }

  if (!auth.user) {
    throw new Error("Authenticated user is required for export.");
  }

  const [{ data: profile }, { data: preferences }, { data: consents }] = await Promise.all([
    auth.supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle(),
    auth.supabase.from("user_preferences").select("*").eq("user_id", auth.user.id).maybeSingle(),
    auth.supabase.from("consent_records").select("*").eq("user_id", auth.user.id)
  ]);
  const modules = Object.fromEntries(
    await Promise.all(
      moduleExportTables.map(async (table) => [table, await selectOwnerRows(auth.supabase!, table, auth.user!.id)])
    )
  ) as Record<string, Array<Record<string, unknown>>>;
  const accountability = Object.fromEntries(
    await Promise.all(
      accountabilityExportTables.map(async (table) => [
        table,
        await selectOwnerRows(auth.supabase!, table, auth.user!.id)
      ])
    )
  ) as Record<string, Array<Record<string, unknown>>>;

  return buildUserDataExport({
    accountability,
    consents: Array.isArray(consents) ? (consents as Array<Record<string, unknown>>) : [],
    feedback: await selectOwnerRows(auth.supabase, "beta_feedback_items", auth.user.id),
    modules,
    preferences: (preferences as Record<string, unknown> | null) ?? null,
    profile: (profile as Record<string, unknown> | null) ?? null,
    userId: auth.user.id
  });
}

export async function createAccountDeletionRequest(): Promise<PrivacyActionResult> {
  const auth = await ensureAuthenticatedSupabase();

  if (auth.mode === "local-demo") {
    return localDemoResult("Modo local-demo: solicitacao de exclusao validada sem persistencia real.");
  }

  if (!auth.supabase) {
    return blockedResult("Supabase/Auth nao esta configurado para solicitar exclusao real.", "missing_config");
  }

  if (!auth.user) {
    return blockedResult("Entre na sua conta para solicitar exclusao.", "missing_session");
  }

  const admin = createAdminClientOrNull();

  if (!admin) {
    return blockedResult("Solicitacao de exclusao exige service role server-side configurada.", "missing_service_role");
  }

  const requestedAt = new Date().toISOString();
  const { error: requestError } = await admin.from("account_deletion_requests").insert({
    confirmation_phrase_matched: true,
    requested_at: requestedAt,
    status: "pending_manual_review",
    user_id: auth.user.id
  });

  if (requestError) {
    return blockedResult("Nao foi possivel registrar solicitacao de exclusao agora.", "deletion_request_failed");
  }

  const [{ error: consentRevokeError }, { error: grantRevokeError }, { error: notificationCancelError }] =
    await Promise.all([
      admin
        .from("consent_records")
        .update({ revoked_at: requestedAt })
        .eq("user_id", auth.user.id)
        .is("revoked_at", null),
      admin
        .from("accountability_grants")
        .update({ revoked_at: requestedAt, revoked_reason: "account_deletion_requested", status: "revoked" })
        .eq("user_id", auth.user.id)
        .is("revoked_at", null),
      admin
        .from("accountability_notifications")
        .update({ blocked_reason: "account_deletion_requested", status: "cancelled" })
        .eq("user_id", auth.user.id)
        .in("status", ["draft", "previewed", "approved", "queued"])
    ]);

  if (consentRevokeError || grantRevokeError || notificationCancelError) {
    return blockedResult(
      "Solicitacao registrada, mas a revogacao operacional precisa de revisao segura.",
      "deletion_followup_failed"
    );
  }

  return {
    message: "Solicitacao de exclusao registrada. Remocao Auth/admin fica pendente de operacao segura aprovada.",
    mode: "supabase",
    ok: true
  };
}

export function buildRetentionTimestamps(createdAt = new Date().toISOString()) {
  return {
    createdAt,
    expiresAt: calculateRetentionExpiry(createdAt)
  };
}

export function consentVersionToType(version: PrivacyConsentVersion) {
  return consentTypeForVersion(version);
}
