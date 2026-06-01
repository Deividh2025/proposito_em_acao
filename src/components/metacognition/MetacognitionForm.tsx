"use client";

import { useState, useTransition } from "react";
import { Brain, WandSparkles } from "lucide-react";

import { generateMetacognitionReflection, persistMetacognitionSession } from "@/app/metacognition/actions";
import type { MetacognitionOutput } from "@/ai/schemas";
import { MetacognitionHistoryList } from "@/components/metacognition/MetacognitionHistoryList";
import { MetacognitionResult } from "@/components/metacognition/MetacognitionResult";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Stepper } from "@/components/ui/Stepper";
import { Textarea } from "@/components/ui/Textarea";

type MetacognitionInputState = {
  stateText: string;
  intensity: number;
  automaticThought: string;
  impulse: string;
  allowChristianAnchor: boolean;
};

const initialInput: MetacognitionInputState = {
  stateText: "Estou ansioso porque a tarefa ficou parada.",
  intensity: 6,
  automaticThought: "Eu sempre falho",
  impulse: "evitar abrir a tarefa",
  allowChristianAnchor: false
};

export function MetacognitionForm() {
  const [input, setInput] = useState<MetacognitionInputState>(initialInput);
  const [output, setOutput] = useState<MetacognitionOutput | null>(null);
  const [message, setMessage] = useState("");
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [isPending, startTransition] = useTransition();

  function updateInput<K extends keyof MetacognitionInputState>(
    key: K,
    value: MetacognitionInputState[K]
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function generateReflection() {
    startTransition(async () => {
      const result = await generateMetacognitionReflection(input);
      setOutput(result.output ?? null);
      setMessage(result.message);
    });
  }

  function saveSession() {
    if (!output) return;

    startTransition(async () => {
      const result = await persistMetacognitionSession({ input, output });
      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-5">
        <Stepper
          steps={[
            { label: "Sentir", status: "done", description: "nomear estado" },
            { label: "Separar", status: output ? "done" : "current", description: "fato e interpretação" },
            { label: "Agir", status: output ? "current" : "upcoming", description: "próxima ação" }
          ]}
        />

        <Card as="section" className="space-y-4">
          <div className="flex items-start gap-3">
            <Brain aria-hidden className="mt-1 h-5 w-5 shrink-0 text-action-700" />
            <div>
              <h2 className="text-xl font-bold text-ink-900">Clarear pensamento</h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                Modo rápido por padrão. O modo profundo abre campos extras sem obrigar ruminação.
              </p>
            </div>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            O que está acontecendo por dentro?
            <Textarea
              value={input.stateText}
              onChange={(event) => updateInput("stateText", event.target.value)}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Intensidade
              <Input
                max={10}
                min={1}
                type="number"
                value={input.intensity}
                onChange={(event) => updateInput("intensity", Number(event.target.value))}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Pensamento automático
              <Input
                value={input.automaticThought}
                onChange={(event) => updateInput("automaticThought", event.target.value)}
              />
            </label>
          </div>

          {isDeepMode ? (
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Impulso
              <Input value={input.impulse} onChange={(event) => updateInput("impulse", event.target.value)} />
            </label>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-card border border-ink-100 bg-white p-3 text-sm text-ink-800">
              <Checkbox
                checked={isDeepMode}
                label="Modo profundo"
                onChange={(event) => setIsDeepMode(event.target.checked)}
              />
              <p className="mt-1 pl-7 text-xs leading-5 text-ink-500">
                abrir impulso e leitura mais completa
              </p>
            </div>
            <div className="rounded-card border border-ink-100 bg-white p-3 text-sm text-ink-800">
              <Checkbox
                checked={input.allowChristianAnchor}
                label="Âncora cristã opcional"
                onChange={(event) => updateInput("allowChristianAnchor", event.target.checked)}
              />
              <p className="mt-1 pl-7 text-xs leading-5 text-ink-500">
                sem culpa espiritual ou vontade divina específica
              </p>
            </div>
          </div>

          <Button disabled={isPending} onClick={generateReflection}>
            <WandSparkles aria-hidden className="h-4 w-4" />
            Gerar reflexão estruturada
          </Button>

          {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
        </Card>

        {output ? <MetacognitionResult isPending={isPending} onSave={saveSession} output={output} /> : null}
      </div>

      <aside className="space-y-4">
        <SensitiveDataNotice>
          Metacognição é privada por padrão. Nada vai ao Atalaia, e a UI não usa OpenAI real nesta etapa.
        </SensitiveDataNotice>
        <MetacognitionHistoryList />
      </aside>
    </div>
  );
}
