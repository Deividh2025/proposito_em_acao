import type { ProjectPlanOutput } from "@/ai/schemas";

export * from "./types";

export type BuildProjectPlanMockInput = {
  goalId: string;
  goalTitle: string;
  lifeArea?: string;
  firstAction?: string;
};

export function buildProjectPlanMock(input: BuildProjectPlanMockInput): ProjectPlanOutput {
  const firstAction = input.firstAction?.trim() || "Escolher a primeira microacao executavel";

  return {
    schema_version: "project_plan_output_v1",
    goal_id: input.goalId,
    projects: [
      {
        title: `Plano inicial: ${input.goalTitle}`,
        description:
          "Projeto simples para transformar o alvo em execucao revisavel, sem criar calendario funcional nesta etapa.",
        phase: "primeiro ciclo",
        milestones: ["Primeira acao concluida", "Primeira revisao do progresso", "Ajuste de escopo apos 7 dias"],
        risks: ["Escopo grande demais", "Falta de energia", "Tentar resolver tudo em uma sessao"],
        resources_needed: ["25 minutos protegidos", "Lista curta de microtarefas", "Revisao sem culpa"],
        tasks: [
          {
            title: firstAction,
            description: "Tarefa inicial pequena, revisavel e vinculada ao alvo.",
            estimated_minutes: 25,
            energy_level: "low",
            microtasks: [
              "Abrir o material ou contexto certo",
              "Listar apenas o que ja esta claro",
              "Escolher a menor continuidade honesta"
            ]
          }
        ],
        restart_plan:
          "Se travar, fazer o menor retorno honesto: abrir o projeto por cinco minutos, escolher uma microtarefa e registrar o proximo passo."
      }
    ],
    overload_warning: null,
    user_review_required: true
  };
}
