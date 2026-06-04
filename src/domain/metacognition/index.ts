export * from "./types";

import type { MetacognitionOutput } from "@/ai/schemas";
import { isCrisisText } from "@/domain/action-unblocker";

import type { MetacognitionCategory, MetacognitionInput } from "./types";

function normalizedText(value: string | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function detectCategory(input: MetacognitionInput): MetacognitionCategory {
  const text = normalizedText(`${input.stateText} ${input.automaticThought} ${input.impulse}`);

  if (/ansios|ansiedad/.test(text)) return "anxiety";
  if (/\b(angusti|aperto)\b/.test(text)) return "anguish";
  if (/\b(procrastin|adiand)\b/.test(text)) return "procrastination";
  if (/\b(paralis|trav)\b/.test(text)) return "paralysis";
  if (/\b(perfeit|perfeccion)\b/.test(text)) return "perfectionism";
  if (/\b(rumin|pensando demais)\b/.test(text)) return "rumination";
  if (/\b(culpa|culpad)\b/.test(text)) return "guilt";
  if (/\b(vitim|ninguem me ajuda)\b/.test(text)) return "victimization";
  if (/\b(raiva|irritad)\b/.test(text)) return "anger";
  if (/\b(medo|receio)\b/.test(text)) return "fear";
  if (/\b(confus|nao sei)\b/.test(text)) return "confusion";
  if (/\b(evitar|fugir|sumir)\b/.test(text)) return "avoidance";
  if (/\b(sobrecarg|demais)\b/.test(text)) return "overload";
  if (/\b(cansad|sem energia|sono)\b/.test(text)) return "low_energy";

  return "other";
}

function intensityLevel(intensity: number) {
  if (intensity >= 8) return "high" as const;
  if (intensity >= 4) return "medium" as const;
  return "low" as const;
}

function cognitivePatterns(text: string) {
  const normalized = normalizedText(text);
  const patterns = new Set<string>();

  if (/\b(sempre|nunca|tudo|nada)\b/.test(normalized)) patterns.add("generalizacao excessiva");
  if (/\b(vai dar errado|catastrof|perder tudo)\b/.test(normalized)) patterns.add("catastrofizacao");
  if (/\b(sinto que|parece que)\b/.test(normalized)) patterns.add("raciocinio emocional");
  if (/\b(sou um fracasso|incapaz|inutil)\b/.test(normalized)) patterns.add("rotulacao");
  if (/\b(deveria|tenho que|preciso ser perfeito)\b/.test(normalized)) patterns.add("deverias rigidos");
  if (/\b(vou falhar|nao adianta)\b/.test(normalized)) patterns.add("previsao negativa");
  if (/\b(ninguem|todos contra)\b/.test(normalized)) patterns.add("vitimizacao absoluta");

  if (patterns.size === 0) {
    patterns.add("interpretacao a testar");
  }

  return Array.from(patterns).slice(0, 6);
}

export function buildMetacognitionMock(input: MetacognitionInput): MetacognitionOutput {
  const text = `${input.stateText} ${input.automaticThought} ${input.impulse}`;
  const crisis = isCrisisText(text);
  const category = detectCategory(input);
  const feeling =
    category === "anxiety"
      ? "ansiedade"
      : category === "guilt"
        ? "culpa"
        : category === "fear"
          ? "medo"
          : category === "anger"
            ? "raiva"
            : category === "low_energy"
              ? "cansaco"
              : "tensao interna";

  if (crisis) {
    return {
      schema_version: "metacognition_output_v1",
      state_name: "Risco emocional grave",
      category: "anguish",
      intensity_observed: "high",
      fact: "O relato indica possivel risco imediato ou perda de seguranca.",
      interpretation: "Este nao e um momento para resolver produtividade nem analisar profundamente pensamentos.",
      feeling: "angustia intensa",
      impulse: "interromper a rotina e buscar presenca humana segura",
      dominant_automatic_thought: "Preciso priorizar seguranca e ajuda humana agora.",
      cognitive_patterns: ["crise fora de fluxo produtivo"],
      logical_deconstruction:
        "A prioridade agora nao e provar ou desmontar uma ideia; e reduzir risco e aproximar ajuda humana.",
      confrontation_question: "Qual pessoa segura ou servico local voce pode acionar agora?",
      reframe: "Seguranca vem antes de desempenho. Procurar ajuda humana agora e uma acao responsavel.",
      next_action: "Buscar ajuda humana imediata e, se houver risco imediato, contatar o servico local de emergencia.",
      recommended_route: "emergency_support",
      christian_anchor: null,
      safety_flags: ["risco_emocional_grave"],
      privacy_note: "Registrar somente o minimo necessario; nao compartilhar com Atalaia.",
      user_review_required: true,
      private_by_default: true,
      share_with_accountability_allowed: false
    };
  }

  return {
    schema_version: "metacognition_output_v1",
    state_name: `${feeling.charAt(0).toUpperCase()}${feeling.slice(1)} diante da acao`,
    category,
    intensity_observed: intensityLevel(input.intensity),
    fact: "A tarefa ou situacao ficou parada neste momento observavel.",
    interpretation: input.automaticThought
      ? `Estou tratando o pensamento "${input.automaticThought}" como conclusao.`
      : "Estou atribuindo um significado forte antes de testar as evidencias.",
    feeling,
    impulse: input.impulse || "evitar a proxima acao",
    dominant_automatic_thought: input.automaticThought || "Nao vou conseguir fazer isso.",
    cognitive_patterns: cognitivePatterns(text),
    logical_deconstruction:
      "O fato mostra uma dificuldade atual, nao uma sentenca sobre sua identidade ou futuro. A interpretacao precisa ser testada pelas evidencias.",
    confrontation_question: "Qual parte minima ainda esta sob sua responsabilidade agora, sem transformar isso em vergonha?",
    reframe:
      "Estou travado neste ponto, mas posso retomar com uma acao pequena, verdadeira e suficiente para hoje.",
    next_action: "Abrir a tarefa e executar um passo de 2 a 5 minutos.",
    recommended_route: category === "low_energy" ? "rest" : "action_unblocker",
    christian_anchor: input.allowChristianAnchor
      ? "Como reflexao opcional: mordomia tambem inclui voltar com verdade, descanso e responsabilidade."
      : null,
    safety_flags: [],
    privacy_note: "Sessao privada por padrao; nao vai ao Atalaia nem a logs brutos.",
    user_review_required: true,
    private_by_default: true,
    share_with_accountability_allowed: false
  };
}
