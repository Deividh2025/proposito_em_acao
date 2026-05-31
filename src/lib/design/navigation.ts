import {
  CalendarDays,
  Flower2,
  Gauge,
  Handshake,
  Home,
  Inbox,
  Leaf,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset
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
    description: "Semana/dia, blocos e descanso em etapa futura.",
    status: "em preparação",
    icon: CalendarDays
  },
  {
    label: "Inbox",
    href: "/inbox",
    description: "Captura rápida e destino claro.",
    status: "em preparação",
    icon: Inbox
  },
  {
    label: "Foco",
    href: "/focus",
    description: "Sessões curtas e captura de distrações.",
    status: "em preparação",
    icon: TimerReset
  },
  {
    label: "Hábitos",
    href: "/habits",
    description: "Rotina mínima, ideal e retomada.",
    status: "em preparação",
    icon: Leaf
  },
  {
    label: "Placar",
    href: "/scoreboard",
    description: "Constância sem vergonha.",
    status: "em preparação",
    icon: Gauge
  },
  {
    label: "Metacognição",
    href: "/metacognition",
    description: "Sala de clareza interna, privada por padrão.",
    status: "base visual",
    icon: Sparkles
  },
  {
    label: "Revisão",
    href: "/review",
    description: "Aprendizado semanal e ajuste de rota.",
    status: "em preparação",
    icon: RotateCcw
  },
  {
    label: "Jardim",
    href: "/garden",
    description: "Progresso visual simbólico e não punitivo.",
    status: "base visual",
    icon: Flower2
  },
  {
    label: "Atalaia",
    href: "/accountability",
    description: "Acompanhamento por alvo e consentimento.",
    status: "em preparação",
    icon: Handshake
  },
  {
    label: "Configurações",
    href: "/settings",
    description: "Preferências, privacidade e camada cristã futura.",
    status: "em preparação",
    icon: Settings
  }
];

export const quickActionItems = [
  navigationItems[0],
  navigationItems[4],
  navigationItems[10],
  navigationItems[11]
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
    status: "em preparação",
    description: "Lugar futuro de blocos de execução, descanso e família.",
    components: ["EmptyState", "TimeAvailableSelector", "MicrotaskList", "LowEnergyPrompt"],
    nextStep: "Avaliar semana/dia e acessibilidade antes de drag-and-drop."
  },
  {
    title: "Inbox",
    href: "/inbox",
    status: "em preparação",
    description: "Captura rápida com destino claro em etapa futura.",
    components: ["Input", "Textarea", "Tag", "SuccessState"],
    nextStep: "Preparar captura editável sem classificação real por IA nesta etapa."
  },
  {
    title: "Foco",
    href: "/focus",
    status: "em preparação",
    description: "Superfície futura para foco curto e registro simples.",
    components: ["FocusStartButton", "TimeAvailableSelector", "TinyStepCard", "Progress"],
    nextStep: "Criar timer funcional apenas na etapa própria."
  },
  {
    title: "Hábitos",
    href: "/habits",
    status: "em preparação",
    description: "Base futura de hábito mínimo, ideal, gatilho e retomada.",
    components: ["Checkbox", "StreakSoftIndicator", "RestartPrompt", "WisdomNote"],
    nextStep: "Evitar streak punitivo e priorizar rotina mínima."
  },
  {
    title: "Placar",
    href: "/scoreboard",
    status: "em preparação",
    description: "Constância, tarefas-chave e retomadas sem vergonha.",
    components: ["ScoreboardCard", "ScoreboardItem", "ScoreboardMarker", "RestartCountBadge"],
    nextStep: "Desenhar marcação rápida antes de persistência real."
  },
  {
    title: "Metacognição",
    href: "/metacognition",
    status: "em preparação",
    description: "Estrutura visual para separar fato, interpretação, sentimento e impulso.",
    components: [
      "MetacognitionEntryCard",
      "EmotionIntensityScale",
      "FactInterpretationFeelingImpulseGrid",
      "NextActionAfterReflectionCard"
    ],
    nextStep: "Implementar fluxo real só com guardrails e privacidade revisados.",
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
    status: "em preparação",
    description: "Acompanhamento externo por alvo, consentimento e prévia.",
    components: ["Panel", "Badge", "Modal", "SensitiveDataNotice"],
    nextStep: "Implementar grants, prévia e revogação em etapa própria.",
    privacyNote: "Acesso nunca é à conta inteira."
  },
  {
    title: "Configurações",
    href: "/settings",
    status: "em preparação",
    description: "Preferências futuras de conta, privacidade, IA e camada cristã.",
    components: ["Switch", "RadioGroup", "Select", "SuccessState"],
    nextStep: "Não ativar Auth, Supabase ou OpenAI nesta etapa."
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
