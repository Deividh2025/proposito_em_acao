"use client";

import { useState, useTransition } from "react";

import { logHabit } from "@/app/habits/actions";
import { Button } from "@/components/ui/Button";
import type { HabitLogStatus } from "@/domain/habits";

const habit = {
  id: "local-mobile-habit",
  title: "Leitura breve pela manhã",
  minimum: "Ler por 2 minutos"
};

export function MobileHabitCheck() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function mark(status: HabitLogStatus) {
    startTransition(async () => {
      const result = await logHabit({ habitId: habit.id, status });
      setMessage(`Hábito atualizado. ${result.message}`);
    });
  }

  return (
    <section className="space-y-4 rounded-card border border-ink-100 bg-white p-4 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-purpose-700">Hoje</p>
        <h2 className="mt-1 text-xl font-bold text-ink-900">{habit.title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-600">{habit.minimum}</p>
      </div>
      <div className="grid gap-2">
        <Button disabled={isPending} onClick={() => mark("done_minimum")}>
          Mínimo feito
        </Button>
        <Button disabled={isPending} onClick={() => mark("done_ideal")} variant="soft">
          Ideal feito
        </Button>
        <Button disabled={isPending} onClick={() => mark("restarted")} variant="soft">
          Retomado
        </Button>
        <Button disabled={isPending} onClick={() => mark("paused_consciously")} variant="outline">
          Pular com consciência
        </Button>
      </div>
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
    </section>
  );
}
