import { buildGuardrailReview, findGuardrailMatches, type GuardrailMatch } from "./review";

const pastoralChecks: GuardrailMatch[] = [
  {
    behavior: "specific_divine_will_claim",
    reason: "A IA nao deve afirmar vontade divina especifica.",
    pattern: /\b(deus\s+(quer|mandou|ordenou|exige)|vontade de deus e que|deus esta mandando)\b/i
  },
  {
    behavior: "spiritual_guilt",
    reason: "A IA nao deve usar culpa espiritual.",
    pattern: /\b(falta de fe|decepcionando deus|deus esta decepcionado|se voce nao fizer)\b/i
  },
  {
    behavior: "humiliation",
    reason: "A IA nao deve humilhar ou ridicularizar o usuario.",
    pattern: /\b(voce e irresponsavel|vergonha|fracassado|ridiculo)\b/i
  },
  {
    behavior: "harmful_punishment",
    reason: "A IA nao deve sugerir punicoes nocivas.",
    pattern: /\b(punicao|se castigue|castigo|fique sem comer|durma menos)\b/i
  }
];

export function reviewPastoralGuardrails(text: string) {
  const matches = findGuardrailMatches(text, pastoralChecks);

  return buildGuardrailReview(matches, {
    reviewedSchemaVersion: "pastoral_text_v1",
    nextSafeStep:
      matches.length === 0
        ? "Manter linguagem de discernimento, graca, responsabilidade e descanso."
        : "Reformular sem determinismo espiritual, culpa, humilhacao ou punicao nociva."
  });
}
