import { z } from "zod";

import {
  accountabilitySharedFieldSchema,
  commitmentDocumentOutputSchema,
  type AccountabilitySharedField
} from "@/ai/schemas";
import { executionActionResultSchema, type ExecutionActionResult } from "@/domain/execution/persistence";

import type { CommitmentDocumentDraft, CommitmentLever, CommitmentLeverSafety, CommitmentLeverType } from "./types";

const optionalShortListSchema = z.array(z.string().trim().min(1).max(160)).max(8).default([]);

export const createCommitmentDocumentInputSchema = z
  .object({
    userName: z.string().trim().min(2).max(120),
    goalId: z.string().trim().min(1).max(120),
    goalTitle: z.string().trim().min(2).max(180),
    deadline: z.string().trim().min(2).max(80),
    callingSummary: z.string().trim().max(500).optional(),
    callingSummaryAuthorized: z.boolean().default(false),
    linkedProjects: optionalShortListSchema,
    supportingHabits: optionalShortListSchema,
    scoreboardItems: optionalShortListSchema,
    partnerName: z.string().trim().min(2).max(120),
    partnerEmail: z.string().trim().email(),
    reward: z.string().trim().max(400).optional(),
    restorativeConsequence: z.string().trim().max(500).optional(),
    firstAction: z.string().trim().min(2).max(240),
    sharingPermissions: z.array(accountabilitySharedFieldSchema).max(10).default([])
  })
  .strict();

export const persistCommitmentDocumentInputSchema = createCommitmentDocumentInputSchema.extend({
  output: commitmentDocumentOutputSchema
});

export const commitmentDocumentActionResultSchema = executionActionResultSchema.extend({
  draft: z
    .object({
      document: commitmentDocumentOutputSchema,
      levers: z.array(
        z.object({
          type: z.enum(["progress_reward", "completion_reward", "restorative_consequence"]),
          description: z.string(),
          safety: z.enum(["safe", "needs_review", "blocked"]),
          notes: z.array(z.string())
        })
      ),
      privacyNotice: z.string(),
      sharingPermissions: z.array(accountabilitySharedFieldSchema)
    })
    .optional()
});

export type CreateCommitmentDocumentInput = z.infer<typeof createCommitmentDocumentInputSchema>;
export type CommitmentDocumentActionResult = z.infer<typeof commitmentDocumentActionResultSchema>;
export type BasicCommitmentDocumentActionResult = ExecutionActionResult;

const abusiveConsequencePatterns = [
  /humilha/i,
  /vergonha/i,
  /exposi[cç][aã]o p[uú]blica/i,
  /castigo/i,
  /puni[cç][aã]o/i,
  /jejum/i,
  /agress[aã]o/i,
  /dano f[ií]sico/i,
  /multa/i,
  /perder dinheiro/i,
  /doar.*sal[aá]rio/i,
  /Deus.*decepcion/i,
  /falta de f[eé]/i
];

const rewardSabotagePatterns = [/virar a noite/i, /comer compuls/i, /gastar demais/i, /abandonar descanso/i, /pular sono/i];

export function validateCommitmentLever(
  type: CommitmentLeverType,
  description: string | undefined
): CommitmentLever | null {
  const trimmed = description?.trim();

  if (!trimmed) {
    return null;
  }

  const abusive = type === "restorative_consequence" && abusiveConsequencePatterns.some((pattern) => pattern.test(trimmed));
  const sabotagingReward = type !== "restorative_consequence" && rewardSabotagePatterns.some((pattern) => pattern.test(trimmed));
  const safety: CommitmentLeverSafety = abusive ? "blocked" : sabotagingReward ? "needs_review" : "safe";
  const notes = abusive
    ? ["Consequencia abusiva ou punitiva bloqueada. Use reparacao proporcional, aprendizado ou retomada."]
    : sabotagingReward
      ? ["Recompensa pode sabotar o alvo; revise antes de salvar."]
      : ["Alavanca proporcional e revisavel."];

  return {
    description: trimmed,
    notes,
    safety,
    type
  };
}

export function buildCommitmentDocumentDraft(input: CreateCommitmentDocumentInput): CommitmentDocumentDraft {
  const callingSummary = input.callingSummaryAuthorized && input.callingSummary?.trim() ? input.callingSummary.trim() : null;
  const sharingPermissions = input.sharingPermissions as AccountabilitySharedField[];
  const document = commitmentDocumentOutputSchema.parse({
    schema_version: "commitment_document_output_v1",
    accountability_partner: {
      email: input.partnerEmail,
      name: input.partnerName
    },
    calling_summary: callingSummary,
    commitment_statement: `${input.userName} se compromete a caminhar no alvo "${input.goalTitle}" com passos revisaveis, apoio consentido e responsabilidade sem humilhacao.`,
    deadline: input.deadline,
    first_action: input.firstAction,
    goal_id: input.goalId,
    linked_projects: input.linkedProjects,
    restorative_consequence: input.restorativeConsequence?.trim() || null,
    reward: input.reward?.trim() || null,
    scoreboard_items: input.scoreboardItems,
    sharing_permissions: sharingPermissions,
    supporting_habits: input.supportingHabits,
    title: `Compromisso - ${input.goalTitle}`,
    user_review_required: true
  });

  const levers = [
    validateCommitmentLever("progress_reward", input.reward),
    validateCommitmentLever("completion_reward", input.reward),
    validateCommitmentLever("restorative_consequence", input.restorativeConsequence)
  ].filter((lever): lever is CommitmentLever => Boolean(lever));

  return {
    document,
    levers,
    privacyNotice:
      "Revise antes de compartilhar. Chamado completo, Metacognicao, saude, familia, financas, emocoes e revisoes privadas ficam fora por padrao.",
    sharingPermissions
  };
}
