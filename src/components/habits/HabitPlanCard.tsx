"use client";

import { CheckCircle2 } from "lucide-react";

import type { HabitPlanOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type HabitPlanCardProps = {
  isPending?: boolean;
  onSave?: () => void;
  output: HabitPlanOutput;
};

export function HabitPlanCard({ isPending, onSave, output }: HabitPlanCardProps) {
  return (
    <Card as="section" className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">
          Plano revisavel
        </p>
        <h2 className="mt-1 text-xl font-bold text-ink-900">{output.habit_title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink-600">{output.identity_statement}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Info label="Minimo" value={output.minimum_version} />
        <Info label="Ideal" value={output.ideal_version} />
        <Info label="Gatilho" value={output.trigger} />
        <Info label="Recompensa" value={output.reward} />
        <Info label="Plano se/entao" value={output.if_then_plan} />
        <Info label="Retomada" value={output.restart_plan} />
      </div>
      <div className="rounded-control bg-action-50 p-3 text-sm leading-6 text-action-900">
        Ambiente: {output.environment_design}
      </div>
      {onSave ? (
        <Button disabled={isPending} onClick={onSave}>
          <CheckCircle2 aria-hidden className="h-4 w-4" />
          Salvar habito revisado
        </Button>
      ) : null}
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-control border border-ink-100 bg-ink-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1 text-sm leading-6 text-ink-800">{value}</p>
    </div>
  );
}
