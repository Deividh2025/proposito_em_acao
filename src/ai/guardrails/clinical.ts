import { buildGuardrailReview, findGuardrailMatches, type GuardrailMatch } from "./review";

const clinicalChecks: GuardrailMatch[] = [
  {
    behavior: "diagnosis",
    reason: "A IA nao deve diagnosticar condicoes clinicas.",
    pattern: /\b(voce tem|diagnostico|diagnosticar|tdah|depress[aã]o|ansiedade|trauma|transtorno)\b/i
  },
  {
    behavior: "therapy_replacement",
    reason: "A IA nao deve substituir terapia, medicina ou ajuda humana adequada.",
    pattern: /\b(nao precisa procurar ajuda|nao procure ajuda|basta ser mais produtivo|substitui terapia|sem ajuda humana)\b/i
  }
];

export function reviewClinicalGuardrails(text: string) {
  const matches = findGuardrailMatches(text, clinicalChecks);

  return buildGuardrailReview(matches, {
    reviewedSchemaVersion: "clinical_text_v1",
    nextSafeStep:
      matches.length === 0
        ? "Manter linguagem nao diagnostica e recomendar ajuda humana quando necessario."
        : "Remover diagnostico/substituicao clinica e orientar ajuda humana adequada."
  });
}
