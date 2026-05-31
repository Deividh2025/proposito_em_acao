import type { DesignMode } from "@/types/design";

export const designModes = {
  standard: {
    id: "standard",
    name: "Modo padrão",
    description: "Ritmo completo para planejamento e execução consciente no desktop.",
    tone: "claro, direto e calmo",
    interactionRules: [
      "Mostrar uma ação principal por contexto.",
      "Usar profundidade progressiva para detalhes.",
      "Manter feedback breve e não punitivo."
    ]
  },
  lowEnergy: {
    id: "low-energy",
    name: "Modo baixa energia",
    description: "Reduz opções, campos e estímulos para caber em dias difíceis.",
    tone: "compassivo, objetivo e mínimo",
    interactionRules: [
      "Mostrar a versão mínima aceitável.",
      "Oferecer durações curtas.",
      "Permitir descanso legítimo sem culpa visual."
    ]
  },
  restart: {
    id: "restart",
    name: "Modo recomeço",
    description: "Valoriza retomada depois de atraso, falha ou abandono.",
    tone: "retomada responsável sem humilhação",
    interactionRules: [
      "Evitar vermelho agressivo e linguagem de fracasso.",
      "Perguntar pelo menor retorno honesto.",
      "Converter queda em ajuste de rota e microação."
    ]
  }
} satisfies Record<string, DesignMode>;
