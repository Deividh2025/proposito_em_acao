import {
  CalendarDays,
  FileText,
  Flower2,
  Gauge,
  Handshake,
  Home,
  Inbox,
  LogIn,
  Leaf,
  ListRestart,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  Zap
} from "lucide-react";

import type { NavigationItem, PlaceholderPageDefinition } from "@/types/design";

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Direção inicial, próxima ação e progressão assistida.",
    status: "Prompt 6",
    icon: Home
  },
  {
    label: "Acesso",
    href: "/auth",
    description: "Criar conta, entrar e sair com Supabase Auth.",
    status: "Prompt 15",
    icon: LogIn
  },
  {
    label: "Mobile",
    href: "/mobile",
    description: "PWA complementar para ações rápidas.",
    status: "Prompt 14",
    icon: Zap
  },
  {
    label: "Onboarding",
    href: "/onboarding",
    description: "Perfil, Mapa da Vida e Chamado em discernimento.",
    status: "Prompt 6",
    icon: Target
  },
  {
    label: "Alvos",
    href: "/goals",
    description: "SMART-E, ecologia, Chamado e primeira ação.",
    status: "Prompt 8",
    icon: Target
  },
  {
    label: "Projetos",
    href: "/projects",
    description: "Fases, marcos, riscos, recursos e tarefas iniciais.",
    status: "Prompt 8",
    icon: Sparkles
  },
  {
    label: "Tarefas",
    href: "/tasks",
    description: "Microtarefas, energia, tempo e próxima ação.",
    status: "Prompt 8",
    icon: TimerReset
  },
  {
    label: "Calendário",
    href: "/calendar",
    description: "Semana/dia, blocos, descanso e sobrecarga.",
    status: "Prompt 9",
    icon: CalendarDays
  },
  {
    label: "Inbox",
    href: "/inbox",
    description: "Captura rápida, classificação e destino claro.",
    status: "Prompt 9",
    icon: Inbox
  },
  {
    label: "Desbloqueador",
    href: "/action-unblocker",
    description: "Microação, versão mínima e rota segura.",
    status: "Prompt 10",
    icon: ListRestart
  },
  {
    label: "Foco",
    href: "/focus",
    description: "Sessões curtas e captura de distrações.",
    status: "Prompt 11",
    icon: TimerReset
  },
  {
    label: "Hábitos",
    href: "/habits",
    description: "Rotina mínima, ideal e retomada.",
    status: "Prompt 11",
    icon: Leaf
  },
  {
    label: "Placar",
    href: "/scoreboard",
    description: "Constância sem vergonha.",
    status: "Prompt 11",
    icon: Gauge
  },
  {
    label: "Metacognição",
    href: "/metacognition",
    description: "Sala de clareza interna, privada por padrão.",
    status: "Prompt 10",
    icon: Sparkles
  },
  {
    label: "Revisão",
    href: "/review",
    description: "Aprendizado semanal e ajuste de rota.",
    status: "Prompt 12",
    icon: RotateCcw
  },
  {
    label: "Jardim",
    href: "/garden",
    description: "Progresso visual simbólico e não punitivo.",
    status: "Prompt 12",
    icon: Flower2
  },
  {
    label: "Atalaia",
    href: "/accountability",
    description: "Acompanhamento por alvo e consentimento.",
    status: "Prompt 13",
    icon: Handshake
  },
  {
    label: "Compromissos",
    href: "/commitments",
    description: "Documento e alavancas revisaveis.",
    status: "Prompt 13",
    icon: FileText
  },
  {
    label: "Configurações",
    href: "/settings",
    description: "Preferências, privacidade e camada cristã futura.",
    status: "em preparação",
    icon: Settings
  }
];

export const quickActionItems: NavigationItem[] = [
  {
    label: "Mobile",
    href: "/mobile",
    description: "Hub de ações rápidas.",
    status: "Prompt 14",
    icon: Zap
  },
  {
    label: "Capturar",
    href: "/mobile/capture",
    description: "Enviar para Inbox.",
    status: "Prompt 14",
    icon: Inbox
  },
  {
    label: "Foco",
    href: "/mobile/focus",
    description: "Foco curto.",
    status: "Prompt 14",
    icon: TimerReset
  },
  {
    label: "Energia",
    href: "/mobile/energy",
    description: "Check-in simples.",
    status: "Prompt 14",
    icon: Zap
  },
  {
    label: "Clarear",
    href: "/mobile/metacognition",
    description: "Metacognição rápida.",
    status: "Prompt 14",
    icon: Sparkles
  }
];

export const placeholderPages: PlaceholderPageDefinition[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    status: "Prompt 6",
    description: "Direção inicial, próxima microação e progressão assistida.",
    components: ["NextActionCard", "ProgressNudge", "ScoreboardCard", "LifeGardenPreview"],
    nextStep: "Definir a próxima ação evidente sem construir dashboard final."
  },
  {
    title: "Onboarding",
    href: "/onboarding",
    status: "Prompt 6",
    description: "Fluxo funcional de perfil, Mapa da Vida e Chamado Pessoal.",
    components: ["Stepper", "EnergySelector", "ReflectionCard", "SensitiveDataNotice"],
    nextStep: "Implementar em prompt próprio com consentimentos e salvamento seguro."
  },
  {
    title: "Calendário",
    href: "/calendar",
    status: "Prompt 9",
    description: "Semana/dia, blocos de execução, descanso e família.",
    components: ["CalendarShell", "WeekView", "DayView", "ScheduleOverloadAlert"],
    nextStep: "Manter agendamento por formulário e evitar drag-and-drop prematuro."
  },
  {
    title: "Inbox",
    href: "/inbox",
    status: "Prompt 9",
    description: "Captura rápida com destino claro e classificação revisável.",
    components: ["InboxCapture", "InboxList", "InboxItemCard", "InboxProcessPanel"],
    nextStep: "Manter classificação mock segura até OpenAI real ser autorizada."
  },
  {
    title: "Desbloqueador",
    href: "/action-unblocker",
    status: "Prompt 10",
    description: "Microação, versão mínima, foco curto e rota segura.",
    components: ["ActionUnblockerForm", "TinyStepCard", "MinimumViableActionCard", "SensitiveDataNotice"],
    nextStep: "Manter IA mockada segura e preparar integração futura com Modo Foco.",
    privacyNote: "Sem Atalaia, sem OpenAI real acionada pela UI e sem logs de conteúdo sensível."
  },
  {
    title: "Foco",
    href: "/focus",
    status: "Prompt 11",
    description: "Timer funcional, captura de distracoes e conclusao de sessao.",
    components: ["FocusSessionShell", "FocusTimer", "DistractionCapture", "FocusCompleteSummary"],
    nextStep: "Manter integracao sem Atalaia e validar RLS em ambiente Supabase."
  },
  {
    title: "Hábitos",
    href: "/habits",
    status: "Prompt 11",
    description: "Plano de habito minimo/ideal, gatilho, recompensa e retomada.",
    components: ["HabitForm", "HabitPlanCard", "HabitList", "HabitRestartPrompt"],
    nextStep: "Evoluir agendamento e historico apos validacao RLS."
  },
  {
    title: "Placar",
    href: "/scoreboard",
    status: "Prompt 11",
    description: "Constancia, comportamentos-chave e retomadas sem vergonha.",
    components: ["ScoreboardCard", "ScoreboardItem", "ScoreboardMarker", "RestartCountBadge"],
    nextStep: "Manter privado por padrao e preparar apenas resumo limitado futuro."
  },
  {
    title: "Metacognição",
    href: "/metacognition",
    status: "Prompt 10",
    description: "Fluxo privado para separar fato, interpretação, sentimento e impulso.",
    components: [
      "MetacognitionForm",
      "MetacognitionResult",
      "FactInterpretationFeelingImpulseGrid",
      "MetacognitionHistoryList"
    ],
    nextStep: "Manter histórico privado e evoluir somente com guardrails revisados.",
    privacyNote: "Privada por padrão. Nada é enviado ao Atalaia automaticamente."
  },
  {
    title: "Revisão",
    href: "/review",
    status: "em preparação",
    description: "Síntese futura da semana, aprendizados e foco seguinte.",
    components: ["RestartPrompt", "ProgressNudge", "LifeGardenPreview", "GratitudePrompt"],
    nextStep: "Criar perguntas reais apenas em etapa de Revisão Semanal."
  },
  {
    title: "Jardim",
    href: "/garden",
    status: "em preparação",
    description: "Progresso simbólico por áreas da vida, sem punição visual.",
    components: ["LifeGardenPreview", "GardenAreaTile", "GardenGrowthIndicator", "CareNeededIndicator"],
    nextStep: "Manter Jardim como convite de cuidado, não ranking."
  },
  {
    title: "Atalaia",
    href: "/accountability",
    status: "Prompt 13",
    description: "Acompanhamento externo por alvo, consentimento, previa e revogacao.",
    components: ["AccountabilityPartnerForm", "PermissionSelector", "AccountabilityInvitePreview", "PartnerLimitedPanel"],
    nextStep: "Manter acesso limitado por grant ativo e cancelar notificacoes pendentes na revogacao.",
    privacyNote: "Acesso nunca é à conta inteira."
  },
  {
    title: "Compromissos",
    href: "/commitments",
    status: "Prompt 13",
    description: "Documento de compromisso, recompensas saudaveis e consequencias restaurativas.",
    components: ["CommitmentDocumentBuilder", "CommitmentDocumentPreview", "CommitmentLeverForm"],
    nextStep: "Compartilhar somente apos revisao, grant ativo e permissao explicita.",
    privacyNote: "Documento nasce privado e nao envia dados automaticamente."
  },
  {
    title: "Configurações",
    href: "/settings",
    status: "em preparação",
    description: "Preferências futuras de conta, privacidade, IA e camada cristã.",
    components: ["Switch", "RadioGroup", "Select", "SuccessState"],
    nextStep: "Centralizar preferencias de conta, privacidade e IA sem expor secrets."
  }
];

export function getPlaceholderPage(href: string) {
  return placeholderPages.find((page) => page.href === href);
}

export const safetyNavigationItem = {
  label: "Privacidade",
  href: "/accountability",
  description: "Dados sensíveis privados por padrão.",
  status: "base visual",
  icon: ShieldCheck
} satisfies NavigationItem;
