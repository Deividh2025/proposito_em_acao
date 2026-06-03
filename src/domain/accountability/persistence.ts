import { z } from "zod";

import {
  accountabilityMessageOutputSchema,
  accountabilitySharedFieldSchema,
  type AccountabilityMessageOutput
} from "@/ai/schemas";
import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

import {
  accountabilityLevelLabels,
  accountabilityPermissionLabels,
  prohibitedAccountabilityCategories,
  type AccountabilityGrantDraft,
  type AccountabilityLevel,
  type AccountabilityPartnerDraft,
  type AccountabilityPermission
} from "./types";

export const accountabilityLevelSchema = z.enum(["light", "balanced", "firm"]);
export const accountabilityNotificationFrequencySchema = z.enum([
  "milestones_only",
  "weekly",
  "important_events",
  "paused"
]);
export const accountabilityPermissionSchema = accountabilitySharedFieldSchema;

export const createAccountabilityInviteInputSchema = z
  .object({
    goalId: z.string().trim().min(1).max(120),
    goalTitle: z.string().trim().min(1).max(180),
    goalDeadline: z.string().trim().min(1).max(80),
    goalStatus: z.string().trim().min(1).max(80).default("ativo"),
    progressPercentage: z.number().min(0).max(100).default(28),
    completedMilestones: z.array(z.string().trim().min(1).max(180)).max(6).default([]),
    partnerName: z.string().trim().min(2).max(120),
    partnerEmail: z.string().trim().email(),
    level: accountabilityLevelSchema,
    notificationFrequency: accountabilityNotificationFrequencySchema,
    permissions: z.array(accountabilityPermissionSchema).min(1).max(11),
    customMessage: z.string().trim().max(600).optional(),
    firstAction: z.string().trim().min(2).max(240).default("Executar a proxima microacao definida para o alvo."),
    helpRequest: z.string().trim().max(400).optional()
  })
  .strict();

export const persistAccountabilityInviteInputSchema = createAccountabilityInviteInputSchema.extend({
  preview: accountabilityMessageOutputSchema
});

export const acceptAccountabilityInviteInputSchema = z
  .object({
    inviteToken: z.string().trim().min(8).max(120),
    partnerDisplayName: z.string().trim().min(2).max(120).optional()
  })
  .strict();

export const revokeAccountabilityGrantInputSchema = z
  .object({
    grantId: z.string().trim().min(1).max(120),
    reason: z.string().trim().max(300).optional()
  })
  .strict();

export const accountabilityInviteDraftSchema = z
  .object({
    partner: z.object({
      name: z.string(),
      email: z.string().email(),
      status: z.enum(["invited", "active", "revoked", "expired"])
    }),
    grant: z.object({
      id: z.string(),
      goalId: z.string(),
      goalTitle: z.string(),
      status: z.enum(["invited", "active", "revoked", "expired"]),
      level: accountabilityLevelSchema,
      notificationFrequency: accountabilityNotificationFrequencySchema,
      permissions: z.array(accountabilityPermissionSchema),
      inviteToken: z.string(),
      reviewedAt: z.string().nullable(),
      revokedAt: z.string().nullable()
    }),
    preview: accountabilityMessageOutputSchema,
    notificationStatus: z.enum(["draft", "previewed", "pending_provider_config", "queued", "sent", "blocked"]),
    excludedPrivateCategories: z.array(z.string()).min(1)
  })
  .strict();

export const accountabilityActionResultSchema = executionActionResultSchema.extend({
  draft: accountabilityInviteDraftSchema.optional(),
  preview: accountabilityMessageOutputSchema.optional()
});

export type CreateAccountabilityInviteInput = z.infer<typeof createAccountabilityInviteInputSchema>;
export type AccountabilityInviteDraft = z.infer<typeof accountabilityInviteDraftSchema>;
export type AccountabilityActionResult = z.infer<typeof accountabilityActionResultSchema>;
export type BasicAccountabilityActionResult = ExecutionActionResult;

export const ACCOUNTABILITY_PRIVATE_SCOPE_MESSAGE =
  "A previa contem dado privado fora do escopo do Atalaia. Revise antes de salvar o convite.";

export function normalizePermissions(
  level: AccountabilityLevel,
  permissions: AccountabilityPermission[]
): AccountabilityPermission[] {
  void level;

  return Array.from(new Set(permissions));
}

const sensitiveContentChecks = {
  privateMetacognition: /\b(metacogni[cç][aã]o|pensamento automatico|pensamento autom[aá]tico|distor[cç][aã]o cognitiva|impulso)\b/i,
  fullCalling: /\b(chamado completo|texto completo do chamado|vontade de deus especifica|vontade divina especifica)\b/i,
  health: /\b(sa[uú]de|diagn[oó]stico|medica[cç][aã]o|terapia|psiquiatr|sono|crise)\b/i,
  familyFinanceEmotion: /\b(fam[ií]lia|finan[cç]as|d[ií]vida|sal[aá]rio|emo[cç][oõ]es|medo|vergonha|culpa)\b/i,
  rawPrivateContext: /\b(revis[aã]o semanal privada|inbox bruto|caixa de entrada|calend[aá]rio completo|agenda completa|distrac[oõ]es?|prompt bruto|resposta bruta)\b/i
};

function detectPrivateContent(value: string | undefined) {
  const text = value ?? "";

  return {
    contains_private_metacognition: sensitiveContentChecks.privateMetacognition.test(text),
    contains_full_calling: sensitiveContentChecks.fullCalling.test(text),
    contains_sensitive_health_data: sensitiveContentChecks.health.test(text),
    contains_family_finance_emotion_data:
      sensitiveContentChecks.familyFinanceEmotion.test(text) || sensitiveContentChecks.rawPrivateContext.test(text)
  };
}

export function createAccountabilityInviteToken() {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random generator is required for accountability invites.");
  }

  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function buildAccountabilityMessagePreview(input: CreateAccountabilityInviteInput): AccountabilityMessageOutput {
  const permissions = normalizePermissions(input.level, input.permissions);
  const userSuppliedText = [
    input.goalTitle,
    input.goalStatus,
    input.completedMilestones.join(" "),
    input.customMessage,
    input.helpRequest
  ]
    .filter(Boolean)
    .join(" ");
  const privacyFlags = detectPrivateContent(userSuppliedText);
  const safeToSend = !Object.values(privacyFlags).some(Boolean);

  if (!safeToSend) {
    throw new Error(ACCOUNTABILITY_PRIVATE_SCOPE_MESSAGE);
  }

  const permissionLabels = permissions.map((permission) => accountabilityPermissionLabels[permission]);
  const bodyParts = [
    `${input.partnerName}, voce foi convidado para acompanhar o alvo "${input.goalTitle}" no Propósito em Ação.`,
    `Nivel de acompanhamento: ${accountabilityLevelLabels[input.level]}.`,
    `Escopo autorizado: ${permissionLabels.join(", ")}.`,
    input.customMessage ? `Mensagem revisada pelo usuario: ${input.customMessage}` : null,
    "Voce recebera apenas os campos autorizados deste alvo. Categorias privadas fora do escopo permanecem bloqueadas."
  ].filter(Boolean);

  return accountabilityMessageOutputSchema.parse({
    schema_version: "accountability_message_output_v1",
    message_type: "invite",
    subject: "Convite para acompanhar um alvo autorizado",
    body: bodyParts.join(" "),
    shared_fields: permissions,
    privacy_check: {
      ...privacyFlags,
      safe_to_send: safeToSend
    },
    tone: input.level === "firm" ? "firm" : "supportive",
    call_to_action: "Aceitar convite e respeitar o escopo autorizado",
    consent_required: true,
    user_review_required: true
  });
}

export function buildAccountabilityInviteDraft(input: CreateAccountabilityInviteInput): AccountabilityInviteDraft {
  const permissions = normalizePermissions(input.level, input.permissions);
  const inviteToken = createAccountabilityInviteToken();
  const preview = buildAccountabilityMessagePreview({ ...input, permissions });
  const partner: AccountabilityPartnerDraft = {
    email: input.partnerEmail,
    name: input.partnerName,
    status: "invited"
  };
  const grant: AccountabilityGrantDraft = {
    goalId: input.goalId,
    goalTitle: input.goalTitle,
    id: `grant-${inviteToken.slice(0, 24)}`,
    inviteToken,
    level: input.level,
    notificationFrequency: input.notificationFrequency,
    permissions,
    reviewedAt: null,
    revokedAt: null,
    status: "invited"
  };

  return accountabilityInviteDraftSchema.parse({
    excludedPrivateCategories: [...prohibitedAccountabilityCategories],
    grant,
    notificationStatus: "pending_provider_config",
    partner,
    preview
  });
}
