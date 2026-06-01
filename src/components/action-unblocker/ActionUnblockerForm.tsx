"use client";

import { useState, useTransition } from "react";
import { WandSparkles } from "lucide-react";

import {
  generateActionUnblockerPlan,
  markActionUnblockerFocusStarted,
  persistActionUnblockerSession
} from "@/app/action-unblocker/actions";
import type { ActionUnblockerOutput } from "@/ai/schemas";
import { ActionUnblockerResult } from "@/components/action-unblocker/ActionUnblockerResult";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Select } from "@/components/ui/Select";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Textarea } from "@/components/ui/Textarea";

type ActionUnblockerInputState = {
  taskTitle: string;
  energyLevel: "low" | "medium" | "high";
  availableMinutes: number;
  obstacle: string;
  tone: "leve" | "equilibrado" | "firme";
};

const initialInput: ActionUnblockerInputState = {
  taskTitle: "Organizar documentos da semana",
  energyLevel: "low",
  availableMinutes: 5,
  obstacle: "Nao sei por onde comecar",
  tone: "equilibrado"
};

export function ActionUnblockerForm() {
  const [input, setInput] = useState<ActionUnblockerInputState>(initialInput);
  const [output, setOutput] = useState<ActionUnblockerOutput | null>(null);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function updateInput<K extends keyof ActionUnblockerInputState>(
    key: K,
    value: ActionUnblockerInputState[K]
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generatePlan() {
    startTransition(async () => {
      const result = await generateActionUnblockerPlan(input);
      setMessage(result.message);
      setOutput(result.output ?? null);
    });
  }

  function saveSession() {
    if (!output) return;

    startTransition(async () => {
      const result = await persistActionUnblockerSession({ input, output });
      setMessage(result.message);
      setSessionId(result.id);
    });
  }

  function startFocus() {
    startTransition(async () => {
      if (sessionId) {
        const result = await markActionUnblockerFocusStarted({ sessionId });
        setMessage(result.message);
        return;
      }

      setMessage("Foco curto preparado nesta sessao local/dev. O timer completo fica para o Prompt 11.");
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <Card as="section" className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Destravar agora</h2>
          <p className="mt-1 text-sm leading-6 text-ink-600">
            Modo rápido: poucos campos, um primeiro passo e revisão antes de salvar.
          </p>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          O que precisa fazer?
          <Input value={input.taskTitle} onChange={(event) => updateInput("taskTitle", event.target.value)} />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Principal obstáculo
          <Textarea
            value={input.obstacle}
            onChange={(event) => updateInput("obstacle", event.target.value)}
            placeholder="Ex.: está grande demais, medo de errar, cansado..."
          />
        </label>

        <div className="grid gap-4 lg:grid-cols-2">
          <RadioGroup
            legend="Energia agora"
            name="energy-level"
            onChange={(event) => updateInput("energyLevel", event.currentTarget.value as ActionUnblockerInputState["energyLevel"])}
            options={[
              { label: "Baixa", value: "low", description: "reduzir escopo" },
              { label: "Média", value: "medium", description: "foco curto" },
              { label: "Alta", value: "high", description: "sequência maior" }
            ]}
            value={input.energyLevel}
          />
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Tempo disponível
            <Select
              value={input.availableMinutes}
              onChange={(event) => updateInput("availableMinutes", Number(event.target.value))}
            >
              <option value={2}>2 minutos</option>
              <option value={5}>5 minutos</option>
              <option value={15}>15 minutos</option>
              <option value={25}>25 minutos</option>
            </Select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Tom
          <Select value={input.tone} onChange={(event) => updateInput("tone", event.target.value as ActionUnblockerInputState["tone"])}>
            <option value="leve">leve</option>
            <option value="equilibrado">equilibrado</option>
            <option value="firme">firme</option>
          </Select>
        </label>

        <Button disabled={isPending} onClick={generatePlan}>
          <WandSparkles aria-hidden className="h-4 w-4" />
          Gerar próximo passo
        </Button>

        {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
      </Card>

      <aside className="space-y-4">
        <SensitiveDataNotice>
          O Desbloqueador usa mock seguro nesta etapa. Sem OpenAI real, sem Atalaia e sem logs de
          conteudo sensivel.
        </SensitiveDataNotice>
        {output ? (
          <ActionUnblockerResult
            isPending={isPending}
            onSave={saveSession}
            onStartFocus={startFocus}
            output={output}
          />
        ) : null}
      </aside>
    </div>
  );
}
