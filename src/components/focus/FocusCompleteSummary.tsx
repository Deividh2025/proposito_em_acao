"use client";

import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { FocusDistraction } from "@/domain/focus";

type FocusCompleteSummaryProps = {
  distractions: FocusDistraction[];
  message: string;
};

export function FocusCompleteSummary({ distractions, message }: FocusCompleteSummaryProps) {
  return (
    <Card as="section" className="border-purpose-100 bg-purpose-50">
      <div className="flex items-start gap-3">
        <CheckCircle2 aria-hidden className="mt-1 h-5 w-5 shrink-0 text-purpose-700" />
        <div>
          <h2 className="font-bold text-ink-900">Sessao registrada</h2>
          <p className="mt-2 text-sm leading-6 text-ink-700">{message}</p>
          <p className="mt-3 text-sm leading-6 text-ink-700">
            Distracoes capturadas: {distractions.length}. Agora escolha o menor proximo passo ou descanso legitimo.
          </p>
        </div>
      </div>
    </Card>
  );
}
