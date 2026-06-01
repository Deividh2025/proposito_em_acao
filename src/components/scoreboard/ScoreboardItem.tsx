"use client";

import type { ScoreboardEntryStatus, ScoreboardItem as ScoreboardItemModel } from "@/domain/scoreboard";
import { Badge } from "@/components/ui/Badge";
import { ScoreboardMarker } from "./ScoreboardMarker";

type ScoreboardItemProps = {
  disabled?: boolean;
  item: ScoreboardItemModel;
  onMark: (itemId: string, status: ScoreboardEntryStatus) => void;
};

export function ScoreboardItem({ disabled, item, onMark }: ScoreboardItemProps) {
  return (
    <div className="rounded-card border border-ink-100 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink-900">{item.title}</p>
          <p className="mt-1 text-sm leading-6 text-ink-600">{item.minimumSuccess}</p>
        </div>
        <Badge intent={item.type === "restart" ? "restart" : "purpose"}>{item.type}</Badge>
      </div>
      <div className="mt-3">
        <ScoreboardMarker disabled={disabled} onMark={(status) => onMark(item.id, status)} />
      </div>
    </div>
  );
}
