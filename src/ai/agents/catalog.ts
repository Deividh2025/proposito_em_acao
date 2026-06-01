export type AiAgentKey =
  | "journeyCopilot"
  | "calling"
  | "lifeMap"
  | "smartGoal"
  | "planner"
  | "taskBreakdown"
  | "inboxClassifier"
  | "scheduleReviewer"
  | "actionUnblocker"
  | "metacognition"
  | "habits"
  | "scoreboard"
  | "weeklyReview"
  | "accountability"
  | "guardrailReviewer";

export type AiAgentDefinition = {
  key: AiAgentKey;
  name: string;
  purpose: string;
  writesData: boolean;
  requiresStructuredOutput: boolean;
  promptVersion: string;
  outputSchemaName: string | null;
  humanReviewRequired: boolean;
  allowedContext: string[];
  forbiddenContext: string[];
  guardrails: string[];
};

export const aiAgents: AiAgentDefinition[] = [
  {
    key: "journeyCopilot",
    name: "Copiloto de Jornada",
    purpose: "Orientar o usuario pela plataforma sem virar chatbot solto.",
    writesData: false,
    requiresStructuredOutput: false,
    promptVersion: "journey_copilot_prompt_v1",
    outputSchemaName: null,
    humanReviewRequired: false,
    allowedContext: ["onboarding_status", "current_module", "next_safe_step"],
    forbiddenContext: ["raw_metacognition", "full_calling", "accountability_private_data"],
    guardrails: ["clinical", "pastoral", "privacy"]
  },
  {
    key: "calling",
    name: "Agente do Chamado Pessoal",
    purpose: "Conduzir descoberta e revisao de hipotese de Chamado.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "calling_prompt_v1",
    outputSchemaName: "calling_output_v1",
    humanReviewRequired: true,
    allowedContext: ["calling_answers", "life_map_observations", "faith_mode"],
    forbiddenContext: ["diagnosis", "specific_divine_will_claim", "accountability_private_data"],
    guardrails: ["clinical", "pastoral", "privacy"]
  },
  {
    key: "lifeMap",
    name: "Agente do Mapa da Vida",
    purpose: "Interpretar notas, respostas e desequilibrios.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "life_map_prompt_v1",
    outputSchemaName: "life_map_analysis_output_v1",
    humanReviewRequired: true,
    allowedContext: ["life_area_scores", "life_area_answers"],
    forbiddenContext: ["diagnosis", "accountability_private_data"],
    guardrails: ["clinical", "privacy"]
  },
  {
    key: "smartGoal",
    name: "Agente de Alvos SMART-E",
    purpose: "Transformar desejos vagos em alvos concretos e ecologicos.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "smart_goal_prompt_v1",
    outputSchemaName: "smart_goal_output_v1",
    humanReviewRequired: true,
    allowedContext: ["calling_summary", "life_area", "goal_draft"],
    forbiddenContext: ["raw_metacognition", "private_weekly_review"],
    guardrails: ["clinical", "pastoral", "privacy"]
  },
  {
    key: "planner",
    name: "Agente Planejador",
    purpose: "Converter alvos em projetos, fases, marcos e tarefas iniciais.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "planner_prompt_v1",
    outputSchemaName: "project_plan_output_v1",
    humanReviewRequired: true,
    allowedContext: ["approved_goal", "energy_budget", "calendar_constraints"],
    forbiddenContext: ["raw_metacognition", "unreviewed_private_content"],
    guardrails: ["privacy", "clinical"]
  },
  {
    key: "taskBreakdown",
    name: "Agente de Microtarefas",
    purpose: "Quebrar tarefas grandes em microtarefas e primeira microacao.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "planner_prompt_v1",
    outputSchemaName: "task_breakdown_output_v1",
    humanReviewRequired: true,
    allowedContext: ["task", "reason", "energy", "available_minutes"],
    forbiddenContext: ["raw_metacognition", "unreviewed_private_content", "accountability_private_data"],
    guardrails: ["privacy", "clinical", "metacognition"]
  },
  {
    key: "inboxClassifier",
    name: "Agente Classificador de Inbox",
    purpose: "Classificar capturas e sugerir destino.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "inbox_classifier_prompt_v1",
    outputSchemaName: "inbox_classification_output_v1",
    humanReviewRequired: true,
    allowedContext: ["inbox_item", "known_projects", "known_goals"],
    forbiddenContext: ["accountability_private_data"],
    guardrails: ["privacy", "clinical"]
  },
  {
    key: "scheduleReviewer",
    name: "Agente Revisor de Agenda",
    purpose: "Revisar sobrecarga, descanso protegido e ajustes de calendario sem alterar blocos automaticamente.",
    writesData: false,
    requiresStructuredOutput: true,
    promptVersion: "schedule_reviewer_prompt_v1",
    outputSchemaName: "schedule_overload_output_v1",
    humanReviewRequired: true,
    allowedContext: ["calendar_blocks", "energy_level", "protected_blocks", "available_minutes"],
    forbiddenContext: ["raw_metacognition", "accountability_private_data", "unneeded_sensitive_history"],
    guardrails: ["privacy", "clinical", "pastoral"]
  },
  {
    key: "actionUnblocker",
    name: "Agente Desbloqueador de Acao",
    purpose: "Gerar proximo passo imediato, foco recomendado e plano minimo.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "action_unblocker_prompt_v1",
    outputSchemaName: "action_unblocker_output_v1",
    humanReviewRequired: true,
    allowedContext: ["task", "obstacle", "energy", "available_minutes"],
    forbiddenContext: ["diagnosis", "private_metacognition_history"],
    guardrails: ["clinical", "metacognition", "privacy"]
  },
  {
    key: "metacognition",
    name: "Agente de Metacognicao",
    purpose: "Separar pensamento, sentimento, interpretacao e impulso com retorno a acao.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "metacognition_prompt_v1",
    outputSchemaName: "metacognition_output_v1",
    humanReviewRequired: true,
    allowedContext: ["current_state", "thought", "feeling", "impulse", "optional_task_context"],
    forbiddenContext: ["accountability_partner", "therapy_record", "diagnosis"],
    guardrails: ["clinical", "pastoral", "metacognition", "privacy"]
  },
  {
    key: "habits",
    name: "Agente de Habitos",
    purpose: "Criar planos de habito com gatilho, rotina minima, ambiente e retomada.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "habits_prompt_v1",
    outputSchemaName: "habit_plan_output_v1",
    humanReviewRequired: true,
    allowedContext: ["goal_summary", "routine", "energy_pattern"],
    forbiddenContext: ["diagnosis", "shame_language"],
    guardrails: ["clinical", "pastoral", "privacy"]
  },
  {
    key: "scoreboard",
    name: "Agente do Placar da Disciplina",
    purpose: "Sugerir um placar leve, privado e revisavel para constancia sem vergonha.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "scoreboard_prompt_v1",
    outputSchemaName: "scoreboard_plan_output_v1",
    humanReviewRequired: true,
    allowedContext: ["goal_summary", "habit_summary", "task_summary", "focus_summary"],
    forbiddenContext: ["raw_metacognition", "raw_focus_distractions", "accountability_private_data"],
    guardrails: ["clinical", "pastoral", "privacy"]
  },
  {
    key: "weeklyReview",
    name: "Agente Revisor Semanal",
    purpose: "Identificar padroes, sobrecarga, desalinhamentos e ajustes.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "weekly_review_prompt_v1",
    outputSchemaName: "weekly_review_output_v1",
    humanReviewRequired: true,
    allowedContext: ["weekly_answers", "goal_progress", "habit_summary"],
    forbiddenContext: ["raw_metacognition", "accountability_private_data"],
    guardrails: ["clinical", "pastoral", "privacy"]
  },
  {
    key: "accountability",
    name: "Agente Atalaia",
    purpose: "Gerar mensagens limitadas e consentidas para acompanhamento externo.",
    writesData: true,
    requiresStructuredOutput: true,
    promptVersion: "accountability_prompt_v1",
    outputSchemaName: "accountability_message_output_v1",
    humanReviewRequired: true,
    allowedContext: ["goal_status", "authorized_milestones", "authorized_help_request"],
    forbiddenContext: ["full_calling", "raw_metacognition", "health", "family", "finances", "emotions"],
    guardrails: ["accountability", "privacy", "clinical", "pastoral"]
  },
  {
    key: "guardrailReviewer",
    name: "Agente Guardrail/Revisor",
    purpose: "Revisar seguranca, privacidade, tom, risco emocional e schema.",
    writesData: false,
    requiresStructuredOutput: true,
    promptVersion: "guardrail_reviewer_prompt_v1",
    outputSchemaName: "guardrail_review_output_v1",
    humanReviewRequired: false,
    allowedContext: ["candidate_output", "schema_version", "agent_key", "consent_scope"],
    forbiddenContext: ["raw_secret", "unneeded_sensitive_history"],
    guardrails: ["clinical", "pastoral", "privacy", "accountability", "metacognition"]
  }
];

export function getAiAgentDefinition(key: AiAgentKey): AiAgentDefinition {
  const definition = aiAgents.find((agent) => agent.key === key);

  if (!definition) {
    throw new Error(`Unknown AI agent: ${key}`);
  }

  return definition;
}
