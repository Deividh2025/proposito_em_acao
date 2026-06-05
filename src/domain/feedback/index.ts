import { z } from "zod";

import {
  betaFeedbackModules,
  type BetaFeedbackDraft,
  type BetaFeedbackPersistenceResult
} from "./types";

export * from "./types";

export const BETA_FEEDBACK_CONSENT_VERSION = "beta_feedback_v1";
export const BETA_FEEDBACK_RETENTION_DAYS = 90;

const scoreSchema = z.coerce.number().int().min(1).max(5);

const feedbackTextSchema = z.string().trim().min(2).max(500);

export const betaFeedbackInputSchema = z
  .object({
    module: z.enum(betaFeedbackModules),
    worked: feedbackTextSchema,
    confused: feedbackTextSchema,
    blocked: feedbackTextSchema,
    clarityScore: scoreSchema,
    usefulnessScore: scoreSchema,
    frictionScore: scoreSchema,
    comment: z.string().trim().max(800).optional()
  })
  .strict();

export type BetaFeedbackInput = z.input<typeof betaFeedbackInputSchema>;
export type BetaFeedback = z.infer<typeof betaFeedbackInputSchema>;

const sensitiveFeedbackHints = [
  /\bpassword\b/i,
  /\bsecret\b/i,
  /\bbearer\s+[a-z0-9._~+/=-]{12,}\b/i,
  /\beyj[a-z0-9_-]{10,}\.[a-z0-9_-]{10,}\.[a-z0-9_-]{10,}\b/i,
  /-----begin [a-z ]+private key-----/i,
  /\bcartao\b/i,
  /\bconta bancaria\b/i,
  /\bpostgres(?:ql)?:\/\/\S+:\S+@\S+/i,
  /\bhttps?:\/\/\S+/i,
  /\bwww\.\S+/i,
  /\bdiagnostico\b/i,
  /\bremedio\b/i,
  /\bmedicacao\b/i,
  /\bminha familia\b/i,
  /\b(stack trace|traceback|authorization|cookie|payload bruto|raw payload)\b/i,
  /\bat\s+\S+\s*\(.+:\d+:\d+\)/i,
  /\bsenha\b/i,
  /\btoken\b/i,
  /\bchave\b/i,
  /\bapi[-_\s]?key\b/i,
  /\bcpf\b/i,
  /\bcart[aã]o\b/i,
  /\bhttps?:\/\/\S*(token|key|secret|code)=/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\bexames?\b/i,
  /\bdiagn[oó]stico\b/i,
  /\brem[eé]dio\b/i,
  /\bmedica[cç][aã]o\b/i,
  /\btrauma\b/i,
  /\bconta banc[aá]ria\b/i,
  /\bmeu chamado\b/i,
  /\bminha fam[ií]lia\b/i,
  /\bpensamento privado\b/i
];

type BetaFeedbackPersistenceInput = {
  consentGranted: boolean;
  noticeAccepted?: boolean;
  consentVersion?: string | null;
  input: BetaFeedbackInput;
  retentionDays?: number;
  submittedAt?: string;
};

function normalizeForSensitiveScan(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function detectSensitiveFeedbackHint(text = "") {
  const normalized = normalizeForSensitiveScan(text);

  return sensitiveFeedbackHints.some((pattern) => pattern.test(text) || pattern.test(normalized));
}

function normalizeFreeText(value: string, maxLength: number) {
  return value
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function addRetentionDays(submittedAt: string, retentionDays: number) {
  const parsed = new Date(submittedAt);
  const baseTime = Number.isFinite(parsed.getTime()) ? parsed.getTime() : Date.now();

  return new Date(baseTime + retentionDays * 24 * 60 * 60 * 1000).toISOString();
}

export function buildFeedbackDraft(input: BetaFeedbackInput): BetaFeedbackDraft {
  const parsed = betaFeedbackInputSchema.parse(input);
  const textForReview = [parsed.worked, parsed.confused, parsed.blocked, parsed.comment ?? ""].join(
    " "
  );
  const hasSensitiveHint = detectSensitiveFeedbackHint(textForReview);

  return {
    mode: "local-draft",
    module: parsed.module,
    hasSensitiveHint,
    message: hasSensitiveHint
      ? "Rascunho local/dev preparado. Nada foi enviado para canal externo. Revise e remova dados sensiveis antes de qualquer envio externo aprovado."
      : "Rascunho local/dev preparado. Nada foi enviado para canal externo. Envio externo depende do formulario/canal aprovado para o beta."
  };
}

export function prepareBetaFeedbackForPersistence({
  consentGranted,
  consentVersion = BETA_FEEDBACK_CONSENT_VERSION,
  input,
  noticeAccepted = false,
  retentionDays = BETA_FEEDBACK_RETENTION_DAYS,
  submittedAt
}: BetaFeedbackPersistenceInput): BetaFeedbackPersistenceResult {
  if (!consentGranted || !noticeAccepted || !consentVersion) {
    return {
      feedback: null,
      message:
        "Feedback nao foi salvo porque o aviso/consentimento explicito do beta esta ausente ou revogado.",
      ok: false,
      reason: "missing_consent"
    };
  }

  const parsedResult = betaFeedbackInputSchema.safeParse(input);

  if (!parsedResult.success) {
    return {
      feedback: null,
      message: "Revise os campos curtos e notas de 1 a 5 antes de enviar.",
      ok: false,
      reason: "validation_error"
    };
  }

  const parsed = parsedResult.data;
  const textForReview = [parsed.worked, parsed.confused, parsed.blocked, parsed.comment ?? ""].join(
    " "
  );

  if (detectSensitiveFeedbackHint(textForReview)) {
    return {
      feedback: null,
      message:
        "Feedback nao foi salvo porque parece conter dado sensivel, token, link privado ou payload tecnico bruto. Remova esses dados e tente novamente.",
      ok: false,
      reason: "sensitive_hint"
    };
  }

  const effectiveSubmittedAt = submittedAt ?? new Date().toISOString();

  return {
    feedback: {
      blocked: normalizeFreeText(parsed.blocked, 500),
      clarityScore: parsed.clarityScore,
      comment: parsed.comment ? normalizeFreeText(parsed.comment, 800) : null,
      confused: normalizeFreeText(parsed.confused, 500),
      consentVersion,
      expiresAt: addRetentionDays(effectiveSubmittedAt, retentionDays),
      frictionScore: parsed.frictionScore,
      module: parsed.module,
      noticeAccepted: true,
      submittedAt: effectiveSubmittedAt,
      usefulnessScore: parsed.usefulnessScore,
      worked: normalizeFreeText(parsed.worked, 500)
    },
    message:
      "Feedback beta validado para persistencia first-party. Nenhum dado deve ser enviado para analytics ou ferramenta externa.",
    ok: true,
    reason: null
  };
}
