import type { HabitPlanOutput } from "@/ai/schemas";

import type { createHabitPlanInputSchema } from "./persistence";
import type { z } from "zod";

export * from "./types";
export * from "./persistence";

type HabitPlanInput = z.infer<typeof createHabitPlanInputSchema>;

export function buildHabitPlanMock(input: HabitPlanInput): HabitPlanOutput {
  const minimum = input.frequency === "daily" ? "2 minutos" : "uma vez pequena no contexto escolhido";
  const title = input.desiredHabit.replace(/\s+/g, " ").trim();

  return {
    schema_version: "habit_plan_output_v1",
    habit_title: title,
    identity_statement: `Sou uma pessoa que volta para ${title.toLowerCase()} em escala honesta.`,
    why_it_matters: `${input.reason}. O plano comeca pequeno para preservar constancia, energia e retomada.`,
    life_area: input.lifeArea,
    trigger: `Depois de ${input.bestContext}, iniciar a versao minima.`,
    minimum_version: `Fazer ${minimum} de ${title.toLowerCase()}.`,
    ideal_version: `Fazer ${title.toLowerCase()} pelo tempo planejado quando houver energia.`,
    frequency: input.frequency,
    schedule_suggestion: input.frequency === "daily" ? "Ancorar em um horario recorrente simples." : "Reservar um bloco revisavel no calendario.",
    reward: "Registrar a pequena vitoria e encerrar sem aumentar a meta no mesmo dia.",
    likely_obstacle: input.likelyDifficulty,
    if_then_plan: `Se ${input.likelyDifficulty.toLowerCase()}, entao reduzir para a versao minima e marcar retomada.`,
    environment_design: `Deixar o primeiro recurso visivel no contexto: ${input.bestContext}. Remover uma friccao antes de comecar.`,
    metric: "marcacao de minimo, ideal ou retomada",
    scoreboard_items: [`Minimo de ${title}`, `Retomada de ${title}`],
    restart_plan: "Se falhar, voltar no proximo contexto com a versao minima, sem compensar com excesso.",
    risk_of_overload: input.likelyDifficulty.length > 80 ? "medium" : "low",
    adjustments: [
      "reduzir tempo antes de aumentar intensidade",
      "manter pausa consciente como escolha valida",
      "revisar frequencia se houver tres dias de atrito"
    ],
    user_review_required: true
  };
}
