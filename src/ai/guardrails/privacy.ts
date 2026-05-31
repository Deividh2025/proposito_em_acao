import { buildGuardrailReview, type GuardrailMatch } from "./review";

const sensitiveCategoryChecks = [
  { field: "raw_prompt", pattern: /\b(prompt bruto|prompt privado)\b/i },
  { field: "raw_response", pattern: /\b(resposta bruta|resposta completa)\b/i },
  { field: "metacognition", pattern: /\b(metacogni[cç][aã]o|pensamento automatico|impulso)\b/i },
  { field: "calling_full", pattern: /\b(chamado completo|hipotese de chamado)\b/i },
  { field: "health", pattern: /\b(saude|sono|energia|tdah|depress[aã]o|ansiedade)\b/i },
  { field: "family", pattern: /\b(familia|relacionamento|filho|casamento)\b/i },
  { field: "finances", pattern: /\b(financas|financeiro|dinheiro|divida)\b/i },
  { field: "emotions", pattern: /\b(emocao|emo[cç][oõ]es|culpa|medo|vergonha)\b/i }
] as const;

export function reviewPrivacyGuardrails(text: string) {
  const redactedFields = sensitiveCategoryChecks
    .filter((check) => check.pattern.test(text))
    .map((check) => check.field);
  const matches: GuardrailMatch[] =
    redactedFields.length === 0
      ? []
      : [
          {
            behavior: "unconsented_private_sharing",
            reason: "Conteudo sensivel exige minimizacao, consentimento e redacao antes de log ou compartilhamento.",
            pattern: /./
          }
        ];

  return buildGuardrailReview(matches, {
    reviewedSchemaVersion: "privacy_text_v1",
    redactedFields,
    safeToPersist: redactedFields.length === 0,
    safeToShareWithAccountability: false,
    nextSafeStep:
      redactedFields.length === 0
        ? "Registrar apenas metadados tecnicos minimos."
        : "Remover conteudo sensivel bruto e manter somente metadados minimos."
  });
}
