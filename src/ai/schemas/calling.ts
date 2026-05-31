import { z } from "zod";

import type { CallingAnswers } from "@/domain/onboarding";

const confidenceLevelSchema = z.enum(["low", "medium", "high"]);

export const callingDraftSchema = z.object({
  schema_version: z.literal("calling_draft_v1").default("calling_draft_v1"),
  status_suggestion: z.enum(["draft", "in_discernment"]).default("in_discernment"),
  user_review_required: z.literal(true).default(true),
  calling_hypothesis: z.string().min(10),
  direction_statement: z.string().min(10),
  core_values: z.array(z.string().min(1)).min(1).max(6),
  recurring_burdens: z.array(z.string().min(1)).min(1).max(6),
  people_to_serve: z.array(z.string().min(1)).min(1).max(6),
  gifts_and_inclinations: z.array(z.string().min(1)).min(1).max(6),
  life_map_observations: z.array(z.string().min(1)).default([]),
  alignment_notes: z.array(z.string().min(1)).default([]),
  risks_or_imbalances: z.array(z.string().min(1)).default([]),
  suggested_next_steps: z.array(z.string().min(1)).min(1).max(3),
  confidence_level: confidenceLevelSchema,
  pastoral_safety_note: z.string().min(10)
});

export type CallingDraft = z.infer<typeof callingDraftSchema>;

export type CallingMockInput = {
  answers: Partial<CallingAnswers>;
  lifeMapObservations?: string[];
};

const unsafePatterns = [
  {
    key: "specific_divine_will_claim",
    pattern: /deus\s+(quer|mandou|ordenou|exige)\s+que/i
  },
  {
    key: "absolute_certainty",
    pattern: /certeza absoluta|sem duvida nenhuma|unica opcao/i
  },
  {
    key: "diagnosis",
    pattern: /voce tem tdah|diagnostico|transtorno/i
  },
  {
    key: "spiritual_guilt",
    pattern: /se voce nao fizer|falta de fe|decepcionando deus/i
  }
] as const;

function splitList(value: string | undefined, fallback: string[]) {
  if (!value?.trim()) {
    return fallback;
  }

  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export function buildCallingMockDraft({
  answers,
  lifeMapObservations = []
}: CallingMockInput): CallingDraft {
  const burdens = splitList(answers.world_burden ?? answers.pain_to_solve, [
    "transformar inquietacoes em servico concreto"
  ]);
  const people = splitList(answers.people_to_serve, ["pessoas proximas que precisam de direcao"]);
  const gifts = splitList(answers.gifts, ["escuta", "organizacao pratica", "aprendizado continuo"]);
  const values = splitList(answers.core_values, ["fidelidade", "servico", "responsabilidade"]);

  const serviceTarget = people[0]?.toLowerCase() ?? "pessoas proximas";
  const burden = burdens[0]?.toLowerCase() ?? "uma dor recorrente";
  const gift = gifts[0]?.toLowerCase() ?? "seus dons";

  const hasCentralAnswers = Boolean(
    answers.world_burden?.trim() && answers.people_to_serve?.trim() && answers.gifts?.trim()
  );

  return callingDraftSchema.parse({
    schema_version: "calling_draft_v1",
    status_suggestion: "in_discernment",
    user_review_required: true,
    calling_hypothesis: `A luz do que voce compartilhou, isso pode indicar uma direcao a discernir: servir ${serviceTarget}, enfrentando ${burden}, com ${gift} e constancia pratica.`,
    direction_statement: `Discernir e praticar uma vida que transforme ${burden} em servico concreto para ${serviceTarget}.`,
    core_values: values,
    recurring_burdens: burdens,
    people_to_serve: people,
    gifts_and_inclinations: gifts,
    life_map_observations: lifeMapObservations,
    alignment_notes: [
      "Esta hipotese deve ser revisada com tempo, pratica, oracao/reflexao e conselho maduro.",
      "O Chamado aqui funciona como direcao provisoria, nao como sentenca final."
    ],
    risks_or_imbalances: [
      "Evite transformar uma dor real em sobrecarga imediata.",
      "Proteja descanso, saude, familia e responsabilidades ja existentes."
    ],
    suggested_next_steps: [
      "Editar a frase para que ela soe verdadeira e humana.",
      "Escolher uma conversa, leitura ou pequena experiencia de validacao.",
      "Revisar esta hipotese antes de criar alvos completos."
    ],
    confidence_level: hasCentralAnswers ? "medium" : "low",
    pastoral_safety_note:
      "Esta e uma hipotese de discernimento. Ela pode amadurecer com oracao, sabedoria, comunidade e pratica, sem afirmar vontade divina especifica."
  });
}

export function reviewCallingDraftSafety(draft: CallingDraft) {
  const text = [
    draft.calling_hypothesis,
    draft.direction_statement,
    draft.pastoral_safety_note,
    ...draft.alignment_notes,
    ...draft.risks_or_imbalances,
    ...draft.suggested_next_steps
  ].join(" ");

  const blockedReasons = unsafePatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ key }) => key);

  return {
    allowed: blockedReasons.length === 0,
    blockedReasons,
    requiresHumanHelp: false,
    sensitiveCategories: [
      "faith",
      "calling",
      "life_direction",
      "family",
      "health_energy",
      "emotions",
      "finances"
    ],
    nextSafeStep:
      blockedReasons.length === 0
        ? "Permitir revisao humana antes de salvar a hipotese."
        : "Reformular usando linguagem de hipotese, cuidado e discernimento."
  };
}
