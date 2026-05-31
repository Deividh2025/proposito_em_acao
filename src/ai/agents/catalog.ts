export type AiAgentKey =
  | "journeyCopilot"
  | "calling"
  | "lifeMap"
  | "smartGoal"
  | "planner"
  | "inboxClassifier"
  | "actionUnblocker"
  | "metacognition"
  | "habits"
  | "weeklyReview"
  | "accountability"
  | "guardrailReviewer";

export type AiAgentDefinition = {
  key: AiAgentKey;
  name: string;
  purpose: string;
  writesData: boolean;
  requiresStructuredOutput: boolean;
};

export const aiAgents: AiAgentDefinition[] = [
  {
    key: "journeyCopilot",
    name: "Copiloto de Jornada",
    purpose: "Orientar o usuario pela plataforma sem virar chatbot solto.",
    writesData: false,
    requiresStructuredOutput: false
  },
  {
    key: "calling",
    name: "Agente do Chamado Pessoal",
    purpose: "Conduzir descoberta e revisao de hipotese de Chamado.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "lifeMap",
    name: "Agente do Mapa da Vida",
    purpose: "Interpretar notas, respostas e desequilibrios.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "smartGoal",
    name: "Agente de Alvos SMART-E",
    purpose: "Transformar desejos vagos em alvos concretos e ecologicos.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "planner",
    name: "Agente Planejador",
    purpose: "Converter alvos em projetos, tarefas, microtarefas e blocos.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "inboxClassifier",
    name: "Agente Classificador de Inbox",
    purpose: "Classificar capturas e sugerir destino.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "actionUnblocker",
    name: "Agente Desbloqueador de Acao",
    purpose: "Gerar proximo passo imediato, foco recomendado e plano minimo.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "metacognition",
    name: "Agente de Metacognicao",
    purpose: "Separar pensamento, sentimento, interpretacao e impulso com retorno a acao.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "habits",
    name: "Agente de Habitos",
    purpose: "Criar planos de habito com gatilho, rotina minima e plano se/entao.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "weeklyReview",
    name: "Agente Revisor Semanal",
    purpose: "Identificar padroes, sobrecarga, desalinhamentos e ajustes.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "accountability",
    name: "Agente Atalaia",
    purpose: "Gerar mensagens limitadas e consentidas para acompanhamento externo.",
    writesData: true,
    requiresStructuredOutput: true
  },
  {
    key: "guardrailReviewer",
    name: "Agente Guardrail/Revisor",
    purpose: "Revisar seguranca, privacidade, tom, risco emocional e schema.",
    writesData: false,
    requiresStructuredOutput: true
  }
];
