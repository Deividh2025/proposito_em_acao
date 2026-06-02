import { z } from "zod";

import { betaFeedbackModules, type BetaFeedbackDraft } from "./types";

export * from "./types";

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
  /\bsenha\b/i,
  /\btoken\b/i,
  /\bchave\b/i,
  /\bcpf\b/i,
  /\bcart[aã]o\b/i,
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

export function detectSensitiveFeedbackHint(text = "") {
  return sensitiveFeedbackHints.some((pattern) => pattern.test(text));
}

export function buildFeedbackDraft(input: BetaFeedbackInput): BetaFeedbackDraft {
  const parsed = betaFeedbackInputSchema.parse(input);
  const textForReview = [parsed.worked, parsed.confused, parsed.blocked, parsed.comment ?? ""].join(" ");
  const hasSensitiveHint = detectSensitiveFeedbackHint(textForReview);

  return {
    mode: "local-draft",
    module: parsed.module,
    hasSensitiveHint,
    message: hasSensitiveHint
      ? "Feedback preparado em modo beta/local. Revise e remova dados sensiveis antes de qualquer envio externo."
      : "Feedback preparado em modo beta/local. O envio externo depende do formulario/canal aprovado para o beta."
  };
}
