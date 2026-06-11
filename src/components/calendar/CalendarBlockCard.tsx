"use client";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import {
  completeCalendarBlock,
  formatCalendarTimeLabel,
  getCalendarBlockDurationMinutes,
  rescheduleCalendarBlock
} from "@/domain/calendar";
import type { CalendarBlock } from "@/domain/calendar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

type CalendarBlockCardProps = {
  block: CalendarBlock;
  onChange: (block: CalendarBlock, message: string) => void;
  onCancel: (blockId: string, message: string) => void;
};

const typeLabels: Record<CalendarBlock["type"], string> = {
  task: "Tarefa",
  focus: "Foco",
  habit_placeholder: "Hábito futuro",
  recurring_work: "Trabalho recorrente",
  rest: "Descanso",
  family: "Família",
  spirituality: "Espiritualidade",
  health: "Saúde",
  learning: "Aprendizado",
  service: "Serviço",
  appointment: "Compromisso",
  buffer: "Buffer"
};

export function CalendarBlockCard({ block, onCancel, onChange }: CalendarBlockCardProps) {
  const duration = getCalendarBlockDurationMinutes(block);

  function completeBlock() {
    onChange(completeCalendarBlock(block), "Bloco marcado como concluído nesta sessão local/dev.");
  }

  function rescheduleBlock() {
    const start = new Date(block.startTime);
    const end = new Date(block.endTime);
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
    onChange(
      rescheduleCalendarBlock(block, {
        startTime: start.toISOString(),
        endTime: end.toISOString()
      }),
      "Bloco reagendado sem culpa."
    );
  }

  return (
    <Card as="article" className={block.status === "completed" ? "bg-purpose-50" : ""}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge intent={block.type === "rest" || block.type === "family" ? "warning" : "purpose"}>
            {typeLabels[block.type]}
          </Badge>
          <h3 className="mt-2 font-bold text-ink-900">{block.title}</h3>
        </div>
        <Tag>{duration} min</Tag>
      </div>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        {formatCalendarTimeLabel(block.startTime)} - {formatCalendarTimeLabel(block.endTime)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {block.energyLevel ? <Tag>energia {block.energyLevel}</Tag> : null}
        <Tag>{block.status}</Tag>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={completeBlock} size="sm" variant="soft">
          <CheckCircle2 aria-hidden className="h-4 w-4" />
          Concluir
        </Button>
        <Button
          aria-label={`Reagendar ${block.title}`}
          onClick={rescheduleBlock}
          size="sm"
          variant="outline"
        >
          <RotateCcw aria-hidden className="h-4 w-4" />
          Reagendar
        </Button>
        <Button
          aria-label={`Cancelar ${block.title}`}
          intent="danger"
          onClick={() => onCancel(block.id, "Bloco cancelado nesta sessão local/dev.")}
          size="sm"
          variant="ghost"
        >
          <XCircle aria-hidden className="h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </Card>
  );
}
