"use server";

import { createHash } from "node:crypto";

import {
  accountabilityActionResultSchema,
  acceptAccountabilityInviteInputSchema,
  buildAccountabilityInviteDraft,
  buildAccountabilityMessagePreview,
  createAccountabilityInviteInputSchema,
  persistAccountabilityInviteInputSchema,
  revokeAccountabilityGrantInputSchema,
  type AccountabilityActionResult,
  type BasicAccountabilityActionResult
} from "@/domain/accountability";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import { buildAccountabilityEmailTemplate } from "@/lib/email/templates/accountability";
import { createEmailProvider } from "@/lib/email/provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): BasicAccountabilityActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: true, message, id });
}

function errorDraft(message: string): BasicAccountabilityActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function jsonString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

export async function generateAccountabilityInviteDraft(input: unknown): Promise<AccountabilityActionResult> {
  const parsed = createAccountabilityInviteInputSchema.parse(input);
  const draft = buildAccountabilityInviteDraft(parsed);

  return accountabilityActionResultSchema.parse({
    draft,
    mode: "local-draft",
    ok: true,
    preview: draft.preview,
    message: "Mock seguro gerou convite, permissoes e previa. Nenhum e-mail ou OpenAI real foi acionado."
  });
}

export async function persistAccountabilityInvite(input: unknown): Promise<BasicAccountabilityActionResult> {
  const parsed = persistAccountabilityInviteInputSchema.parse(input);
  const draft = buildAccountabilityInviteDraft(parsed);

  if (!draft.preview.privacy_check.safe_to_send) {
    return errorDraft("A previa contem dado privado fora do escopo do Atalaia. Revise antes de salvar o convite.");
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
      return localDraft("Convite mantido como rascunho local/dev. Entre para persistir com RLS.", draft.grant.id);
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

    const { data: partner, error: partnerError } = await supabase
      .from("accountability_partners")
      .insert({
        user_id: user.id,
        name: parsed.partnerName,
        email: parsed.partnerEmail,
        status: "invited",
        invite_token_hash: hashToken(draft.grant.inviteToken),
        invite_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()
      })
      .select("id")
      .single();

    const partnerId = jsonString(partner?.id);
    if (partnerError || !partnerId) {
      return errorDraft("Nao foi possivel criar o Atalaia agora.");
    }

    const { data: grant, error: grantError } = await supabase
      .from("accountability_grants")
      .insert({
        user_id: user.id,
        accountability_partner_id: partnerId,
        goal_id: parsed.goalId,
        permissions: Object.fromEntries(draft.grant.permissions.map((permission) => [permission, true])),
        status: "invited",
        tracking_level: parsed.level,
        notification_frequency: parsed.notificationFrequency,
        consent_version: "accountability_prompt13_v1",
        consent_recorded_at: new Date().toISOString(),
        last_previewed_at: new Date().toISOString()
      })
      .select("id")
      .single();

    const grantId = jsonString(grant?.id);
    if (grantError || !grantId) {
      return errorDraft("Atalaia criado, mas o grant por alvo nao foi salvo.");
    }

    await supabase.from("accountability_events").insert({
      user_id: user.id,
      accountability_partner_id: partnerId,
      accountability_grant_id: grantId,
      goal_id: parsed.goalId,
      event_type: "accountability_invite_previewed",
      actor_type: "owner",
      actor_id: user.id,
      metadata_minimal: {
        permissions: draft.grant.permissions,
        notification_status: "pending_provider_config",
        template_key: emailTemplate.templateKey
      }
    });

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

    await supabase.from("accountability_notifications").insert({
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

    return executionActionResultSchema.parse({
      id: grantId,
      message: `Convite salvo com grant por alvo. ${emailResult.message}`,
      mode: "supabase",
      ok: true
    });
  } catch {
    return localDraft("Modo local seguro: convite validado sem persistencia remota ou envio real.", draft.grant.id);
  }
}

export async function acceptAccountabilityInvite(input: unknown): Promise<BasicAccountabilityActionResult> {
  const parsed = acceptAccountabilityInviteInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Aceite simulado em local/dev. Auth real e necessario para ativar o painel limitado.");
    }

    const tokenHash = hashToken(parsed.inviteToken);
    const nowIso = new Date().toISOString();
    const { data: partner, error: partnerError } = await supabase
      .from("accountability_partners")
      .select("id, user_id")
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

    const partnerUpdate = {
      accepted_at: new Date().toISOString(),
      invite_token_hash: null,
      partner_user_id: user.id,
      status: "active",
      ...(parsed.partnerDisplayName ? { name: parsed.partnerDisplayName } : {})
    };

    const { error: partnerUpdateError } = await supabase
      .from("accountability_partners")
      .update(partnerUpdate)
      .eq("id", partnerId)
      .eq("status", "invited")
      .is("partner_user_id", null);

    if (partnerUpdateError) {
      return errorDraft("Nao foi possivel aceitar o convite agora.");
    }

    const { error: grantUpdateError } = await supabase
      .from("accountability_grants")
      .update({ accepted_at: new Date().toISOString(), status: "active" })
      .eq("accountability_partner_id", partnerId)
      .eq("user_id", ownerUserId)
      .eq("status", "invited");

    if (grantUpdateError) {
      return errorDraft("Convite aceito, mas o grant por alvo nao foi ativado.");
    }

    return executionActionResultSchema.parse({
      id: partnerId,
      message: "Convite aceito. O painel limitado respeita o grant por alvo.",
      mode: "supabase",
      ok: true
    });
  } catch {
    return localDraft("Modo local seguro: aceite validado sem ativar acesso real.");
  }
}

export async function revokeAccountabilityGrant(input: unknown): Promise<BasicAccountabilityActionResult> {
  const parsed = revokeAccountabilityGrantInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Revogacao simulada em local/dev. Entre para revogar um grant real.", parsed.grantId);
    }

    const revokedAt = new Date().toISOString();
    const { error } = await supabase
      .from("accountability_grants")
      .update({
        revoked_at: revokedAt,
        revoked_reason: parsed.reason ?? "Revogado pelo usuario",
        status: "revoked"
      })
      .eq("id", parsed.grantId)
      .eq("user_id", user.id);

    if (error) {
      return errorDraft("Nao foi possivel revogar o grant agora.");
    }

    await supabase
      .from("accountability_notifications")
      .update({ status: "cancelled", blocked_reason: "grant_revoked" })
      .eq("accountability_grant_id", parsed.grantId)
      .eq("user_id", user.id)
      .in("status", ["draft", "previewed", "approved", "queued"]);

    return executionActionResultSchema.parse({
      id: parsed.grantId,
      message: "Acesso revogado e notificacoes pendentes canceladas.",
      mode: "supabase",
      ok: true
    });
  } catch {
    return localDraft("Modo local seguro: revogacao validada e notificacoes tratadas como canceladas.", parsed.grantId);
  }
}

export async function previewAccountabilityMessage(input: unknown): Promise<AccountabilityActionResult> {
  const parsed = createAccountabilityInviteInputSchema.parse(input);
  const preview = buildAccountabilityMessagePreview(parsed);

  return accountabilityActionResultSchema.parse({
    message: "Previa segura criada; revise antes de qualquer envio.",
    mode: "local-draft",
    ok: true,
    preview
  });
}
