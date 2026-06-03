"use server";

import { createHash } from "node:crypto";

import {
  ACCOUNTABILITY_PRIVATE_SCOPE_MESSAGE,
  accountabilityActionResultSchema,
  accountabilityLevelSchema,
  acceptAccountabilityInviteInputSchema,
  buildAccountabilityInviteDraft,
  buildAccountabilityMessagePreview,
  createAccountabilityInviteInputSchema,
  accountabilityNotificationFrequencySchema,
  accountabilityPermissionSchema,
  persistAccountabilityInviteInputSchema,
  prohibitedAccountabilityCategories,
  revokeAccountabilityGrantInputSchema,
  type AccountabilityActionResult,
  type BasicAccountabilityActionResult,
  type AccountabilityInviteDraft,
  type AccountabilityGrantPreview,
  type AccountabilityPermission,
  type CreateAccountabilityInviteInput
} from "@/domain/accountability";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import {
  missingSessionResult,
  noAffectedRowResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult,
  validationErrorResult
} from "@/domain/execution/action-results";
import { buildAccountabilityEmailTemplate } from "@/lib/email/templates/accountability";
import { createEmailProvider } from "@/lib/email/provider";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ACCOUNTABILITY_CONSENT_VERSION = "accountability_prompt13_v2";

type AccountabilityInvitePreviewResult = {
  canAccept: boolean;
  excludedPrivateCategories: string[];
  grant?: AccountabilityGrantPreview;
  message: string;
  mode: BasicAccountabilityActionResult["mode"];
  ok: boolean;
  requiresAuth: boolean;
};

type SupabaseAdminClient = ReturnType<typeof createSupabaseAdminClient>;

function errorDraft(message: string): BasicAccountabilityActionResult {
  return realServiceErrorResult(executionActionResultSchema, message);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function hashMetadataValue(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizeEmail(value: string | undefined | null) {
  return value?.trim().toLowerCase() ?? "";
}

function jsonString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function stableJson(value: unknown) {
  return JSON.stringify(value);
}

function previewMatchesApprovedPayload(parsed: CreateAccountabilityInviteInput & { preview: unknown }) {
  const expectedPreview = buildAccountabilityMessagePreview(parsed);

  return stableJson(parsed.preview) === stableJson(expectedPreview);
}

function isPrivateScopeError(error: unknown) {
  return error instanceof Error && error.message === ACCOUNTABILITY_PRIVATE_SCOPE_MESSAGE;
}

function permissionsFromGrant(value: unknown): AccountabilityPermission[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>)
    .filter(([, enabled]) => enabled === true)
    .map(([permission]) => permission)
    .filter((permission): permission is AccountabilityPermission => accountabilityPermissionSchema.safeParse(permission).success);
}

function invitePreviewResult(
  result: Omit<AccountabilityInvitePreviewResult, "excludedPrivateCategories">
): AccountabilityInvitePreviewResult {
  return {
    excludedPrivateCategories: [...prohibitedAccountabilityCategories],
    ...result
  };
}

async function compensateFailedInvite(
  admin: SupabaseAdminClient,
  input: { consentId?: string; failedAt: string; grantId?: string; partnerId?: string; userId: string }
) {
  let compensated = true;

  if (input.grantId) {
    const { error } = await admin
      .from("accountability_grants")
      .update({
        invite_token_hash: null,
        revoked_at: input.failedAt,
        revoked_reason: "invite_persistence_failed",
        status: "expired"
      })
      .eq("id", input.grantId)
      .eq("user_id", input.userId);
    compensated &&= !error;
  }

  if (input.partnerId) {
    const { error } = await admin
      .from("accountability_partners")
      .update({
        invite_token_hash: null,
        revoked_at: input.failedAt,
        status: "expired"
      })
      .eq("id", input.partnerId)
      .eq("user_id", input.userId);
    compensated &&= !error;
  }

  if (input.consentId) {
    const { error } = await admin
      .from("consent_records")
      .update({ revoked_at: input.failedAt })
      .eq("id", input.consentId)
      .eq("user_id", input.userId)
      .is("revoked_at", null);
    compensated &&= !error;
  }

  return compensated;
}

export async function generateAccountabilityInviteDraft(input: unknown): Promise<AccountabilityActionResult> {
  const inputResult = safeParseActionInput(createAccountabilityInviteInputSchema, input, accountabilityActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  let draft: AccountabilityInviteDraft;

  try {
    draft = buildAccountabilityInviteDraft(inputResult.data);
  } catch (error) {
    if (isPrivateScopeError(error)) {
      return validationErrorResult(accountabilityActionResultSchema, ACCOUNTABILITY_PRIVATE_SCOPE_MESSAGE);
    }

    return validationErrorResult(
      accountabilityActionResultSchema,
      "Nao foi possivel gerar uma previa segura para o Atalaia agora."
    );
  }

  return accountabilityActionResultSchema.parse({
    draft,
    mode: "local-draft",
    ok: true,
    preview: draft.preview,
    message: "Mock seguro gerou convite, permissoes e previa. Nenhum e-mail ou OpenAI real foi acionado."
  });
}

export async function persistAccountabilityInvite(input: unknown): Promise<BasicAccountabilityActionResult> {
  const inputResult = safeParseActionInput(persistAccountabilityInviteInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;
  let draft: AccountabilityInviteDraft;

  try {
    if (!previewMatchesApprovedPayload(parsed)) {
      return validationErrorResult(
        executionActionResultSchema,
        "A previa aprovada nao corresponde ao escopo atual do convite. Gere e revise uma nova previa antes de salvar."
      );
    }

    draft = buildAccountabilityInviteDraft(parsed);
  } catch (error) {
    if (isPrivateScopeError(error)) {
      return validationErrorResult(executionActionResultSchema, ACCOUNTABILITY_PRIVATE_SCOPE_MESSAGE);
    }

    return errorDraft("Nao foi possivel preparar o convite seguro do Atalaia agora.");
  }

  const emailTemplate = buildAccountabilityEmailTemplate({
    event: "invite",
    safeSummary: parsed.goalTitle,
    userName: "Usuario",
    secureLink: `/accountability/partner/${draft.grant.inviteToken}`
  });

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Convite mantido como rascunho local/dev. Entre para persistir com RLS.",
        draft.grant.id
      );
    }

    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("id")
      .eq("id", parsed.goalId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (goalError || !goal?.id) {
      return errorDraft("O alvo escolhido nao pertence ao usuario autenticado.");
    }

    const admin = createSupabaseAdminClient();
    const tokenHash = hashToken(draft.grant.inviteToken);
    const nowIso = new Date().toISOString();
    const inviteExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
    const { data: consent, error: consentError } = await admin
      .from("consent_records")
      .insert({
        user_id: user.id,
        consent_type: "accountability_grant",
        version: ACCOUNTABILITY_CONSENT_VERSION,
        scope: "goal",
        subject_type: "goal",
        subject_id: parsed.goalId,
        accepted_at: nowIso,
        metadata: {
          partner_email_hash: hashMetadataValue(parsed.partnerEmail),
          permissions: draft.grant.permissions,
          notification_frequency: parsed.notificationFrequency,
          tracking_level: parsed.level,
          preview_schema_version: draft.preview.schema_version
        }
      })
      .select("id")
      .single();

    const consentId = jsonString(consent?.id);
    if (consentError || !consentId) {
      return errorDraft("Nao foi possivel registrar o consentimento do Atalaia agora.");
    }

    const { data: partner, error: partnerError } = await admin
      .from("accountability_partners")
      .insert({
        user_id: user.id,
        name: parsed.partnerName,
        email: parsed.partnerEmail,
        status: "expired",
        invite_token_hash: null,
        invite_expires_at: nowIso
      })
      .select("id")
      .single();

    const partnerId = jsonString(partner?.id);
    if (partnerError || !partnerId) {
      const cleaned = await compensateFailedInvite(admin, { consentId, failedAt: nowIso, userId: user.id });
      return errorDraft(
        cleaned
          ? "Nao foi possivel criar o Atalaia agora."
          : "Nao foi possivel criar o Atalaia agora. Revise a limpeza operacional antes de reenviar."
      );
    }

    const { data: grant, error: grantError } = await admin
      .from("accountability_grants")
      .insert({
        user_id: user.id,
        accountability_partner_id: partnerId,
        goal_id: parsed.goalId,
        permissions: Object.fromEntries(draft.grant.permissions.map((permission) => [permission, true])),
        invite_token_hash: null,
        status: "expired",
        tracking_level: parsed.level,
        notification_frequency: parsed.notificationFrequency,
        consent_version: ACCOUNTABILITY_CONSENT_VERSION,
        consent_recorded_at: nowIso,
        last_previewed_at: nowIso
      })
      .select("id")
      .single();

    const grantId = jsonString(grant?.id);
    if (grantError || !grantId) {
      const cleaned = await compensateFailedInvite(admin, { consentId, failedAt: nowIso, partnerId, userId: user.id });
      return errorDraft(
        cleaned
          ? "Atalaia criado, mas o grant por alvo nao foi salvo."
          : "Atalaia criado sem grant utilizavel. Revise a limpeza operacional antes de reenviar."
      );
    }

    const { error: eventError } = await admin.from("accountability_events").insert({
      user_id: user.id,
      accountability_partner_id: partnerId,
      accountability_grant_id: grantId,
      goal_id: parsed.goalId,
      event_type: "accountability_invite_previewed",
      actor_type: "owner",
      actor_id: user.id,
      metadata_minimal: {
        consent_record_id: consentId,
        consent_version: ACCOUNTABILITY_CONSENT_VERSION,
        permissions: draft.grant.permissions,
        notification_status: "pending_provider_config",
        template_key: emailTemplate.templateKey,
        preview_schema_version: draft.preview.schema_version
      }
    });

    if (eventError) {
      const cleaned = await compensateFailedInvite(admin, { consentId, failedAt: nowIso, grantId, partnerId, userId: user.id });
      return realServiceErrorResult(
        executionActionResultSchema,
        cleaned
          ? "Convite nao foi ativado porque a auditoria do Atalaia nao foi registrada."
          : "Convite nao foi ativado porque a auditoria do Atalaia falhou. Revise a limpeza operacional."
      );
    }

    const emailProvider = createEmailProvider();
    const emailResult = await emailProvider.send({
      body: emailTemplate.body,
      metadata: {
        goalId: parsed.goalId,
        grantId,
        templateKey: emailTemplate.templateKey,
        templateVersion: emailTemplate.templateVersion
      },
      subject: emailTemplate.subject,
      to: parsed.partnerEmail
    });

    const { error: notificationError } = await admin.from("accountability_notifications").insert({
      user_id: user.id,
      accountability_partner_id: partnerId,
      accountability_grant_id: grantId,
      goal_id: parsed.goalId,
      notification_type: "invite",
      channel: "email",
      status: emailResult.status === "pending_provider_config" ? "draft" : emailResult.status,
      preview_payload: {
        schema_version: draft.preview.schema_version,
        message_type: draft.preview.message_type,
        shared_fields: draft.preview.shared_fields,
        privacy_check: draft.preview.privacy_check,
        subject: draft.preview.subject
      },
      provider_status: emailResult.status,
      privacy_check: draft.preview.privacy_check
    });

    if (notificationError) {
      const cleaned = await compensateFailedInvite(admin, { consentId, failedAt: nowIso, grantId, partnerId, userId: user.id });
      return realServiceErrorResult(
        executionActionResultSchema,
        cleaned
          ? "Convite nao foi ativado porque a notificacao do Atalaia nao foi registrada."
          : "Convite nao foi ativado porque a notificacao do Atalaia falhou. Revise a limpeza operacional."
      );
    }

    const { data: grantInviteData, error: grantInviteError } = await admin
      .from("accountability_grants")
      .update({ invite_token_hash: tokenHash, status: "invited" })
      .eq("id", grantId)
      .eq("user_id", user.id)
      .eq("accountability_partner_id", partnerId)
      .eq("status", "expired")
      .is("invite_token_hash", null)
      .select("id")
      .maybeSingle();

    if (grantInviteError || !grantInviteData?.id) {
      const cleaned = await compensateFailedInvite(admin, { consentId, failedAt: nowIso, grantId, partnerId, userId: user.id });
      return realServiceErrorResult(
        executionActionResultSchema,
        cleaned
          ? "Convite nao foi ativado porque o grant permaneceu fechado."
          : "Convite nao foi ativado e requer revisao operacional antes de reenviar."
      );
    }

    const { data: partnerInviteData, error: partnerInviteError } = await admin
      .from("accountability_partners")
      .update({
        invite_expires_at: inviteExpiresAt,
        invite_token_hash: tokenHash,
        status: "invited"
      })
      .eq("id", partnerId)
      .eq("user_id", user.id)
      .eq("status", "expired")
      .is("invite_token_hash", null)
      .select("id")
      .maybeSingle();

    if (partnerInviteError || !partnerInviteData?.id) {
      const cleaned = await compensateFailedInvite(admin, { consentId, failedAt: nowIso, grantId, partnerId, userId: user.id });
      return realServiceErrorResult(
        executionActionResultSchema,
        cleaned
          ? "Convite nao foi ativado porque o parceiro permaneceu fechado."
          : "Convite nao foi ativado e requer revisao operacional antes de reenviar."
      );
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      `Convite salvo com grant por alvo. ${emailResult.message}`,
      grantId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: convite validado sem persistencia remota ou envio real.",
      draft.grant.id,
      {},
      "Nao foi possivel salvar o convite do Atalaia agora."
    );
  }
}

export async function acceptAccountabilityInvite(input: unknown): Promise<BasicAccountabilityActionResult> {
  const inputResult = safeParseActionInput(acceptAccountabilityInviteInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Aceite simulado em local/dev. Auth real e necessario para ativar o painel limitado."
      );
    }

    if (!user.email) {
      return errorDraft("Sessao autenticada sem e-mail verificavel para aceitar este convite.");
    }

    const admin = createSupabaseAdminClient();
    const tokenHash = hashToken(parsed.inviteToken);
    const nowIso = new Date().toISOString();
    const { data: partner, error: partnerError } = await admin
      .from("accountability_partners")
      .select("id, user_id, email")
      .eq("invite_token_hash", tokenHash)
      .eq("status", "invited")
      .is("partner_user_id", null)
      .is("revoked_at", null)
      .gt("invite_expires_at", nowIso)
      .maybeSingle();

    const partnerId = jsonString(partner?.id);
    const ownerUserId = jsonString(partner?.user_id);
    if (partnerError || !partnerId) {
      return errorDraft("Convite nao encontrado ou expirado.");
    }

    if (!ownerUserId) {
      return errorDraft("Convite sem usuario dono valido.");
    }

    if (normalizeEmail(jsonString(partner?.email)) !== normalizeEmail(user.email)) {
      return errorDraft("Este convite pertence a outro e-mail autenticado.");
    }

    const { data: invitedGrant, error: grantLookupError } = await admin
      .from("accountability_grants")
      .select("id, goal_id")
      .eq("accountability_partner_id", partnerId)
      .eq("user_id", ownerUserId)
      .eq("status", "invited")
      .eq("invite_token_hash", tokenHash)
      .is("revoked_at", null)
      .maybeSingle();

    const grantId = jsonString(invitedGrant?.id);
    const goalId = jsonString(invitedGrant?.goal_id);
    if (grantLookupError || !grantId || !goalId) {
      return errorDraft("Convite nao possui grant por alvo valido.");
    }

    const { data: consent, error: consentError } = await admin
      .from("consent_records")
      .insert({
        user_id: ownerUserId,
        consent_type: "accountability_acceptance",
        version: ACCOUNTABILITY_CONSENT_VERSION,
        scope: "goal",
        subject_type: "goal",
        subject_id: goalId,
        accepted_at: nowIso,
        metadata: {
          accountability_grant_id: grantId,
          accountability_partner_id: partnerId,
          accepted_by_user_id_hash: hashMetadataValue(user.id),
          partner_email_hash: hashMetadataValue(user.email)
        }
      })
      .select("id")
      .single();

    const consentId = jsonString(consent?.id);
    if (consentError || !consentId) {
      return errorDraft("Aceite nao foi concluido porque o consentimento do Atalaia nao foi registrado.");
    }

    const { error: eventError } = await admin.from("accountability_events").insert({
      user_id: ownerUserId,
      accountability_partner_id: partnerId,
      accountability_grant_id: grantId,
      goal_id: goalId,
      event_type: "accountability_invite_accepted",
      actor_type: "partner",
      actor_id: user.id,
      metadata_minimal: {
        consent_record_id: consentId,
        consent_version: ACCOUNTABILITY_CONSENT_VERSION,
        invite_scope_changed: false
      }
    });

    if (eventError) {
      const cleaned = await compensateFailedInvite(admin, {
        consentId,
        failedAt: nowIso,
        grantId,
        partnerId,
        userId: ownerUserId
      });
      return realServiceErrorResult(
        executionActionResultSchema,
        cleaned
          ? "Aceite nao foi ativado porque a auditoria do Atalaia nao foi registrada."
          : "Aceite nao foi ativado porque a auditoria falhou. Revise a limpeza operacional."
      );
    }

    const { data: grantUpdateData, error: grantUpdateError } = await admin
      .from("accountability_grants")
      .update({ accepted_at: nowIso, invite_token_hash: null, status: "active" })
      .eq("id", grantId)
      .eq("user_id", ownerUserId)
      .eq("accountability_partner_id", partnerId)
      .eq("status", "invited")
      .eq("invite_token_hash", tokenHash)
      .select("id")
      .maybeSingle();

    if (grantUpdateError || !grantUpdateData?.id) {
      const cleaned = await compensateFailedInvite(admin, {
        consentId,
        failedAt: nowIso,
        grantId,
        partnerId,
        userId: ownerUserId
      });
      return errorDraft(
        cleaned
          ? "Aceite nao foi ativado porque o grant por alvo permaneceu fechado."
          : "Aceite nao foi ativado e requer revisao operacional antes de reenviar."
      );
    }

    const { data: partnerUpdateData, error: partnerUpdateError } = await admin
      .from("accountability_partners")
      .update({
        accepted_at: nowIso,
        invite_token_hash: null,
        partner_user_id: user.id,
        status: "active"
      })
      .eq("id", partnerId)
      .eq("user_id", ownerUserId)
      .eq("invite_token_hash", tokenHash)
      .eq("status", "invited")
      .is("partner_user_id", null)
      .select("id")
      .maybeSingle();

    if (partnerUpdateError || !partnerUpdateData?.id) {
      const cleaned = await compensateFailedInvite(admin, {
        consentId,
        failedAt: nowIso,
        grantId,
        partnerId,
        userId: ownerUserId
      });
      return errorDraft(
        cleaned
          ? "Aceite nao foi ativado porque o parceiro permaneceu fechado."
          : "Aceite nao foi ativado e requer revisao operacional antes de reenviar."
      );
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Convite aceito. O painel limitado respeita o grant por alvo.",
      grantId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: aceite validado sem ativar acesso real.",
      undefined,
      {},
      "Nao foi possivel aceitar o convite agora."
    );
  }
}

export async function revokeAccountabilityGrant(input: unknown): Promise<BasicAccountabilityActionResult> {
  const inputResult = safeParseActionInput(revokeAccountabilityGrantInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Revogacao simulada em local/dev. Entre para revogar um grant real.",
        parsed.grantId
      );
    }

    const admin = createSupabaseAdminClient();
    const revokedAt = new Date().toISOString();
    const { data: grant, error: grantLookupError } = await admin
      .from("accountability_grants")
      .select("id, accountability_partner_id, goal_id")
      .eq("id", parsed.grantId)
      .eq("user_id", user.id)
      .maybeSingle();

    const grantId = jsonString(grant?.id);
    const partnerId = jsonString(grant?.accountability_partner_id);
    const goalId = jsonString(grant?.goal_id);
    if (grantLookupError) {
      return errorDraft("Nao foi possivel localizar o grant para revogacao agora.");
    }

    if (!grantId || !partnerId || !goalId) {
      return noAffectedRowResult(executionActionResultSchema, "Grant nao encontrado para este usuario.");
    }

    const { data, error } = await admin
      .from("accountability_grants")
      .update({
        invite_token_hash: null,
        revoked_at: revokedAt,
        revoked_reason: parsed.reason ?? "Revogado pelo usuario",
        status: "revoked"
      })
      .eq("id", parsed.grantId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return errorDraft("Nao foi possivel revogar o grant agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(executionActionResultSchema, "Grant nao encontrado para este usuario.");
    }

    const { error: partnerRevokeError } = await admin
      .from("accountability_partners")
      .update({ revoked_at: revokedAt, status: "revoked" })
      .eq("id", partnerId)
      .eq("user_id", user.id);

    if (partnerRevokeError) {
      return realServiceErrorResult(
        executionActionResultSchema,
        "Grant revogado, mas a relacao do Atalaia nao foi marcada como revogada."
      );
    }

    const { error: notificationCancelError } = await admin
      .from("accountability_notifications")
      .update({ blocked_reason: "grant_revoked", status: "cancelled" })
      .eq("accountability_grant_id", grantId)
      .eq("user_id", user.id)
      .in("status", ["draft", "previewed", "approved", "queued"]);

    if (notificationCancelError) {
      return realServiceErrorResult(
        executionActionResultSchema,
        "A revogacao do Atalaia nao foi concluida porque as notificacoes pendentes nao foram canceladas."
      );
    }

    const { error: consentRevokeError } = await admin
      .from("consent_records")
      .update({ revoked_at: revokedAt })
      .eq("user_id", user.id)
      .eq("consent_type", "accountability_grant")
      .eq("scope", "goal")
      .eq("subject_type", "goal")
      .eq("subject_id", goalId)
      .is("revoked_at", null);

    if (consentRevokeError) {
      return realServiceErrorResult(
        executionActionResultSchema,
        "Grant revogado, mas o consentimento do Atalaia nao foi marcado como revogado."
      );
    }

    const { error: eventError } = await admin.from("accountability_events").insert({
      user_id: user.id,
      accountability_partner_id: partnerId,
      accountability_grant_id: grantId,
      goal_id: goalId,
      event_type: "accountability_grant_revoked",
      actor_type: "owner",
      actor_id: user.id,
      metadata_minimal: {
        consent_version: ACCOUNTABILITY_CONSENT_VERSION,
        reason_present: Boolean(parsed.reason),
        revocation_recorded_at: revokedAt
      }
    });

    if (eventError) {
      return realServiceErrorResult(
        executionActionResultSchema,
        "Acesso revogado, mas a auditoria da revogacao do Atalaia nao foi registrada."
      );
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Acesso revogado e notificacoes pendentes canceladas.",
      parsed.grantId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: revogacao validada e notificacoes tratadas como canceladas.",
      parsed.grantId,
      {},
      "Nao foi possivel revogar o grant agora."
    );
  }
}

export async function getAccountabilityInvitePreview(input: unknown): Promise<AccountabilityInvitePreviewResult> {
  const parsedInput = acceptAccountabilityInviteInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return invitePreviewResult({
      canAccept: false,
      message: "Convite invalido ou malformado.",
      mode: "local-draft",
      ok: false,
      requiresAuth: false
    });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return invitePreviewResult({
        canAccept: false,
        message: "Entre na sua conta para visualizar e aceitar este convite limitado.",
        mode: "local-draft",
        ok: false,
        requiresAuth: true
      });
    }

    if (!user.email) {
      return invitePreviewResult({
        canAccept: false,
        message: "Sua sessao nao possui e-mail verificavel para este convite.",
        mode: "supabase",
        ok: false,
        requiresAuth: false
      });
    }

    const admin = createSupabaseAdminClient();
    const tokenHash = hashToken(parsedInput.data.inviteToken);
    const nowIso = new Date().toISOString();
    const { data: partner, error: partnerError } = await admin
      .from("accountability_partners")
      .select("id, user_id, email")
      .eq("invite_token_hash", tokenHash)
      .eq("status", "invited")
      .is("partner_user_id", null)
      .is("revoked_at", null)
      .gt("invite_expires_at", nowIso)
      .maybeSingle();

    const partnerId = jsonString(partner?.id);
    const ownerUserId = jsonString(partner?.user_id);
    const partnerEmail = jsonString(partner?.email);
    if (partnerError || !partnerId || !ownerUserId || !partnerEmail) {
      return invitePreviewResult({
        canAccept: false,
        message: "Convite nao encontrado, expirado ou ja encerrado.",
        mode: "supabase",
        ok: false,
        requiresAuth: false
      });
    }

    if (normalizeEmail(partnerEmail) !== normalizeEmail(user.email)) {
      return invitePreviewResult({
        canAccept: false,
        message: "Este convite pertence a outro e-mail autenticado.",
        mode: "supabase",
        ok: false,
        requiresAuth: false
      });
    }

    const { data: grant, error: grantError } = await admin
      .from("accountability_grants")
      .select("id, goal_id, permissions, tracking_level, notification_frequency, last_previewed_at")
      .eq("accountability_partner_id", partnerId)
      .eq("user_id", ownerUserId)
      .eq("status", "invited")
      .eq("invite_token_hash", tokenHash)
      .is("revoked_at", null)
      .maybeSingle();

    const grantId = jsonString(grant?.id);
    const goalId = jsonString(grant?.goal_id);
    if (grantError || !grantId || !goalId) {
      return invitePreviewResult({
        canAccept: false,
        message: "Convite sem grant por alvo valido.",
        mode: "supabase",
        ok: false,
        requiresAuth: false
      });
    }

    const { data: goal } = await admin
      .from("goals")
      .select("title")
      .eq("id", goalId)
      .eq("user_id", ownerUserId)
      .maybeSingle();

    const grantDraft: AccountabilityGrantPreview = {
      goalId,
      goalTitle: jsonString(goal?.title) ?? "Alvo autorizado",
      id: grantId,
      level: accountabilityLevelSchema.catch("balanced").parse(grant?.tracking_level),
      notificationFrequency: accountabilityNotificationFrequencySchema.catch("weekly").parse(
        grant?.notification_frequency
      ),
      permissions: permissionsFromGrant(grant?.permissions),
      reviewedAt: jsonString(grant?.last_previewed_at) ?? null,
      revokedAt: null,
      status: "invited"
    };

    return invitePreviewResult({
      canAccept: true,
      grant: grantDraft,
      message: "Convite verificado. Revise o escopo antes de aceitar.",
      mode: "supabase",
      ok: true,
      requiresAuth: false
    });
  } catch {
    const fallback = persistenceCatchResult(
      executionActionResultSchema,
      "Modo local/dev sem preview real de convite.",
      undefined,
      {},
      "Nao foi possivel carregar a previa segura do convite agora."
    );

    return invitePreviewResult({
      canAccept: false,
      message: fallback.message,
      mode: fallback.mode,
      ok: false,
      requiresAuth: fallback.mode === "local-draft"
    });
  }
}

export async function previewAccountabilityMessage(input: unknown): Promise<AccountabilityActionResult> {
  const inputResult = safeParseActionInput(createAccountabilityInviteInputSchema, input, accountabilityActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  let preview;

  try {
    preview = buildAccountabilityMessagePreview(inputResult.data);
  } catch (error) {
    if (isPrivateScopeError(error)) {
      return validationErrorResult(accountabilityActionResultSchema, ACCOUNTABILITY_PRIVATE_SCOPE_MESSAGE);
    }

    return validationErrorResult(
      accountabilityActionResultSchema,
      "Nao foi possivel gerar uma previa segura para o Atalaia agora."
    );
  }

  return accountabilityActionResultSchema.parse({
    message: "Previa segura criada; revise antes de qualquer envio.",
    mode: "local-draft",
    ok: true,
    preview
  });
}
