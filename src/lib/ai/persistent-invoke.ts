import "server-only";

import type { AiRunAudit } from "@/ai/schemas";
import { redactAiAuditMetadata } from "@/lib/ai/redaction";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasEssentialSupabaseConfig } from "@/lib/supabase/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AiProviderPreference, SafeInvokeAiResult } from "@/lib/openai";
import type { Json } from "@/types/database";

import {
  invokeAiWithSafeRouting,
  type InvokeAiWithSafeRoutingInput
} from "./invoke";
import type { AiProviderConsentRecord } from "./routing";

type ConsentRecordRow = {
  accepted_at?: unknown;
  consent_type?: unknown;
  revoked_at?: unknown;
  version?: unknown;
};

type PreferenceRow = {
  ai_provider_preference?: unknown;
};

export type AiAuditPersistenceResult =
  | { ok: true; mode: "persisted" | "not_required" }
  | { ok: false; mode: "blocked"; reason: "missing_session" | "missing_supabase_config" | "missing_service_role" | "audit_insert_failed" };

export type PersistentAiResult<TOutput> = SafeInvokeAiResult<TOutput> & {
  auditPersistence: AiAuditPersistenceResult;
};

export async function invokeAiWithPersistentConsentAndAudit<TOutput>(
  input: InvokeAiWithSafeRoutingInput<TOutput>
): Promise<PersistentAiResult<TOutput>> {
  const context = await loadAiRuntimeContext();
  const auditCanPersist = context.userId ? canCreateAdminClient() : false;
  const consentRecords = auditCanPersist ? context.consentRecords : [];
  const result = await invokeAiWithSafeRouting({
    ...input,
    consentRecords: input.consentRecords ?? consentRecords,
    preference: input.preference ?? context.preference,
    realEnabled: context.userId && !auditCanPersist ? false : input.realEnabled
  });

  if (!context.userId) {
    return {
      ...result,
      auditPersistence: {
        mode: "blocked",
        ok: false,
        reason: context.reason
      }
    };
  }

  if (!auditCanPersist) {
    return {
      ...result,
      auditPersistence: {
        mode: "blocked",
        ok: false,
        reason: "missing_service_role"
      }
    };
  }

  const auditPersistence = await persistAiRunAudit({
    audit: result.audit,
    userId: context.userId
  });

  return {
    ...result,
    auditPersistence
  };
}

export async function persistAiRunAudit({
  audit,
  userId
}: {
  audit: AiRunAudit;
  userId: string;
}): Promise<AiAuditPersistenceResult> {
  let admin: ReturnType<typeof createSupabaseAdminClient>;

  try {
    admin = createSupabaseAdminClient();
  } catch {
    return {
      mode: "blocked",
      ok: false,
      reason: "missing_service_role"
    };
  }

  const { error } = await admin.from("ai_run_audits").insert({
    agent_name: audit.agent_key,
    error_code: audit.error_category === "none" ? null : audit.error_category,
    guardrail_status: audit.guardrail_status,
    latency_ms: Math.round(audit.latency_ms),
    metadata_minimal: redactAiAuditMetadata({
      blocked_behaviors: audit.blocked_behaviors,
      consent_version: audit.consent_version,
      contains_raw_prompt: audit.contains_raw_prompt,
      contains_raw_response: audit.contains_raw_response,
      fallback_reason: audit.fallback_reason,
      invocation_mode: audit.invocation_mode,
      model: audit.model,
      output_schema: audit.output_schema,
      prompt_version: audit.prompt_version,
      provider: audit.provider,
      timestamp: audit.timestamp
    }) as Json,
    schema_name: audit.output_schema,
    schema_version: audit.schema_version,
    status: audit.status,
    user_id: userId
  });

  if (error) {
    return {
      mode: "blocked",
      ok: false,
      reason: "audit_insert_failed"
    };
  }

  return {
    mode: "persisted",
    ok: true
  };
}

async function loadAiRuntimeContext(): Promise<{
  consentRecords: AiProviderConsentRecord[];
  preference?: AiProviderPreference;
  reason: "missing_session" | "missing_supabase_config";
  userId: string | null;
}> {
  if (!hasEssentialSupabaseConfig()) {
    return {
      consentRecords: [],
      reason: "missing_supabase_config",
      userId: null
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      consentRecords: [],
      reason: "missing_session",
      userId: null
    };
  }

  const [{ data: preferences }, { data: consentRows }] = await Promise.all([
    supabase
      .from("user_preferences")
      .select("ai_provider_preference")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("consent_records")
      .select("consent_type,version,accepted_at,revoked_at")
      .eq("user_id", user.id)
      .in("consent_type", ["ai_provider_openai", "ai_provider_deepseek"])
  ]);

  return {
    consentRecords: mapAiConsentRows(consentRows),
    preference: parseProviderPreference((preferences as PreferenceRow | null)?.ai_provider_preference),
    reason: "missing_session",
    userId: user.id
  };
}

function mapAiConsentRows(rows: unknown): AiProviderConsentRecord[] {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.flatMap((row) => {
    const record = row as ConsentRecordRow;
    const provider = record.consent_type === "ai_provider_openai"
      ? "openai"
      : record.consent_type === "ai_provider_deepseek"
        ? "deepseek"
        : null;

    if (!provider || typeof record.version !== "string") {
      return [];
    }

    return [
      {
        acceptedAt: typeof record.accepted_at === "string" ? record.accepted_at : null,
        provider,
        revokedAt: typeof record.revoked_at === "string" ? record.revoked_at : null,
        version: record.version
      }
    ];
  });
}

function parseProviderPreference(value: unknown): AiProviderPreference | undefined {
  return value === "automatic" || value === "openai" || value === "deepseek" ? value : undefined;
}

function canCreateAdminClient() {
  try {
    createSupabaseAdminClient();
    return true;
  } catch {
    return false;
  }
}
