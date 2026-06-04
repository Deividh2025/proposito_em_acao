"use client";

import { useState, useTransition } from "react";

import { logHabit } from "@/app/habits/actions";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Habit, HabitLogStatus } from "@/domain/habits";
import { HabitLogButton } from "./HabitLogButton";

type HabitListProps = {
  canUseSampleData?: boolean;
  dataMessage: string;
  initialHabits: Habit[];
};

export function HabitList({ canUseSampleData = false, dataMessage, initialHabits }: HabitListProps) {
  const [habits] = useState(initialHabits);
  const [lastStatus, setLastStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  function mark(habitId: string, status: HabitLogStatus) {
    startTransition(async () => {
      const result = await logHabit({ habitId, status });
      setLastStatus(result.message);
    });
  }

  return (
    <Card as="section" className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Habitos de hoje</h2>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          Marque o minimo antes do ideal. Pausa consciente tambem e escolha registrada.
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          {canUseSampleData ? "Amostra local-demo: " : ""}{dataMessage}
        </p>
      </div>
      {habits.length === 0 ? (
        <p className="rounded-card border border-dashed border-ink-200 bg-ink-50 p-4 text-sm leading-6 text-ink-600">
          Nenhum habito real salvo ainda. Crie um habito revisavel para marcar a versao minima.
        </p>
      ) : (
      <div className="space-y-3">
        {habits.map((habit) => (
          <div className="rounded-card border border-ink-100 bg-ink-50 p-4" key={habit.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink-900">{habit.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-600">{habit.minimumVersion}</p>
              </div>
              <Badge intent="purpose">{habit.frequency}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <HabitLogButton disabled={isPending} label="Fiz o minimo" onLog={(status) => mark(habit.id, status)} status="done_minimum" />
              <HabitLogButton disabled={isPending} label="Fiz o ideal" onLog={(status) => mark(habit.id, status)} status="done_ideal" />
              <HabitLogButton disabled={isPending} label="Retomei" onLog={(status) => mark(habit.id, status)} status="restarted" />
              <HabitLogButton disabled={isPending} label="Pausei consciente" onLog={(status) => mark(habit.id, status)} status="paused_consciously" />
            </div>
          </div>
        ))}
      </div>
      )}
      {lastStatus ? <p className="text-sm leading-6 text-ink-600">{lastStatus}</p> : null}
    </Card>
  );
}
