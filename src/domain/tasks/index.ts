import type { TaskBreakdownOutput } from "@/ai/schemas";

import type { EnergyLevel, MicrotaskStatus, TaskStatus } from "./types";

export * from "./types";

export type BreakTaskIntoMicrotasksInput = {
  title: string;
  reason: string;
  estimatedMinutes: number;
  energyLevel: EnergyLevel;
};

export type ExecutionTaskSummary = {
  id: string;
  status: TaskStatus;
  nextAction?: string | null;
};

export type ExecutionMicrotaskSummary = {
  id: string;
  taskId: string;
  status: MicrotaskStatus;
};

export function breakTaskIntoMicrotasks(input: BreakTaskIntoMicrotasksInput): TaskBreakdownOutput {
  const isFinanceTask = input.title.toLowerCase().includes("finan");
  const microtasks = isFinanceTask
    ? [
        "Abrir extrato",
        "Listar contas fixas",
        "Listar dividas",
        "Separar gastos por categoria",
        "Definir primeira conta a quitar",
        "Agendar revisao financeira semanal"
      ]
    : [
        "Abrir o contexto da tarefa",
        "Listar o resultado minimo esperado",
        "Executar uma parte por ate dez minutos",
        "Registrar o proximo passo"
      ];

  return {
    schema_version: "task_breakdown_output_v1",
    task_title: input.title,
    reason: input.reason,
    estimated_minutes: input.estimatedMinutes,
    energy_level: input.energyLevel,
    microtasks: microtasks.map((title, index) => ({
      title,
      estimated_minutes: index === 0 ? 5 : 10,
      order: index + 1
    })),
    first_micro_action: microtasks[0] ?? "Abrir a tarefa por cinco minutos",
    if_stuck_suggestion:
      "Se travar, usar o Desbloqueador em etapa futura ou reduzir para a primeira microacao de cinco minutos.",
    fallback_minimum_version: microtasks[0] ?? "Abrir a tarefa por cinco minutos",
    user_review_required: true
  };
}
