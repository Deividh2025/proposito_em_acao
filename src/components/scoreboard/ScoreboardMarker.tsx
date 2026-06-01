"use client";

import type { ScoreboardEntryStatus } from "@/domain/scoreboard";
import { Button } from "@/components/ui/Button";

type ScoreboardMarkerProps = {
  disabled?: boolean;
  onMark: (status: ScoreboardEntryStatus) => void;
};

export function ScoreboardMarker({ disabled, onMark }: ScoreboardMarkerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button disabled={disabled} onClick={() => onMark("done")} size="sm" variant="soft">
        Feito
      </Button>
      <Button disabled={disabled} onClick={() => onMark("partial")} size="sm" variant="soft">
        Parcial
      </Button>
      <Button disabled={disabled} onClick={() => onMark("restarted")} size="sm" variant="soft">
        Retomado
      </Button>
      <Button disabled={disabled} onClick={() => onMark("paused_consciously")} size="sm" variant="outline">
        Pausado
      </Button>
    </div>
  );
}
