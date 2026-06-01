"use client";

import { RotateCcw } from "lucide-react";

import { Card } from "@/components/ui/Card";

export function HabitRestartPrompt() {
  return (
    <Card as="aside" className="border-warmth-100 bg-warmth-50">
      <div className="flex items-start gap-3">
        <RotateCcw aria-hidden className="mt-1 h-5 w-5 shrink-0 text-warmth-900" />
        <div>
          <h2 className="font-bold text-ink-900">Retomada sem culpa</h2>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            Se perdeu um dia, marque retomada com a versao minima. A volta tambem e dado de constancia.
          </p>
        </div>
      </div>
    </Card>
  );
}
