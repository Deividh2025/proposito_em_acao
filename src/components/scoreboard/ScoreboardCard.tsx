"use client";

import { useState, useTransition } from "react";
import { Gauge, Sparkles } from "lucide-react";

import {
  createScoreboard,
  generateScoreboardPlanDraft,
  markScoreboardItem,
  persistScoreboardPlan
} from "@/app/scoreboard/actions";
import type { ScoreboardPlanOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import type { DisciplineScoreboard, ScoreboardEntryStatus } from "@/domain/scoreboard";
import { RestartCountBadge } from "./RestartCountBadge";
import { ScoreboardItem } from "./ScoreboardItem";
import { ScoreboardTrend } from "./ScoreboardTrend";
import { StreakSoftIndicator } from "./StreakSoftIndicator";

const sampleScoreboard: DisciplineScoreboard = {
  id: "local-scoreboard-default",
  title: "Placar leve da semana",
  period: "weekly",
  visibility: "private",
  items: [
    {
      id: "local-scoreboard-focus",
      title: "Sessao de foco honesta",
      type: "focus",
      targetFrequency: "3 vezes na semana",
      minimumSuccess: "5 minutos com distracoes capturadas"
    },
    {
      id: "local-scoreboard-restart",
      title: "Retomada sem culpa",
      type: "restart",
      targetFrequency: "quando houver queda",
      minimumSuccess: "voltar com uma microacao"
    }
  ]
};

export function ScoreboardCard() {
  const [scoreboard, setScoreboard] = useState(sampleScoreboard);
  const [focus, setFocus] = useState("execucao diaria");
  const [period, setPeriod] = useState<"daily" | "weekly" | "custom">("weekly");
  const [plan, setPlan] = useState<ScoreboardPlanOutput | null>(null);
  const [message, setMessage] = useState("");
  const [restartCount, setRestartCount] = useState(2);
  const [isPending, startTransition] = useTransition();

  function createLocalScoreboard() {
    startTransition(async () => {
      const result = await createScoreboard({ period, title: scoreboard.title });
      setMessage(result.message);
    });
  }

  function generatePlan() {
    startTransition(async () => {
      const result = await generateScoreboardPlanDraft({ focus, period });
      if (result.output) {
        setPlan(result.output);
      }
      setMessage(result.message);
    });
  }

  function savePlan() {
    if (!plan) return;

    startTransition(async () => {
      const result = await persistScoreboardPlan({ output: plan });
      setMessage(result.message);
      setScoreboard({
        id: result.id ?? scoreboard.id,
        items: plan.items.map((item, index) => ({
          id: `local-plan-item-${index}`,
          title: item.title,
          type: item.type,
          targetFrequency: item.target_frequency,
          minimumSuccess: item.minimum_success,
          linkedGoalId: item.linked_goal_id ?? undefined,
          linkedHabitId: item.linked_habit_id ?? undefined,
          linkedTaskId: item.linked_task_id ?? undefined
        })),
        period: plan.period,
        title: plan.scoreboard_title,
        visibility: "private"
      });
    });
  }

  function mark(itemId: string, status: ScoreboardEntryStatus) {
    if (status === "restarted") {
      setRestartCount((current) => current + 1);
    }

    startTransition(async () => {
      const result = await markScoreboardItem({
        itemId,
        scoreboardId: scoreboard.id,
        status
      });
      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-5">
        <Card as="section" className="space-y-4">
          <div className="flex items-start gap-3">
            <Gauge aria-hidden className="mt-1 h-5 w-5 text-purpose-700" />
            <div>
              <h2 className="text-xl font-bold text-ink-900">Configurar Placar</h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                Poucos itens, marcacao rapida e retomada como progresso.
              </p>
            </div>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Titulo
            <Input value={scoreboard.title} onChange={(event) => setScoreboard((current) => ({ ...current, title: event.target.value }))} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Periodo
            <Select value={period} onChange={(event) => setPeriod(event.target.value as "daily" | "weekly" | "custom")}>
              <option value="daily">diario</option>
              <option value="weekly">semanal</option>
              <option value="custom">personalizado</option>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Foco do Placar
            <Input value={focus} onChange={(event) => setFocus(event.target.value)} />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button disabled={isPending} onClick={createLocalScoreboard} variant="soft">
              Criar Placar
            </Button>
            <Button disabled={isPending} onClick={generatePlan}>
              <Sparkles aria-hidden className="h-4 w-4" />
              Sugerir por mock
            </Button>
          </div>
          {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
        </Card>

        {plan ? (
          <Card as="section" className="space-y-3">
            <h2 className="font-bold text-ink-900">{plan.scoreboard_title}</h2>
            <p className="text-sm leading-6 text-ink-600">{plan.visual_guidance}</p>
            <ul className="space-y-2 text-sm leading-6 text-ink-700">
              {plan.items.map((item) => (
                <li key={item.title}>{item.title}: {item.minimum_success}</li>
              ))}
            </ul>
            <Button disabled={isPending} onClick={savePlan}>
              Salvar Placar revisado
            </Button>
          </Card>
        ) : null}

        <Card as="section" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-ink-900">{scoreboard.title}</h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">Privado por padrao. Sem ranking, sem vergonha.</p>
            </div>
            <RestartCountBadge count={restartCount} />
          </div>
          <div className="space-y-3">
            {scoreboard.items.map((item) => (
              <ScoreboardItem disabled={isPending} item={item} key={item.id} onMark={mark} />
            ))}
          </div>
        </Card>
      </div>

      <aside className="space-y-4">
        <SensitiveDataNotice title="Placar privado por padrao">
          O Placar completo nao vai ao Atalaia. Futuro compartilhamento exige resumo limitado, consentimento e previa.
        </SensitiveDataNotice>
        <StreakSoftIndicator />
        <ScoreboardTrend />
      </aside>
    </div>
  );
}
