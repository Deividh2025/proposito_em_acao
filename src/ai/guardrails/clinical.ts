import { buildGuardrailReview, findGuardrailMatches, type GuardrailMatch } from "./review";

const clinicalChecks: GuardrailMatch[] = [
  {
    behavior: "diagnosis",
    reason: "A IA nao deve diagnosticar condicoes clinicas.",
    pattern: /\b(voce tem\s+(tdah|depress[aã]o|ansiedade|trauma|transtorno)|isso prova que eu tenho|prova que eu tenho|diagnostico|diagnosticar|me diagnostique|tenho\s+(tdah|depress[aã]o|transtorno))\b/i
  },
  {
    behavior: "therapy_replacement",
    reason: "A IA nao deve substituir terapia, medicina ou ajuda humana adequada.",
    pattern: /\b(nao precisa procurar ajuda|nao procure ajuda|nao procurar ajuda|sem procurar ajuda|basta ser mais produtivo|substitui terapia|nao precisa de terapia|sem ajuda humana)\b/i
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
