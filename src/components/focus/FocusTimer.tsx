"use client";

import { TimerReset } from "lucide-react";

import { formatFocusTime } from "@/domain/focus";

type FocusTimerProps = {
  remainingSeconds: number;
  durationMinutes: number;
  status: "setup" | "running" | "paused" | "completed";
};

export function FocusTimer({ durationMinutes, remainingSeconds, status }: FocusTimerProps) {
  return (
    <section className="rounded-card border border-purpose-100 bg-purpose-50 p-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-purpose-700">
        <TimerReset aria-hidden className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-purpose-700">
        {status === "running" ? "Foco em andamento" : status === "paused" ? "Pausa consciente" : "Preparar foco"}
      </p>
      <p className="mt-3 font-mono text-6xl font-bold tracking-normal text-ink-900">
        {formatFocusTime(remainingSeconds)}
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        Sessao de {durationMinutes} minutos. Capture distracoes e volte para a proxima acao.
      </p>
    </section>
  );
}
