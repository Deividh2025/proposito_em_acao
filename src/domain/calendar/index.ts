export * from "./types";

import type {
  CalendarBlock,
  CalendarBlockType,
  CalendarDayModel,
  CalendarWeekModel,
  RescheduleCalendarBlockInput
} from "./types";

const protectedBlockTypes = new Set<CalendarBlockType>([
  "rest",
  "family",
  "spirituality",
  "health",
  "buffer"
]);

export const sampleCalendarBlocks: CalendarBlock[] = [
  {
    id: "block-spirituality",
    title: "Oração e direção do dia",
    type: "spirituality",
    status: "scheduled",
    startTime: "2026-06-01T07:30:00-03:00",
    endTime: "2026-06-01T07:50:00-03:00",
    energyLevel: "low"
  },
  {
    id: "block-finances-task",
    title: "Organizar finanças",
    type: "task",
    status: "scheduled",
    startTime: "2026-06-01T09:00:00-03:00",
    endTime: "2026-06-01T09:45:00-03:00",
    energyLevel: "medium",
    taskId: "task-financas",
    projectId: "project-financas",
    goalId: "goal-financas"
  },
  {
    id: "block-focus",
    title: "Bloco de foco do projeto",
    type: "focus",
    status: "scheduled",
    startTime: "2026-06-01T10:00:00-03:00",
    endTime: "2026-06-01T11:30:00-03:00",
    energyLevel: "high",
    taskId: "task-financas"
  },
  {
    id: "block-rest",
    title: "Descanso real depois do almoço",
    type: "rest",
    status: "scheduled",
    startTime: "2026-06-01T13:00:00-03:00",
    endTime: "2026-06-01T13:30:00-03:00",
    energyLevel: "low"
  },
  {
    id: "block-family",
    title: "Jantar em família",
    type: "family",
    status: "scheduled",
    startTime: "2026-06-02T19:00:00-03:00",
    endTime: "2026-06-02T20:00:00-03:00",
    energyLevel: "low"
  },
  {
    id: "block-recurring-work",
    title: "Rotina recorrente de trabalho",
    type: "recurring_work",
    status: "scheduled",
    startTime: "2026-06-03T08:30:00-03:00",
    endTime: "2026-06-03T09:30:00-03:00",
    energyLevel: "medium",
    recurrenceRule: "weekly"
  }
];

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalizeDateInput(date: string) {
  return new Date(`${date.slice(0, 10)}T12:00:00.000Z`);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function durationMinutes(block: Pick<CalendarBlock, "startTime" | "endTime">) {
  return Math.max(0, Math.round((Date.parse(block.endTime) - Date.parse(block.startTime)) / 60000));
}

function dayLabel(date: Date) {
  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return labels[date.getUTCDay()] ?? "Dia";
}

export function getCalendarBlockDurationMinutes(block: CalendarBlock) {
  return durationMinutes(block);
}

export function buildCalendarWeekModel(blocks: CalendarBlock[], weekStart: string): CalendarWeekModel {
  const start = normalizeDateInput(weekStart);
  const days: CalendarDayModel[] = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    const isoDate = toIsoDate(date);
    const dayBlocks = blocks
      .filter((block) => block.startTime.slice(0, 10) === isoDate)
      .sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));

    return {
      date: isoDate,
      label: dayLabel(date),
      blocks: dayBlocks,
      totalScheduledMinutes: dayBlocks.reduce((total, block) => total + durationMinutes(block), 0),
      highEnergyBlockCount: dayBlocks.filter((block) => block.energyLevel === "high").length,
      protectedBlockCount: dayBlocks.filter((block) => protectedBlockTypes.has(block.type)).length
    };
  });

  return {
    weekStart: toIsoDate(start),
    days
  };
}

export function getNextCalendarAction(blocks: CalendarBlock[], now = "2026-06-01T08:00:00-03:00") {
  return blocks
    .filter((block) => block.status === "scheduled" && Date.parse(block.endTime) >= Date.parse(now))
    .sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime))[0];
}

export function rescheduleCalendarBlock(
  block: CalendarBlock,
  input: RescheduleCalendarBlockInput
): CalendarBlock {
  return {
    ...block,
    status: "scheduled",
    startTime: input.startTime,
    endTime: input.endTime
  };
}

export function completeCalendarBlock(block: CalendarBlock): CalendarBlock {
  return {
    ...block,
    status: "completed"
  };
}

export function detectScheduleOverload(blocks: CalendarBlock[]) {
  const days = buildCalendarWeekModel(blocks, blocks[0]?.startTime.slice(0, 10) ?? "2026-06-01").days;
  const heavyDays = days.filter(
    (day) => day.highEnergyBlockCount >= 3 || (day.highEnergyBlockCount >= 2 && day.totalScheduledMinutes > 240)
  );
  const daysWithoutRest = days.filter(
    (day) => day.blocks.length > 0 && !day.blocks.some((block) => protectedBlockTypes.has(block.type))
  );
  const overloadLevel: "low" | "medium" | "high" =
    heavyDays.length > 0 ? "high" : daysWithoutRest.length > 0 ? "medium" : "low";
  const reasons = [
    ...(heavyDays.length > 0 ? ["Muitos blocos de alta energia ou tempo total alto no mesmo dia."] : []),
    ...(daysWithoutRest.length > 0 ? ["Há dias com execução sem descanso, família, espiritualidade ou buffer."] : [])
  ];

  return {
    schema_version: "schedule_overload_output_v1" as const,
    overload_level: overloadLevel,
    message:
      overloadLevel === "low"
        ? "A agenda parece respirável para este recorte."
        : "Esta agenda parece pesada para sua energia atual. Considere reduzir ou proteger um bloco de descanso.",
    reasons: reasons.length > 0 ? reasons : ["Há equilíbrio inicial entre execução e cuidado."],
    recommended_adjustments:
      overloadLevel === "low"
        ? ["Manter blocos protegidos como compromissos reais."]
        : [
            "Proteger um bloco de descanso antes de adicionar outra entrega.",
            "Mover um bloco de alta energia para outro dia.",
            "Reduzir uma tarefa para a versão mínima aceitável."
          ],
    user_review_required: true as const
  };
}

export const unscheduledTaskSummaries = [
  {
    id: "task-financas",
    title: "Organizar finanças",
    nextAction: "Abrir extrato",
    energyLevel: "medium",
    estimatedMinutes: 45,
    projectTitle: "Plano inicial: organizar vida financeira"
  },
  {
    id: "task-descanso",
    title: "Proteger descanso da semana",
    nextAction: "Escolher um bloco de 30 minutos",
    energyLevel: "low",
    estimatedMinutes: 30,
    projectTitle: "Ecologia da rotina"
  },
  {
    id: "task-servico",
    title: "Preparar gesto de serviço",
    nextAction: "Listar uma pessoa para apoiar",
    energyLevel: "low",
    estimatedMinutes: 20,
    projectTitle: "Serviço alinhado ao Chamado"
  }
] as const;
