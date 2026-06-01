"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { FocusDistraction, FocusDistractionType } from "@/domain/focus";

type DistractionCaptureProps = {
  disabled?: boolean;
  distractions: FocusDistraction[];
  onCapture: (input: { content: string; routeToInbox: boolean; type: FocusDistractionType }) => void;
};

const typeOptions: Array<{ label: string; value: FocusDistractionType }> = [
  { label: "Pensamento", value: "thought" },
  { label: "Ideia", value: "idea" },
  { label: "Lembrete", value: "reminder" },
  { label: "Tarefa paralela", value: "parallel_task" },
  { label: "Preocupacao", value: "concern" },
  { label: "Link", value: "link" },
  { label: "Nota", value: "note" }
];

export function DistractionCapture({ disabled, distractions, onCapture }: DistractionCaptureProps) {
  const [content, setContent] = useState("");
  const [type, setType] = useState<FocusDistractionType>("thought");
  const [routeToInbox, setRouteToInbox] = useState(false);

  function submit() {
    if (content.trim().length < 2) return;
    onCapture({ content, routeToInbox, type });
    setContent("");
    setRouteToInbox(false);
  }

  return (
    <section className="rounded-card border border-ink-100 bg-white p-4">
      <div>
        <h2 className="font-bold text-ink-900">Capturar distracao</h2>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Tire da cabeca, salve e volte para o timer. Sem classificar agora.
        </p>
      </div>
      <div className="mt-4 grid gap-3">
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Tipo
          <Select disabled={disabled} value={type} onChange={(event) => setType(event.target.value as FocusDistractionType)}>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Nota curta
          <Textarea
            disabled={disabled}
            maxLength={500}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Ex.: responder mensagem depois do foco"
            value={content}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
          <input
            checked={routeToInbox}
            className="h-4 w-4 rounded border-ink-300"
            disabled={disabled}
            onChange={(event) => setRouteToInbox(event.target.checked)}
            type="checkbox"
          />
          Enviar tambem para Inbox
        </label>
        <Button disabled={disabled || content.trim().length < 2} onClick={submit} variant="soft">
          <Plus aria-hidden className="h-4 w-4" />
          Capturar e voltar
        </Button>
      </div>
      {distractions.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            Capturadas nesta sessao
          </p>
          {distractions.slice(0, 4).map((distraction) => (
            <p
              className="rounded-control bg-ink-50 px-3 py-2 text-sm leading-6 text-ink-700"
              key={distraction.id}
            >
              {distraction.content}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
