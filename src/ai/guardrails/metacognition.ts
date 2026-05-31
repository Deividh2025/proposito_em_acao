import { buildGuardrailReview, findGuardrailMatches, type GuardrailMatch } from "./review";

const crisisChecks: GuardrailMatch[] = [
  {
    behavior: "crisis_as_productivity",
    reason: "Risco emocional grave deve sair do fluxo de produtividade e orientar ajuda humana.",
    pattern: /\b(nao aguento mais viver|quero morrer|me machucar|autoagress[aã]o|tirar minha vida)\b/i
  }
];

export function reviewMetacognitionGuardrails(text: string) {
  const matches = findGuardrailMatches(text, crisisChecks);
  const crisisDetected = matches.length > 0;

  return buildGuardrailReview(matches, {
    reviewedSchemaVersion: "metacognition_output_v1",
    crisisDetected,
    requiresHumanHelp: crisisDetected,
    safeToPersist: !crisisDetected,
    safeToShareWithAccountability: false,
    nextSafeStep: crisisDetected
      ? "Interromper fluxo de produtividade e orientar ajuda humana adequada."
      : "Manter separacao entre fato, interpretacao, sentimento e impulso."
  });
}
