"use client";

import type { InboxClassificationOutput } from "@/ai/schemas";
import type { InboxDestinationType } from "@/domain/inbox";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { useState } from "react";
import { InboxClassificationBadge } from "./InboxClassificationBadge";

type InboxProcessPanelProps = {
  classification?: InboxClassificationOutput | null;
  onConvert: (destinationType: InboxDestinationType) => void;
};

const destinationOptions: Array<{ label: string; value: InboxDestinationType }> = [
  { label: "Tarefa", value: "task" },
  { label: "Projeto", value: "project" },
  { label: "Bloco de calendário", value: "calendar_event" },
  { label: "Hábito futuro", value: "habit" },
  { label: "Referência", value: "reference" },
  { label: "Ideia futura", value: "future_idea" },
  { label: "Descartar", value: "discard" },
  { label: "Pedir clareza", value: "needs_clarification" }
];

function recommendedDestination(classification?: InboxClassificationOutput | null): InboxDestinationType {
  if (!classification) {
    return "needs_clarification";
  }

  if (classification.classification === "calendar_event") {
    return "calendar_event";
  }

  if (classification.classification === "task") {
    return "task";
  }

  if (classification.classification === "project") {
    return "project";
  }

  if (classification.classification === "reference") {
    return "reference";
  }

  if (classification.classification === "discard") {
    return "discard";
  }

  if (classification.classification === "future_idea") {
    return "future_idea";
  }

  return "needs_clarification";
}

export function InboxProcessPanel({ classification, onConvert }: InboxProcessPanelProps) {
  const [destination, setDestination] = useState<InboxDestinationType>(recommendedDestination(classification));

  if (!classification) {
    return (
      <EmptyState
        description="Classifique uma captura para escolher destino sem transformar tudo em tarefa."
        title="Classificação pendente"
      />
    );
  }

  const actionLabel = classification.recommended_action === "schedule" ? "Agendar" : classification.recommended_action;

  return (
    <Card aria-label="Processamento da captura" as="section" className="space-y-4">
      <div>
        <InboxClassificationBadge classification={classification.classification} />
        <h2 className="font-bold text-ink-900">{classification.suggested_title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-600">{classification.summary}</p>
      </div>
      <dl className="grid gap-2 text-sm text-ink-700">
        <div className="flex justify-between gap-3">
          <dt>Ação sugerida</dt>
          <dd className="font-semibold text-ink-900">{actionLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Confiança</dt>
          <dd className="font-semibold text-ink-900">{classification.confidence}</dd>
        </div>
      </dl>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Destino revisável
        <Select value={destination} onChange={(event) => setDestination(event.target.value as InboxDestinationType)}>
          {destinationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </label>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => onConvert("task")} variant="outline">
          Converter em tarefa
        </Button>
        <Button onClick={() => onConvert("calendar_event")}>Converter em bloco</Button>
        <Button onClick={() => onConvert(destination)} variant="soft">
          Processar destino
        </Button>
      </div>
    </Card>
  );
}
