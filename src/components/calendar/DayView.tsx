"use client";

import type { CalendarBlock, CalendarDayModel } from "@/domain/calendar";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarBlockCard } from "./CalendarBlockCard";

type DayViewProps = {
  day: CalendarDayModel;
  onCancel: (blockId: string, message: string) => void;
  onChange: (block: CalendarBlock, message: string) => void;
};

export function DayView({ day, onCancel, onChange }: DayViewProps) {
  return (
    <section aria-label="Visão diária" className="space-y-3">
      <div className="rounded-card border border-ink-100 bg-white p-4">
        <h2 className="font-bold text-ink-900">
          {day.label} {day.date}
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          {day.totalScheduledMinutes} min planejados, {day.protectedBlockCount} blocos protegidos.
        </p>
      </div>
      {day.blocks.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {day.blocks.map((block) => (
            <CalendarBlockCard block={block} key={block.id} onCancel={onCancel} onChange={onChange} />
          ))}
        </div>
      ) : (
        <EmptyState
          description="Escolha apenas o próximo bloco que cabe agora. Espaço vazio também protege a vida."
          title="Dia sem blocos"
        />
      )}
    </section>
  );
}
