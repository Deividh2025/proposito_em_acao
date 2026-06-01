"use client";

import type { InboxItem } from "@/domain/inbox";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { InboxClassificationBadge } from "./InboxClassificationBadge";

type InboxListProps = {
  items: InboxItem[];
  onSelect: (item: InboxItem) => void;
  selectedItemId: string | null;
};

export function InboxList({ items, onSelect, selectedItemId }: InboxListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        description="Capture uma preocupação, ideia ou pendência sem tentar resolver tudo no mesmo instante."
        title="Inbox respirável"
      />
    );
  }

  return (
    <section className="space-y-3" aria-label="Itens da inbox">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold text-ink-900">Itens a revisar</h2>
        <span className="text-xs font-semibold text-ink-500">lote curto de {Math.min(items.length, 5)}</span>
      </div>
      <div className="grid gap-3">
        {items.slice(0, 5).map((item) => (
          <article
            className={
              item.id === selectedItemId
                ? "rounded-card border border-purpose-300 bg-purpose-50 p-4"
                : "rounded-card border border-ink-100 bg-white p-4"
            }
            key={item.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="max-w-2xl text-sm leading-6 text-ink-700">{item.content}</p>
              <InboxClassificationBadge classification={item.classification?.classification} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => onSelect(item)} size="sm" variant="outline">
                Revisar
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
