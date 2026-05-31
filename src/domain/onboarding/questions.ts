import type { CallingQuestionKey, ChristianLayerPreference, EnergyLevel } from "./types";

export const energyOptions: Array<{ label: string; value: EnergyLevel }> = [
  { label: "Baixa", value: "low" },
  { label: "Media", value: "medium" },
  { label: "Alta", value: "high" },
  { label: "Oscilante", value: "variable" }
];

export const aiSupportToneOptions = [
  {
    label: "Leve",
    value: "light",
    description: "Sugestoes cuidadosas, com pouca confrontacao."
  },
  {
    label: "Equilibrado",
    value: "balanced",
    description: "Clareza, encorajamento e responsabilidade na medida."
  },
  {
    label: "Firme",
    value: "firm",
    description: "Mais direto, sem humilhacao e com limites saudaveis."
  }
] as const;

export const christianLayerOptions: Array<{
  label: string;
  value: ChristianLayerPreference;
  description: string;
}> = [
  {
    label: "Discreta",
    value: "discreet",
    description: "Linguagem de fe aparece com leveza e quando fizer sentido."
  },
  {
    label: "Equilibrada",
    value: "balanced",
    description: "Reflexao crista integrada, sem pressao espiritual."
  },
  {
    label: "Intensa",
    value: "intense",
    description: "Mais espaco para oracao, mordomia e discernimento."
  }
];

export const callingQuestions: Array<{
  key: CallingQuestionKey;
  label: string;
  helper: string;
}> = [
  {
    key: "world_burden",
    label: "O que mais te incomoda no mundo hoje?",
    helper: "Pense em dores que mexem com voce, sem tentar resolver tudo agora."
  },
  {
    key: "pain_to_solve",
    label: "Que dor voce sente vontade de ajudar a resolver?",
    helper: "Pode ser algo pequeno, local ou muito proximo da sua historia."
  },
  {
    key: "people_to_serve",
    label: "Quem voce deseja ajudar com mais intencao?",
    helper: "Pessoas, grupos, familia, comunidade ou um tipo de situacao."
  },
  {
    key: "remembered_for",
    label: "Como voce gostaria de ser lembrado?",
    helper: "Procure uma frase humana, nao perfeita."
  },
  {
    key: "marking_experiences",
    label: "Quais experiencias marcaram sua vida?",
    helper: "Inclua aprendizados, dores superadas ou responsabilidades que moldaram voce."
  },
  {
    key: "gifts",
    label: "Quais dons, talentos ou inclinacoes aparecem de novo e de novo?",
    helper: "O que as pessoas costumam reconhecer em voce?"
  },
  {
    key: "core_values",
    label: "Quais valores sao inegociaveis para voce?",
    helper: "Use palavras simples: verdade, familia, servico, excelencia, descanso..."
  },
  {
    key: "responsibility_places",
    label: "Onde voce sente responsabilidade?",
    helper: "Nao precisa virar peso. Estamos buscando sinais de direcao."
  },
  {
    key: "fruitful_life",
    label: "O que faria sua vida parecer frutifera?",
    helper: "Descreva fruto, presenca e contribuicao, nao apenas performance."
  },
  {
    key: "faithful_contribution",
    label: "Que contribuicao voce deseja discernir diante de Deus?",
    helper:
      "Responda como hipotese em amadurecimento. O sistema nao dira que Deus quer uma decisao especifica."
  }
];
