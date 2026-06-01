import type { ScoreboardPlanOutput } from "@/ai/schemas";

import type { generateScoreboardPlanInputSchema } from "./persistence";
import type { ScoreboardEntryStatus } from "./types";
import type { z } from "zod";

export * from "./types";
export * from "./persistence";

type ScoreboardPlanInput = z.infer<typeof generateScoreboardPlanInputSchema>;

export function buildScoreboardPlanMock(input: ScoreboardPlanInput): ScoreboardPlanOutput {
  const items = [
    input.includeHabits
      ? {
          title: "Habito minimo de hoje",
          type: "habit" as const,
          target_frequency: "diario ou conforme frequencia escolhida",
          minimum_success: "fazer a versao minima",
          linked_goal_id: null,
          linked_habit_id: null,
          linked_task_id: null
        }
      : null,
    input.includeFocus
      ? {
          title: "Sessao de foco honesta",
          type: "focus" as const,
          target_frequency: "quando houver tarefa importante",
          minimum_success: "5 minutos com distracoes capturadas",
          linked_goal_id: null,
          linked_habit_id: null,
          linked_task_id: null
        }
      : null,
    input.includeRestarts
      ? {
          title: "Retomada sem culpa",
          type: "restart" as const,
          target_frequency: "sempre que houver queda ou pausa",
          minimum_success: "voltar com uma microacao",
          linked_goal_id: null,
          linked_habit_id: null,
          linked_task_id: null
        }
      : null
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    schema_version: "scoreboard_plan_output_v1",
    scoreboard_title: `Placar leve - ${input.focus}`,
    period: input.period,
    items,
    restart_tracking: true,
    visual_guidance: "Usar marcacoes suaves, sem vermelho agressivo e sem streak quebrado como derrota.",
    risk_notes: [
      "nao transformar falha em identidade",
      "nao compartilhar com Atalaia nesta etapa",
      "revisar pesos se o Placar gerar pressao"
    ],
    user_review_required: true
  };
}

export function scoreboardStatusValue(status: ScoreboardEntryStatus) {
  const values: Record<ScoreboardEntryStatus, number> = {
    done: 1,
    partial: 0.5,
    not_done: 0,
    restarted: 1,
    paused_consciously: 0.25
  };

  return values[status];
}
