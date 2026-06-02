"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Play, WandSparkles } from "lucide-react";

import { generateActionUnblockerPlan, persistActionUnblockerSession } from "@/app/action-unblocker/actions";
import type { ActionUnblockerOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

type Energy = "low" | "medium" | "high";

export function MobileUnblockerQuick() {
  const [taskTitle, setTaskTitle] = useState("");
  const [obstacle, setObstacle] = useState("");
  const [energyLevel, setEnergyLevel] = useState<Energy>("low");
  const [availableMinutes, setAvailableMinutes] = useState(5);
  const [output, setOutput] = useState<ActionUnblockerOutput | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const input = {
    availableMinutes,
    energyLevel,
    obstacle,
    taskTitle: taskTitle || "A tarefa travada",
    tone: "equilibrado" as const
  };

  function generate() {
    startTransition(async () => {
      const result = await generateActionUnblockerPlan(input);
      setOutput(result.output ?? null);
      setMessage(result.message);
    });
  }

  function save() {
    if (!output) return;

    startTransition(async () => {
      const result = await persistActionUnblockerSession({ input, output });
      setMessage(result.message);
    });
  }

  return (
    <section className="space-y-4 rounded-card border border-ink-100 bg-white p-4 shadow-sm">
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        O que precisa fazer?
        <Input
          autoFocus
          maxLength={240}
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Ex.: enviar proposta"
          value={taskTitle}
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        O que travou?
        <Textarea
          maxLength={500}
          onChange={(event) => setObstacle(event.target.value)}
          placeholder="Ex.: está grande demais, medo de errar..."
          rows={3}
          value={obstacle}
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Energia
          <Select value={energyLevel} onChange={(event) => setEnergyLevel(event.target.value as Energy)}>
            <option value="low">baixa</option>
            <option value="medium">média</option>
            <option value="high">alta</option>
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Tempo
          <Select value={availableMinutes} onChange={(event) => setAvailableMinutes(Number(event.target.value))}>
            <option value={2}>2 min</option>
            <option value={5}>5 min</option>
            <option value={15}>15 min</option>
          </Select>
        </label>
      </div>
      <Button className="w-full" disabled={isPending || taskTitle.trim().length < 2} onClick={generate}>
        <WandSparkles aria-hidden className="h-4 w-4" />
        Gerar primeiro passo
      </Button>
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
      {output ? (
        <section className="space-y-3 rounded-card border border-purpose-100 bg-purpose-50 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-purpose-700">Primeiro passo</p>
            <p className="mt-1 font-bold text-purpose-900">{output.first_step}</p>
          </div>
          <p className="text-sm leading-6 text-purpose-900">{output.minimum_viable_action}</p>
          <div className="grid gap-2">
            <Button disabled={isPending} onClick={save} variant="soft">
              Salvar revisão
            </Button>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-purpose-700 px-4 text-sm font-semibold text-white"
              href={`/mobile/focus?minutes=${output.recommended_focus_minutes}`}
            >
              <Play aria-hidden className="h-4 w-4" />
              Começar foco
            </Link>
          </div>
        </section>
      ) : null}
    </section>
  );
}
