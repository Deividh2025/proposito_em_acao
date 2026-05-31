export type ProgressiveUnlockInput = {
  hasCallingHypothesis: boolean;
};

export type ProgressiveUnlockState = {
  availableModules: string[];
  limitedModules: string[];
  message: string;
  nextRecommendedStep: string;
};

export function getProgressiveUnlockState({
  hasCallingHypothesis
}: ProgressiveUnlockInput): ProgressiveUnlockState {
  if (hasCallingHypothesis) {
    return {
      availableModules: [
        "Perfil",
        "Mapa da Vida",
        "Chamado Pessoal",
        "Captura simples",
        "Desbloqueador futuro",
        "Metacognicao futura",
        "Alvos completos"
      ],
      limitedModules: ["Atalaia", "Placar completo", "Calendario estrategico"],
      message:
        "Voce ja tem uma hipotese de direcao. A proxima etapa segura e transformar essa direcao em um primeiro alvo.",
      nextRecommendedStep: "Criar o primeiro alvo alinhado ao Chamado"
    };
  }

  return {
    availableModules: [
      "Perfil",
      "Mapa da Vida",
      "Sessao de Chamado",
      "Captura simples futura",
      "Desbloqueador futuro",
      "Metacognicao futura"
    ],
    limitedModules: [
      "Alvos completos",
      "Projetos",
      "Planejamento estrategico",
      "Atalaia",
      "Placar completo",
      "Calendario estrategico"
    ],
    message:
      "Antes de planejar a agenda, vamos amadurecer uma direcao. Isso evita organizar com eficiencia uma vida que ainda esta sem norte.",
    nextRecommendedStep: "Salvar uma hipotese provisoria de Chamado"
  };
}
