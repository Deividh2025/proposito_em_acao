import type { SmartGoalOutput } from "@/ai/schemas";

export * from "./types";

export type BuildSmartGoalMockDraftInput = {
  desire: string;
  callingSummary?: string;
  lifeArea?: string;
  lifeMapWarnings?: string[];
};

const defaultProtectedAreas = ["fe", "saude", "familia", "descanso", "financas"];

function normalizeTitle(desire: string) {
  const clean = desire.trim().replace(/[.!?]+$/g, "");

  if (!clean) {
    return "Alvo SMART-E em rascunho";
  }

  return clean.length > 70 ? clean.slice(0, 67).trimEnd() + "..." : clean;
}

function inferLifeArea(desire: string, lifeArea?: string) {
  if (lifeArea?.trim()) {
    return lifeArea.trim();
  }

  const normalized = desire.toLowerCase();

  if (normalized.includes("finance")) {
    return "financas";
  }

  if (normalized.includes("saude") || normalized.includes("sono") || normalized.includes("energia")) {
    return "saude";
  }

  if (normalized.includes("famil")) {
    return "familia";
  }

  if (normalized.includes("serv")) {
    return "servico";
  }

  return "execucao";
}

export function buildSmartGoalMockDraft(input: BuildSmartGoalMockDraftInput): SmartGoalOutput {
  const title = normalizeTitle(input.desire);
  const lifeArea = inferLifeArea(input.desire, input.lifeArea);
  const protectedAreas = Array.from(new Set([...defaultProtectedAreas, ...(input.lifeMapWarnings ?? [])]));
  const callingSummary = input.callingSummary?.trim();
  const hasCallingContext = Boolean(callingSummary);

  return {
    schema_version: "smart_goal_output_v1",
    title,
    status: "needs_review",
    life_area: lifeArea,
    specific: `Transformar "${title}" em uma acao concreta, pequena e revisavel dentro da area ${lifeArea}.`,
    measurable: "Definir uma metrica simples de progresso semanal e revisar uma vez por semana.",
    achievable: "Comecar por uma versao minima que cabe em ate 25 minutos e pode ser reduzida em dia de baixa energia.",
    relevant: hasCallingContext
      ? `O alvo apoia a direcao atual: ${callingSummary}`
      : "O alvo permanece em rascunho ate ser comparado com uma hipotese de Chamado revisada.",
    timebound: "Executar a primeira acao hoje e revisar o alvo em ate 30 dias.",
    ecological_analysis: {
      risks: ["Exagerar o escopo e sacrificar descanso ou responsabilidades importantes."],
      protected_areas: protectedAreas,
      adjustments: ["Manter primeira acao curta.", "Revisar impacto em familia, saude, descanso e financas."],
      is_ecologically_safe: true
    },
    calling_alignment: {
      alignment_level: hasCallingContext ? "high" : "medium",
      explanation: hasCallingContext
        ? "Ha relacao clara com a direcao informada, mas o usuario ainda precisa revisar antes de salvar."
        : "Sem Chamado revisado, o alinhamento fica provisoriamente medio e exige revisao humana.",
      concerns: hasCallingContext ? [] : ["Falta contexto suficiente do Chamado para afirmar alto alinhamento."]
    },
    first_action:
      lifeArea === "financas"
        ? "Abrir o extrato bancario e listar apenas as contas fixas dos proximos 7 dias."
        : `Escolher uma microacao de 10 minutos relacionada a "${title}" e registrar o que foi feito.`,
    suggested_projects: [`Projeto inicial para ${title}`],
    confidence_level: hasCallingContext ? "high" : "medium",
    assumptions: ["Mock seguro e deterministico; nenhum dado foi enviado para OpenAI."],
    overload_warning: null,
    user_review_required: true
  };
}
