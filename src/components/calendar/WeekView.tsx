"use client";

import type { CalendarBlock, CalendarWeekModel } from "@/domain/calendar";
import { CalendarBlockCard } from "./CalendarBlockCard";

type WeekViewProps = {
  model: CalendarWeekModel;
  onCancel: (blockId: string, message: string) => void;
  onChange: (block: CalendarBlock, message: string) => void;
};

export function WeekView({ model, onCancel, onChange }: WeekViewProps) {
  return (
    <section aria-label="Visão semanal" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      {model.days.map((day) => (
        <div className="min-h-48 rounded-card border border-ink-100 bg-white/88 p-3" key={day.date}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-ink-900">{day.label}</h2>
            <span className="text-xs font-semibold text-ink-500">{day.date.slice(5)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-500">{day.totalScheduledMinutes} min planejados</p>
          <div className="mt-3 space-y-3">
            {day.blocks.map((block) => (
              <CalendarBlockCard block={block} key={block.id} onCancel={onCancel} onChange={onChange} />
            ))}
            {day.blocks.length === 0 ? (
              <p className="rounded-card border border-dashed border-ink-300 bg-ink-50 p-3 text-xs leading-5 text-ink-600">
                Espaço respirável para buffer ou descanso.
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}
