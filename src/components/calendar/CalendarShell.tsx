"use client";

import { CalendarDays, Inbox, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import {
  buildCalendarWeekModel,
  detectScheduleOverload,
  getNextCalendarAction
} from "@/domain/calendar";
import type { CalendarBlock } from "@/domain/calendar";
import type { InboxItem } from "@/domain/inbox";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { SuccessState } from "@/components/ui/SuccessState";
import { Tag } from "@/components/ui/Tag";
import { CalendarBlockForm } from "./CalendarBlockForm";
import { DayView } from "./DayView";
import { ScheduleOverloadAlert } from "./ScheduleOverloadAlert";
import { UnscheduledTasksPanel } from "./UnscheduledTasksPanel";
import { WeekView } from "./WeekView";

type CalendarMode = "week" | "day";

type CalendarShellProps = {
  canUseSampleData: boolean;
  dataMessage: string;
  dataSource: "authenticated" | "blocked" | "error" | "local-demo";
  initialBlocks: CalendarBlock[];
  recentInboxItems: InboxItem[];
  weekStart: string;
};

export function CalendarShell({
  canUseSampleData,
  dataMessage,
  dataSource,
  initialBlocks,
  recentInboxItems,
  weekStart
}: CalendarShellProps) {
  const [blocks, setBlocks] = useState<CalendarBlock[]>(initialBlocks);
  const [mode, setMode] = useState<CalendarMode>("week");
  const [message, setMessage] = useState("");
  const week = useMemo(() => buildCalendarWeekModel(blocks, weekStart), [blocks, weekStart]);
  const selectedDay = week.days[0]!;
  const nextAction = getNextCalendarAction(
    blocks,
    canUseSampleData ? "2026-06-01T08:00:00-03:00" : new Date().toISOString()
  );
  const overloadAlert = detectScheduleOverload(blocks);
  const hasDataWarning = dataSource === "blocked" || dataSource === "error";

  function upsertBlock(block: CalendarBlock, nextMessage: string) {
    setBlocks((current) => {
      const exists = current.some((item) => item.id === block.id);
      return exists ? current.map((item) => (item.id === block.id ? block : item)) : [...current, block];
    });
    setMessage(nextMessage);
  }

  function cancelBlock(blockId: string, nextMessage: string) {
    setBlocks((current) => current.filter((block) => block.id !== blockId));
    setMessage(nextMessage);
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card as="section" className="border-purpose-100 bg-purpose-50">
          <Badge intent="purpose">Próxima ação</Badge>
          <h2 className="mt-3 text-2xl font-bold text-purpose-900">
            {nextAction?.title ?? "Escolher um bloco pequeno para hoje"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-purpose-900">
            O calendário existe para colocar a direção no tempo, protegendo descanso, família e espiritualidade.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag>Chamado antes de agenda</Tag>
            <Tag>sem culpa ao reagendar</Tag>
          </div>
        </Card>
        <ScheduleOverloadAlert alert={overloadAlert} />
      </section>

      <div className="flex flex-col gap-3 rounded-panel border border-ink-100 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays aria-hidden className="h-5 w-5 text-purpose-700" />
          <span className="font-bold text-ink-900">Semana de {week.weekStart.slice(5)}</span>
          {canUseSampleData ? <Tag>local-demo</Tag> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setMode("week")} variant={mode === "week" ? "solid" : "outline"}>
            Semana
          </Button>
          <Button onClick={() => setMode("day")} variant={mode === "day" ? "solid" : "outline"}>
            Dia
          </Button>
          <Button onClick={() => setMessage("Hoje selecionado nesta sessão local/dev.")} variant="soft">
            Hoje
          </Button>
        </div>
      </div>

      {hasDataWarning ? (
        <ErrorState description={dataMessage} title="Dados reais indisponiveis" />
      ) : (
        <SuccessState description={dataMessage} title={canUseSampleData ? "Amostra local-demo" : "Dados reais"} />
      )}

      {message ? <SuccessState description={message} title="Atualização local/dev" /> : null}

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-5">
          {mode === "week" ? (
            <WeekView model={week} onCancel={cancelBlock} onChange={upsertBlock} />
          ) : (
            <DayView day={selectedDay} onCancel={cancelBlock} onChange={upsertBlock} />
          )}
        </div>
        <aside className="space-y-4">
          <CalendarBlockForm onCreate={upsertBlock} />
          <UnscheduledTasksPanel />
          <Card as="section">
            <div className="flex items-center gap-2">
              <Inbox aria-hidden className="h-4 w-4 text-action-700" />
              <h2 className="font-bold text-ink-900">Inbox recente</h2>
            </div>
            <div className="mt-4 space-y-3">
              {recentInboxItems.slice(0, 2).map((item) => (
                <article className="rounded-card border border-ink-100 bg-ink-50 p-3" key={item.id}>
                  <p className="text-sm leading-6 text-ink-700">{item.content}</p>
                  <Tag>{item.status}</Tag>
                </article>
              ))}
              {recentInboxItems.length === 0 ? (
                <EmptyState
                  description="Capture uma pendencia ou preocupacao na Inbox para conectar agenda e proxima acao."
                  title="Sem inbox recente"
                />
              ) : null}
            </div>
          </Card>
          <SensitiveDataNotice>
            Calendário completo e inbox bruta são privados por padrão. Atalaia não acessa estes dados nesta etapa.
          </SensitiveDataNotice>
          <Card as="section" className="border-warmth-100 bg-warmth-50">
            <RotateCcw aria-hidden className="h-5 w-5 text-warmth-900" />
            <h2 className="mt-2 font-bold text-warmth-900">Reagendar sem culpa</h2>
            <p className="mt-2 text-sm leading-6 text-warmth-900">
              Mover um bloco pode ser um ato de cuidado, não uma falha de disciplina.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
