import type { GardenStateOutput, WeeklyReviewOutput } from "@/ai/schemas";
import { gardenStateOutputSchema, weeklyReviewOutputSchema } from "@/ai/schemas";
import { lifeGardenAreas, normalizeLifeAreaName } from "@/domain/garden";

import {
  sanitizeWeeklyReviewAnswersForPersistence,
  type WeeklyReviewAnswers
} from "./persistence";
import type { WeeklyReviewQuestion } from "./types";

export * from "./persistence";
export * from "./types";

export const weeklyReviewQuestions: WeeklyReviewQuestion[] = [
  {
    id: "advanced",
    label: "Avancos",
    prompt: "O que avancou nesta semana?",
    lowEnergyPrompt: "Uma pequena vitoria ja serve."
  },
  {
    id: "stuck",
    label: "Travamentos",
    prompt: "Onde voce travou ou evitou agir?",
    lowEnergyPrompt: "Nomeie uma trava sem se atacar."
  },
  {
    id: "completed",
    label: "Concluido",
    prompt: "O que foi concluido ou entregue?",
    lowEnergyPrompt: "Uma conclusao pequena conta."
  },
  {
    id: "postponed",
    label: "Adiado",
    prompt: "O que ficou para depois?",
    lowEnergyPrompt: "Liste somente o principal."
  },
  {
    id: "goalsProgressed",
    label: "Alvos",
    prompt: "Quais alvos caminharam?",
    lowEnergyPrompt: "Um alvo que moveu um pouco."
  },
  {
    id: "projectsPaused",
    label: "Projetos pausados",
    prompt: "Qual projeto ficou parado e por que?",
    lowEnergyPrompt: "Um projeto pausado."
  },
  {
    id: "habitsMaintained",
    label: "Habitos",
    prompt: "Quais habitos foram mantidos, ainda que no minimo?",
    lowEnergyPrompt: "Um habito minimo."
  },
  {
    id: "restarts",
    label: "Retomadas",
    prompt: "Onde voce retomou depois de cair ou pausar?",
    lowEnergyPrompt: "Uma retomada real."
  },
  {
    id: "excess",
    label: "Sobrecarga",
    prompt: "Onde houve excesso, agenda apertada ou energia baixa?",
    lowEnergyPrompt: "Um sinal de sobrecarga."
  },
  {
    id: "neglectedAreas",
    label: "Areas negligenciadas",
    prompt: "Que area da vida pediu cuidado?",
    lowEnergyPrompt: "Uma area para cuidar."
  },
  {
    id: "metacognition",
    label: "Metacognicao agregada",
    prompt: "Que padrao de pensamento apareceu, sem copiar conteudo privado bruto?",
    lowEnergyPrompt: "Um padrao redigido."
  },
  {
    id: "scoreboard",
    label: "Placar",
    prompt: "O que o Placar mostrou sobre constancia e retomada?",
    lowEnergyPrompt: "Um dado leve do Placar."
  },
  {
    id: "adjustments",
    label: "Ajustes",
    prompt: "Que ajuste simples ajudaria a proxima semana?",
    lowEnergyPrompt: "Um ajuste pequeno."
  },
  {
    id: "nextWeekFocus",
    label: "Foco da proxima semana",
    prompt: "Qual foco principal da proxima semana?",
    lowEnergyPrompt: "Um foco simples."
  },
  {
    id: "firstActionNextWeek",
    label: "Primeira acao",
    prompt: "Qual sera a primeira acao concreta?",
    lowEnergyPrompt: "Uma acao de 5 a 25 minutos."
  }
];

function listFromAnswer(value: string | undefined, fallback: string): string[] {
  const trimmed = value?.trim();
  return trimmed ? [trimmed] : [fallback];
}

function splitAreas(value: string | undefined): string[] {
  const normalizedValue = normalizeComparableText(value ?? "");
  const detectedAreas = lifeGardenAreas.filter((area) => {
    const normalizedArea = normalizeComparableText(area);
    return normalizedValue === normalizedArea || normalizedValue.includes(normalizedArea);
  });

  if (detectedAreas.length > 0) {
    return Array.from(new Set(detectedAreas));
  }

  const parts = value
    ?.split(/[,\n;]/)
    .flatMap((item) => {
      const cleaned = item.trim().replace(/[.!?]+$/g, "");
      if (!cleaned) return [];

      const direct = normalizeLifeAreaName(cleaned);
      if (direct !== cleaned || lifeGardenAreas.includes(direct)) {
        return [direct];
      }

      return cleaned
        .split(/\s+e\s+/i)
        .map((part) => normalizeLifeAreaName(part.trim().replace(/[.!?]+$/g, "")));
    })
    .filter(Boolean);

  return parts && parts.length > 0 ? Array.from(new Set(parts)) : ["Descanso"];
}

function normalizeComparableText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildWeeklyReviewMock(input: {
  answers: WeeklyReviewAnswers;
  christianReflectionEnabled?: boolean;
  weekStart: string;
  weekEnd: string;
}): WeeklyReviewOutput {
  const safeAnswers = sanitizeWeeklyReviewAnswersForPersistence(input.answers);
  const neglectedAreas = splitAreas(safeAnswers.neglectedAreas);
  const weekSummary = safeAnswers.advanced?.trim()
    ? `${safeAnswers.advanced.trim()} A revisao aponta ajustes simples para ${input.weekStart} a ${input.weekEnd}.`
    : "Semana revisada com foco em aprendizado, retomada e primeiro passo.";

  return weeklyReviewOutputSchema.parse({
    schema_version: "weekly_review_output_v1",
    week_summary: weekSummary,
    wins: listFromAnswer(safeAnswers.completed || safeAnswers.advanced, "Uma pequena vitoria foi reconhecida."),
    stuck_points: listFromAnswer(safeAnswers.stuck || safeAnswers.postponed, "Uma trava foi nomeada sem vergonha."),
    patterns: [
      {
        pattern: "Sobrecarga e escopo pedem calibragem",
        evidence: listFromAnswer(safeAnswers.excess || safeAnswers.stuck, "Sinal de excesso registrado."),
        impact: safeAnswers.excess?.trim() ? "medium" : "low",
        suggested_adjustment: safeAnswers.adjustments?.trim() || "Reduzir escopo e proteger uma pausa real."
      }
    ],
    overload_alerts: safeAnswers.excess?.trim() ? [safeAnswers.excess.trim()] : [],
    neglected_life_areas: neglectedAreas,
    restart_moments: safeAnswers.restarts?.trim() ? [safeAnswers.restarts.trim()] : ["Retomada pequena registrada."],
    metacognition_insights: safeAnswers.metacognition?.trim() ? [safeAnswers.metacognition.trim()] : [],
    scoreboard_insights: safeAnswers.scoreboard?.trim() ? [safeAnswers.scoreboard.trim()] : [],
    next_week_focus: safeAnswers.nextWeekFocus?.trim() || "Escolher uma acao essencial e proteger energia.",
    recommended_actions: listFromAnswer(safeAnswers.adjustments, "Escolher uma proxima acao pequena."),
    first_action_next_week: safeAnswers.firstActionNextWeek?.trim() || "Separar 10 minutos para a primeira acao.",
    encouragement: "Retomada conta como progresso real; ajuste sem culpa e siga com o primeiro passo.",
    christian_reflection: input.christianReflectionEnabled
      ? "Receba graca para recomecar sem culpa espiritual e agir com responsabilidade."
      : null,
    safety_notes: [
      "Sem diagnostico, sem culpa espiritual e sem compartilhamento automatico com Atalaia."
    ],
    user_review_required: true
  });
}

export function buildGardenStateFromWeeklyReview(review: WeeklyReviewOutput): GardenStateOutput {
  const neglected = new Set(review.neglected_life_areas.map((area) => normalizeLifeAreaName(area)));
  const lifeAreas = lifeGardenAreas.map((area) => {
    const careNeeded = neglected.has(area);
    const recentEvents = careNeeded
      ? ["Area pediu cuidado nesta revisao."]
      : review.wins.slice(0, 2);

    return {
      area,
      growth_level: careNeeded ? 2 : 4,
      recent_events: recentEvents.length > 0 ? recentEvents : ["Semana revisada."],
      care_needed: careNeeded,
      care_message: careNeeded
        ? `${area} pede cuidado simples, nao punicao.`
        : `${area} segue em cultivo com passos pequenos.`,
      visual_state: careNeeded ? "needs_care" : "growing"
    };
  });

  return gardenStateOutputSchema.parse({
    schema_version: "garden_state_output_v1",
    garden_state: {
      life_areas: lifeAreas,
      unlocked_items: ["Retomada visivel", "Cuidado sem culpa"],
      weekly_growth_summary: review.week_summary.slice(0, 180)
    }
  });
}
