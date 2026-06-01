"use client";

import { CheckCircle2, Pause, Play, Square } from "lucide-react";

import { Button } from "@/components/ui/Button";

type FocusPauseControlsProps = {
  canComplete: boolean;
  isPending: boolean;
  status: "setup" | "running" | "paused" | "completed";
  onComplete: () => void;
  onInterrupt: () => void;
  onPause: () => void;
  onResume: () => void;
  onStart: () => void;
};

export function FocusPauseControls({
  canComplete,
  isPending,
  onComplete,
  onInterrupt,
  onPause,
  onResume,
  onStart,
  status
}: FocusPauseControlsProps) {
  if (status === "setup") {
    return (
      <Button disabled={isPending} onClick={onStart}>
        <Play aria-hidden className="h-4 w-4" />
        Iniciar foco
      </Button>
    );
  }

  if (status === "completed") {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {status === "running" ? (
        <Button disabled={isPending} onClick={onPause} variant="soft">
          <Pause aria-hidden className="h-4 w-4" />
          Pausar
        </Button>
      ) : (
        <Button disabled={isPending} onClick={onResume}>
          <Play aria-hidden className="h-4 w-4" />
          Retomar
        </Button>
      )}
      <Button disabled={isPending || !canComplete} intent="action" onClick={onComplete}>
        <CheckCircle2 aria-hidden className="h-4 w-4" />
        Concluir
      </Button>
      <Button disabled={isPending} intent="neutral" onClick={onInterrupt} variant="outline">
        <Square aria-hidden className="h-4 w-4" />
        Encerrar sem culpa
      </Button>
    </div>
  );
}
