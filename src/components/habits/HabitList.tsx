"use client";

import { useState, useTransition } from "react";

import { logHabit } from "@/app/habits/actions";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Habit, HabitLogStatus } from "@/domain/habits";
import { HabitLogButton } from "./HabitLogButton";

const sampleHabits: Habit[] = [
  {
    id: "local-habit-prayer",
    title: "Leitura breve pela manha",
    status: "active",
    identityStatement: "Sou alguem que volta ao essencial antes da pressa.",
    whyItMatters: "Comecar pequeno protege direcao antes de agenda.",
    lifeArea: "Espiritualidade",
    trigger: "Depois de beber agua pela manha",
    minimumVersion: "Ler por 2 minutos",
    idealVersion: "Ler e anotar uma frase",
    frequency: "daily",
    scheduleSuggestion: "Antes do primeiro bloco de trabalho",
    reward: "Marcar minimo feito",
    likelyObstacle: "pressa",
    ifThenPlan: "Se houver pressa, ler uma frase e marcar minimo.",
    environmentDesign: "Livro ou nota aberta na mesa.",
    metric: "minimo/ideal/retomada",
    restartPlan: "Voltar no proximo contexto sem compensar com excesso."
  }
];

export function HabitList() {
  const [habits] = useState(sampleHabits);
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
      </div>
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
      {lastStatus ? <p className="text-sm leading-6 text-ink-600">{lastStatus}</p> : null}
    </Card>
  );
}
