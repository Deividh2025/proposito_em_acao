export * from "./types";

import type { ActionUnblockerOutput } from "@/ai/schemas";

import type { ActionUnblockerInput } from "./types";

function normalizedText(value: string | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function isCrisisText(value: string | undefined) {
  const text = normalizedText(value);

  return /\b(me machucar|me matar|quero morrer|nao quero acordar|sumir|acabar com tudo|autoagress|ferir alguem|machucar alguem|perder o controle)\b/.test(
    text
  );
}

function detectObstacle(input: ActionUnblockerInput): {
  type: ActionUnblockerOutput["obstacle_type"];
  key: ActionUnblockerOutput["obstacle_key"];
} {
  const text = normalizedText(`${input.taskTitle} ${input.obstacle}`);

  if (isCrisisText(text)) {
    return { type: "crisis", key: "other" };
  }

  if (/\b(medo|errar|fracassar|vergonha|culpa|ansios|perfeito|perfeccion)\b/.test(text)) {
    return { type: "emotional", key: text.includes("perfeit") ? "perfectionism" : "fear" };
  }

  if (/\b(cansad|sono|sem energia|exaust|esgotad)\b/.test(text) || input.energyLevel === "low") {
    return { type: "energy", key: "energy" };
  }

  if (/\b(nao sei|por onde comecar|confus|grande demais)\b/.test(text)) {
    return { type: "unclear", key: "clarity" };
  }

  if (/\b(sem tempo|tempo|prazo|atrasad|sobrecarg)\b/.test(text)) {
    return { type: "operational", key: text.includes("sobrecarg") ? "overload" : "time" };
  }

  return { type: "operational", key: "other" };
}

function focusMinutes(input: ActionUnblockerInput) {
  if (input.availableMinutes <= 2) {
    return 2;
  }

  if (input.energyLevel === "low") {
    return Math.min(input.availableMinutes, 5);
  }

  return Math.min(input.availableMinutes, input.energyLevel === "high" ? 15 : 10);
}

export function buildActionUnblockerMock(input: ActionUnblockerInput): ActionUnblockerOutput {
  const obstacle = detectObstacle(input);
  const minutes = focusMinutes(input);
  const taskTitle = input.taskTitle.trim() || "a tarefa";
  const firstStep =
    obstacle.type === "crisis"
      ? "Pausar a tarefa agora e buscar ajuda humana imediata antes de tentar produzir."
      : `Abrir ${taskTitle} e fazer so o primeiro movimento por 2 minutos.`;
  const suggestMetacognition = obstacle.type === "emotional";

  return {
    schema_version: "action_unblocker_output_v1",
    obstacle_type: obstacle.type,
    obstacle_key: obstacle.key,
    state_summary:
      obstacle.type === "crisis"
        ? "O relato indica risco emocional grave; a prioridade e seguranca, nao produtividade."
        : `Trava em ${taskTitle} com energia ${input.energyLevel} e ${input.availableMinutes} minutos disponiveis.`,
    first_step: firstStep,
    minimum_viable_action:
      obstacle.type === "crisis"
        ? "Interromper a pressao de execucao e falar com uma pessoa segura ou servico local de emergencia."
        : `Fazer uma versao minima: escrever, separar ou abrir apenas uma parte de ${taskTitle}.`,
    microtasks:
      obstacle.type === "crisis"
        ? [
            { title: "Afastar-se da pressao da tarefa", estimated_minutes: 2, order: 1 },
            { title: "Chamar uma pessoa de confianca", estimated_minutes: 3, order: 2 }
          ]
        : [
            { title: "Abrir o lugar certo da tarefa", estimated_minutes: 2, order: 1 },
            { title: "Definir o proximo gesto visivel", estimated_minutes: Math.min(3, minutes), order: 2 },
            { title: "Registrar onde parar", estimated_minutes: 2, order: 3 }
          ],
    recommended_focus_minutes: obstacle.type === "crisis" ? 2 : minutes,
    immediate_reward:
      obstacle.type === "crisis"
        ? "Respirar e avisar alguem seguro; seguranca vem antes de desempenho."
        : "Marcar a retomada e beber agua ou alongar por um minuto.",
    reorientation_phrase:
      input.tone === "firme"
        ? "Responsabilidade agora e escolher o menor passo seguro, nao vencer a tarefa inteira."
        : "Nao preciso resolver tudo; preciso iniciar de forma honesta e pequena.",
    restart_plan:
      obstacle.type === "crisis"
        ? "Nao retomar sozinho enquanto houver risco. Procurar apoio humano imediato."
        : "Se travar de novo, reduzir para 2 minutos, nomear o obstaculo e escolher uma rota: foco curto, descanso ou Metacognicao.",
    next_route:
      obstacle.type === "crisis"
        ? "human_help"
        : suggestMetacognition
          ? "metacognition"
          : obstacle.type === "energy" && input.availableMinutes <= 5
            ? "rest"
            : "focus",
    suggest_metacognition: suggestMetacognition,
    reason_to_suggest_metacognition: suggestMetacognition
      ? "A trava parece sustentada por pensamento automatico, medo, culpa ou perfeccionismo."
      : null,
    crisis_detected: obstacle.type === "crisis",
    human_help_recommended: obstacle.type === "crisis",
    safety_note:
      obstacle.type === "crisis"
        ? "Este fluxo nao deve analisar profundamente nem transformar risco emocional em produtividade."
        : null,
    confidence_level: obstacle.type === "crisis" ? "high" : "medium",
    user_review_required: true
  };
}
