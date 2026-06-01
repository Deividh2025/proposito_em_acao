import type { InboxClassificationOutput } from "@/ai/schemas";

import type { InboxItem, ProcessInboxItemInput } from "./types";

export * from "./types";

export const sampleInboxItems: InboxItem[] = [
  {
    id: "inbox-finances",
    content: "Agendar revisao financeira sexta as 9h e separar 25 minutos",
    contentType: "text",
    status: "captured",
    createdAt: "2026-06-01T08:20:00-03:00"
  },
  {
    id: "inbox-reference",
    content: "Guardar artigo sobre descanso e foco para ler depois",
    contentType: "link",
    status: "triaged",
    classification: {
      schema_version: "inbox_classification_output_v1",
      classification: "reference",
      confidence: "medium",
      suggested_title: "Artigo sobre descanso e foco",
      summary: "Material para consulta futura, sem exigir acao imediata.",
      recommended_action: "archive",
      life_area: "saude",
      estimated_minutes: null,
      energy_level: "low",
      due_date_suggestion: null,
      clarifying_question: null,
      safety_note: "Arquivar como referencia privada.",
      user_review_required: true
    },
    createdAt: "2026-06-01T08:10:00-03:00"
  }
];

function titleFromContent(content: string) {
  const clean = content.trim().replace(/\s+/g, " ");
  return clean.length > 58 ? `${clean.slice(0, 55).trimEnd()}...` : clean || "Captura sem titulo";
}

function inferEstimatedMinutes(content: string) {
  const match = content.match(/(\d{1,3})\s*(min|minutos?)/i);
  return match?.[1] ? Number(match[1]) : null;
}

export function buildInboxClassificationMock(content: string): InboxClassificationOutput {
  const normalized = content.toLowerCase();
  const estimatedMinutes = inferEstimatedMinutes(content);
  const isCalendar = /agendar|agenda|sexta|segunda|terça|terca|quarta|quinta|sabado|sábado|domingo|\d{1,2}h/.test(
    normalized
  );
  const isConcern = /preocup|ansios|medo|rumin|trav/.test(normalized);
  const isProject = /projeto|planejar|criar plano|organizar todo/.test(normalized);
  const isHabit = /hábito|habito|rotina|todo dia|diario|diário/.test(normalized);
  const isReference = /artigo|link|refer[eê]ncia|guardar|ler depois/.test(normalized);

  if (isCalendar) {
    return {
      schema_version: "inbox_classification_output_v1",
      classification: "calendar_event",
      confidence: "high",
      suggested_title: titleFromContent(content),
      summary: "A captura indica um compromisso ou bloco que precisa entrar no calendario.",
      recommended_action: "schedule",
      life_area: normalized.includes("finance") ? "financas" : null,
      estimated_minutes: estimatedMinutes ?? 25,
      energy_level: "medium",
      due_date_suggestion: normalized.includes("sexta") ? "proxima sexta-feira" : null,
      clarifying_question: null,
      safety_note: "Revisar horario antes de salvar no calendario.",
      user_review_required: true
    };
  }

  if (isConcern) {
    return {
      schema_version: "inbox_classification_output_v1",
      classification: "concern",
      confidence: "medium",
      suggested_title: titleFromContent(content),
      summary: "A captura parece uma preocupacao ou ruminação, nao apenas uma tarefa.",
      recommended_action: "reflect",
      life_area: null,
      estimated_minutes: null,
      energy_level: "low",
      due_date_suggestion: null,
      clarifying_question: "Isso precisa virar acao concreta ou apenas ser observado com cuidado?",
      safety_note: "Metacognicao funcional fica para etapa futura; manter privado por padrao.",
      user_review_required: true
    };
  }

  if (isProject) {
    return {
      schema_version: "inbox_classification_output_v1",
      classification: "project",
      confidence: "medium",
      suggested_title: titleFromContent(content),
      summary: "A captura parece grande demais para uma tarefa unica.",
      recommended_action: "create_project",
      life_area: null,
      estimated_minutes: estimatedMinutes,
      energy_level: "medium",
      due_date_suggestion: null,
      clarifying_question: null,
      safety_note: "Criar projeto apenas apos revisao do usuario.",
      user_review_required: true
    };
  }

  if (isHabit) {
    return {
      schema_version: "inbox_classification_output_v1",
      classification: "habit",
      confidence: "medium",
      suggested_title: titleFromContent(content),
      summary: "A captura parece um habito futuro, nao uma tarefa para agora.",
      recommended_action: "create_habit",
      life_area: "saude",
      estimated_minutes: estimatedMinutes,
      energy_level: "low",
      due_date_suggestion: null,
      clarifying_question: null,
      safety_note: "Habitos funcionais permanecem fora deste prompt; guardar como futuro.",
      user_review_required: true
    };
  }

  if (isReference) {
    return {
      schema_version: "inbox_classification_output_v1",
      classification: "reference",
      confidence: "medium",
      suggested_title: titleFromContent(content),
      summary: "A captura parece material de referencia para consulta futura.",
      recommended_action: "archive",
      life_area: null,
      estimated_minutes: null,
      energy_level: "low",
      due_date_suggestion: null,
      clarifying_question: null,
      safety_note: "Arquivar sem expor conteudo bruto.",
      user_review_required: true
    };
  }

  return {
    schema_version: "inbox_classification_output_v1",
    classification: "task",
    confidence: "medium",
    suggested_title: titleFromContent(content),
    summary: "A captura parece uma tarefa simples que precisa de proxima acao.",
    recommended_action: "create_task",
    life_area: null,
    estimated_minutes: estimatedMinutes ?? 15,
    energy_level: "medium",
    due_date_suggestion: null,
    clarifying_question: null,
    safety_note: "Revisar antes de criar tarefa.",
    user_review_required: true
  };
}

export function processInboxItem(item: InboxItem, input: ProcessInboxItemInput): InboxItem {
  const statusByDestination = {
    task: "converted",
    project: "converted",
    calendar_event: "converted",
    habit: "triaged",
    reference: "archived",
    future_idea: "archived",
    discard: "discarded",
    needs_clarification: "triaged"
  } satisfies Record<ProcessInboxItemInput["destinationType"], InboxItem["status"]>;

  return {
    ...item,
    status: statusByDestination[input.destinationType],
    destinationType: input.destinationType,
    destinationId: input.destinationId,
    processingNote: input.note ?? "Processado em lote curto e revisavel."
  };
}
