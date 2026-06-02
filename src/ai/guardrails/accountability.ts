import { buildGuardrailReview, findGuardrailMatches, type GuardrailMatch } from "./review";

export type AccountabilityGuardrailInput = {
  text: string;
  hasExplicitConsent: boolean;
  allowedScopes: string[];
};

const privateSharingChecks: GuardrailMatch[] = [
  {
    behavior: "unconsented_private_sharing",
    reason: "Atalaia nao pode receber dados privados sem consentimento explicito e escopo por alvo.",
    pattern:
      /\b(metacogni[cç][aã]o|chamado completo|sa[uú]de|fam[ií]lia|finan[cç]as|emo[cç][oõ]es|revis[aã]o privada|revis[aã]o semanal|inbox|caixa de entrada|calend[aá]rio completo|agenda completa|distrac[oõ]es?|pensamento bruto|prompt bruto)\b/i
  }
];

export function reviewAccountabilityGuardrails({
  text,
  hasExplicitConsent,
  allowedScopes
}: AccountabilityGuardrailInput) {
  const matches = findGuardrailMatches(text, privateSharingChecks);
  const hasUsefulScope = allowedScopes.length > 0 && !allowedScopes.includes("account");

  return buildGuardrailReview(matches, {
    reviewedSchemaVersion: "accountability_message_output_v1",
    safeToPersist: matches.length === 0,
    safeToShareWithAccountability: matches.length === 0 && hasExplicitConsent && hasUsefulScope,
    nextSafeStep:
      matches.length === 0 && hasExplicitConsent && hasUsefulScope
        ? "Mostrar previa ao usuario antes de qualquer envio ao Atalaia."
        : "Bloquear envio externo ate haver consentimento granular, escopo por alvo e previa clara."
  });
}
