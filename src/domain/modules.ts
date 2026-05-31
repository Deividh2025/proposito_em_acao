export type PlannedModule = {
  slug: string;
  name: string;
  status: string;
};

export const plannedModules: PlannedModule[] = [
  { slug: "user", name: "Perfil e preferencias", status: "Diretorio de dominio preparado." },
  { slug: "life-map", name: "Mapa da Vida", status: "Modelo conceitual aguardando schema." },
  { slug: "calling", name: "Chamado Pessoal", status: "Eixo do produto preservado." },
  { slug: "goals", name: "Alvos SMART-E", status: "Tipos e validacoes serao definidos depois." },
  { slug: "projects", name: "Projetos", status: "Planejamento futuro por alvo." },
  { slug: "tasks", name: "Tarefas e microtarefas", status: "Sem fluxo funcional nesta etapa." },
  { slug: "calendar", name: "Calendario", status: "Biblioteca sera validada em prompt proprio." },
  { slug: "inbox", name: "Inbox/GTD", status: "Classificacao por IA ainda nao implementada." },
  { slug: "focus", name: "Foco/Pomodoro", status: "Sem temporizador real nesta etapa." },
  { slug: "habits", name: "Habitos", status: "Sem rastreamento real nesta etapa." },
  { slug: "scoreboard", name: "Placar da Disciplina", status: "Sem metricas reais nesta etapa." },
  { slug: "metacognition", name: "Metacognicao", status: "Guardrails antes de qualquer fluxo." },
  { slug: "accountability", name: "Atalaia", status: "Consentimento granular obrigatorio." },
  { slug: "review", name: "Revisao semanal", status: "Sem revisao funcional nesta etapa." },
  { slug: "garden", name: "Jardim da Vida", status: "Visual futuro, nao gamificado agora." }
];
