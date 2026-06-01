"use client";

import { Sparkles } from "lucide-react";
import { useState, useTransition } from "react";

import { generateHabitPlanDraft, persistHabitPlan } from "@/app/habits/actions";
import type { HabitPlanOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Textarea } from "@/components/ui/Textarea";
import { HabitPlanCard } from "./HabitPlanCard";

type HabitFormState = {
  desiredHabit: string;
  reason: string;
  lifeArea: string;
  frequency: "daily" | "weekly" | "custom";
  likelyDifficulty: string;
  bestContext: string;
  callingRelation: string;
};

const initialState: HabitFormState = {
  desiredHabit: "Caminhar por alguns minutos",
  reason: "Cuidar do corpo sem depender de motivacao alta",
  lifeArea: "Saude",
  frequency: "daily",
  likelyDifficulty: "esquecer quando o dia aperta",
  bestContext: "depois do almoco",
  callingRelation: "ter energia para servir melhor"
};

export function HabitForm() {
  const [input, setInput] = useState(initialState);
  const [output, setOutput] = useState<HabitPlanOutput | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof HabitFormState>(key: K, value: HabitFormState[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    startTransition(async () => {
      const result = await generateHabitPlanDraft(input);
      setOutput(result.output ?? null);
      setMessage(result.message);
    });
  }

  function save() {
    if (!output) return;

    startTransition(async () => {
      const result = await persistHabitPlan({ output });
      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-5">
        <Card as="section" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Criar habito realista</h2>
            <p className="mt-1 text-sm leading-6 text-ink-600">
              A IA mock reduz escopo, cria versao minima e deixa tudo revisavel antes de salvar.
            </p>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Habito desejado
            <Input value={input.desiredHabit} onChange={(event) => update("desiredHabit", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Motivo
            <Textarea value={input.reason} onChange={(event) => update("reason", event.target.value)} />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Area da vida
              <Input value={input.lifeArea} onChange={(event) => update("lifeArea", event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Frequencia
              <Select value={input.frequency} onChange={(event) => update("frequency", event.target.value as HabitFormState["frequency"])}>
                <option value="daily">diaria</option>
                <option value="weekly">semanal</option>
                <option value="custom">personalizada</option>
              </Select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Dificuldade provavel
            <Input value={input.likelyDifficulty} onChange={(event) => update("likelyDifficulty", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Melhor horario ou contexto
            <Input value={input.bestContext} onChange={(event) => update("bestContext", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Relacao com Chamado ou alvo
            <Textarea value={input.callingRelation} onChange={(event) => update("callingRelation", event.target.value)} />
          </label>
          <Button disabled={isPending} onClick={generate}>
            <Sparkles aria-hidden className="h-4 w-4" />
            Gerar plano mock
          </Button>
          {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
        </Card>

        {output ? <HabitPlanCard isPending={isPending} onSave={save} output={output} /> : null}
      </div>

      <aside className="space-y-4">
        <SensitiveDataNotice title="Habitos podem revelar dados sensiveis">
          Rotina, saude, fe, familia e energia ficam privados por padrao. O mock nao chama OpenAI real.
        </SensitiveDataNotice>
      </aside>
    </div>
  );
}
