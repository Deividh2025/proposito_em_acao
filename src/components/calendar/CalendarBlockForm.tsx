"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";

import { createCalendarBlock } from "@/app/calendar/actions";
import type { CalendarBlock, CalendarBlockType } from "@/domain/calendar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

type CalendarBlockFormProps = {
  onCreate: (block: CalendarBlock, message: string) => void;
};

const blockTypes: Array<{ label: string; value: CalendarBlockType }> = [
  { label: "Tarefa", value: "task" },
  { label: "Foco", value: "focus" },
  { label: "Trabalho recorrente", value: "recurring_work" },
  { label: "Descanso", value: "rest" },
  { label: "Família", value: "family" },
  { label: "Espiritualidade", value: "spirituality" },
  { label: "Saúde", value: "health" },
  { label: "Aprendizado", value: "learning" },
  { label: "Serviço", value: "service" },
  { label: "Compromisso", value: "appointment" },
  { label: "Buffer", value: "buffer" },
  { label: "Hábito futuro", value: "habit_placeholder" }
];

function normalizeLocalDateTime(value: string) {
  return value.length === 16 ? `${value}:00-03:00` : value;
}

export function CalendarBlockForm({ onCreate }: CalendarBlockFormProps) {
  const [title, setTitle] = useState("Organizar finanças");
  const [type, setType] = useState<CalendarBlockType>("task");
  const [startTime, setStartTime] = useState("2026-06-01T09:00");
  const [endTime, setEndTime] = useState("2026-06-01T09:45");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    const block: CalendarBlock = {
      id: `local-${Date.now()}`,
      title,
      type,
      status: "scheduled",
      startTime: normalizeLocalDateTime(startTime),
      endTime: normalizeLocalDateTime(endTime),
      energyLevel: type === "focus" ? "high" : type === "rest" ? "low" : "medium",
      notes
    };

    startTransition(async () => {
      const result = await createCalendarBlock({
        title,
        type,
        startTime: block.startTime,
        endTime: block.endTime,
        notes
      });
      onCreate({ ...block, id: result.id ?? block.id }, result.message);
    });
  }

  return (
    <Card as="section" className="space-y-4">
      <div>
        <h2 className="font-bold text-ink-900">Criar bloco</h2>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Agende a próxima ação sem depender de arrastar e soltar.
        </p>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Título do bloco
        <Input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Tipo de bloco
        <Select value={type} onChange={(event) => setType(event.target.value as CalendarBlockType)}>
          {blockTypes.map((blockType) => (
            <option key={blockType.value} value={blockType.value}>
              {blockType.label}
            </option>
          ))}
        </Select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Início
          <Input type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Fim
          <Input type="datetime-local" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Observação opcional
        <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
      </label>
      <Button disabled={isPending} onClick={submit}>
        <Plus aria-hidden className="h-4 w-4" />
        Criar bloco
      </Button>
    </Card>
  );
}
