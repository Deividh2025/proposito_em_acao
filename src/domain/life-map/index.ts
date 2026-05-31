export type LifeAreaSlug =
  | "faith"
  | "health"
  | "family"
  | "work"
  | "finances"
  | "emotions"
  | "relationships"
  | "learning"
  | "rest"
  | "service";

export type LifeMapArea = {
  slug: LifeAreaSlug;
  name: string;
  prompt: string;
  colorClass: string;
};

export type LifeMapScoreInput = {
  areaSlug: LifeAreaSlug;
  score: number;
  note?: string;
};

export type LifeMapAnalysis = {
  averageScore: number;
  strongAreas: string[];
  fragileAreas: string[];
  neglectedAreas: string[];
  imbalanceNotes: string[];
  careAlerts: string[];
  doNotSacrifice: string[];
};

export const lifeMapAreas: LifeMapArea[] = [
  {
    slug: "faith",
    name: "Fe e espiritualidade",
    prompt: "Como esta sua vida de fe, sentido e mordomia interior?",
    colorClass: "bg-purpose-700"
  },
  {
    slug: "health",
    name: "Saude e energia",
    prompt: "Seu corpo tem sustentado a vida que voce tenta construir?",
    colorClass: "bg-action-700"
  },
  {
    slug: "family",
    name: "Familia",
    prompt: "Como estao presenca, cuidado e responsabilidades familiares?",
    colorClass: "bg-warmth-700"
  },
  {
    slug: "work",
    name: "Trabalho e carreira",
    prompt: "Seu trabalho tem direcao, entrega e limites saudaveis?",
    colorClass: "bg-ink-700"
  },
  {
    slug: "finances",
    name: "Financas",
    prompt: "Como esta a relacao entre recursos, escolhas e paz pratica?",
    colorClass: "bg-action-600"
  },
  {
    slug: "emotions",
    name: "Emocoes",
    prompt: "Voce tem conseguido reconhecer e regular o que sente?",
    colorClass: "bg-purpose-600"
  },
  {
    slug: "relationships",
    name: "Relacionamentos",
    prompt: "Quais vinculos tem recebido presenca e verdade?",
    colorClass: "bg-warmth-600"
  },
  {
    slug: "learning",
    name: "Aprendizado",
    prompt: "O que voce tem cultivado em sabedoria e competencia?",
    colorClass: "bg-ink-600"
  },
  {
    slug: "rest",
    name: "Descanso",
    prompt: "Seu descanso esta reparando ou apenas apagando incendios?",
    colorClass: "bg-action-500"
  },
  {
    slug: "service",
    name: "Servico e contribuicao",
    prompt: "Onde sua vida tem servido alguem alem de voce?",
    colorClass: "bg-purpose-500"
  }
];

const areaBySlug = new Map(lifeMapAreas.map((area) => [area.slug, area]));

function areaName(areaSlug: LifeAreaSlug) {
  return areaBySlug.get(areaSlug)?.name ?? areaSlug;
}

export function analyzeLifeMap(scores: LifeMapScoreInput[]): LifeMapAnalysis {
  const safeScores = scores.map((item) => ({
    ...item,
    score: Math.max(1, Math.min(10, Math.round(item.score)))
  }));

  const averageScore =
    safeScores.length === 0
      ? 0
      : Math.round((safeScores.reduce((sum, item) => sum + item.score, 0) / safeScores.length) * 10) / 10;

  const strongAreas = safeScores
    .filter((item) => item.score >= 8)
    .map((item) => areaName(item.areaSlug));

  const fragileAreas = safeScores
    .filter((item) => item.score <= 4)
    .map((item) => areaName(item.areaSlug));

  const neglectedAreas = safeScores
    .filter((item) => item.score <= 3 && !item.note?.trim())
    .map((item) => areaName(item.areaSlug));

  const lowest = [...safeScores].sort((left, right) => left.score - right.score).slice(0, 2);
  const highest = [...safeScores].sort((left, right) => right.score - left.score).slice(0, 2);

  const imbalanceNotes =
    highest.length > 0 && lowest.length > 0 && highest[0].score - lowest[0].score >= 4
      ? [
          `${areaName(highest[0].areaSlug)} parece mais sustentada que ${areaName(lowest[0].areaSlug)}. Vale cuidar para uma area forte nao ser mantida as custas de uma area essencial.`
        ]
      : ["O mapa ainda parece em calibragem. Use as notas como convite de atencao, nao como rotulo."];

  const careAlerts = lowest.map(
    (item) =>
      `${areaName(item.areaSlug)} pede cuidado simples e concreto antes de aumentar compromissos.`
  );

  const doNotSacrifice = safeScores
    .filter((item) => ["faith", "health", "family", "rest"].includes(item.areaSlug) && item.score <= 5)
    .map((item) => areaName(item.areaSlug));

  return {
    averageScore,
    strongAreas,
    fragileAreas,
    neglectedAreas,
    imbalanceNotes,
    careAlerts,
    doNotSacrifice
  };
}
