"use client";

import { useState, useTransition } from "react";
import { WandSparkles } from "lucide-react";

import { generateMetacognitionReflection, persistMetacognitionSession } from "@/app/metacognition/actions";
import type { MetacognitionOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function MobileMetacognitionQuick() {
  const [stateText, setStateText] = useState("");
  const [automaticThought, setAutomaticThought] = useState("Eu sempre falho");
  const [intensity, setIntensity] = useState(6);
  const [output, setOutput] = useState<MetacognitionOutput | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const input = {
    allowChristianAnchor: false,
    automaticThought,
    impulse: "evitar a próxima ação",
    intensity,
    stateText
  };

  function generate() {
    if (stateText.trim().length < 2 || automaticThought.trim().length < 2) return;

    startTransition(async () => {
      const result = await generateMetacognitionReflection(input);
      setOutput(result.output ?? null);
      setMessage(result.message);
    });
  }

  function save() {
    if (!output) return;

    startTransition(async () => {
      const result = await persistMetacognitionSession({ input, output });
      setMessage(result.message);
    });
  }

  return (
    <section className="space-y-4 rounded-card border border-ink-100 bg-white p-4 shadow-sm">
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        O que estou sentindo ou pensando?
        <Textarea
          autoFocus
          maxLength={2000}
          onChange={(event) => setStateText(event.target.value)}
          placeholder="Nomeie o estado sem resolver tudo agora."
          rows={4}
          value={stateText}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Intensidade
          <Input
            max={10}
            min={1}
            onChange={(event) => setIntensity(Number(event.target.value))}
            type="number"
            value={intensity}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Pensamento que apareceu
          <Input
            maxLength={1000}
            onChange={(event) => setAutomaticThought(event.target.value)}
            value={automaticThought}
          />
        </label>
      </div>
      <Button className="w-full" disabled={isPending || stateText.trim().length < 2} onClick={generate}>
        <WandSparkles aria-hidden className="h-4 w-4" />
        Clarear agora
      </Button>
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
      {output ? (
        <section className="space-y-3 rounded-card border border-action-100 bg-action-50 p-4 text-action-900">
          <p className="text-xs font-semibold uppercase tracking-[0.08em]">Fato x interpretação</p>
          <div className="grid gap-2 text-sm leading-6">
            <p><strong>Fato:</strong> {output.fact}</p>
            <p><strong>Interpretação:</strong> {output.interpretation}</p>
            <p><strong>Reformulação:</strong> {output.reframe}</p>
            <p><strong>Próximo passo:</strong> {output.next_action}</p>
          </div>
          <p className="text-xs leading-5">Sessão privada por padrão; não vai ao Atalaia.</p>
          <Button disabled={isPending} onClick={save} variant="soft">
            Salvar reflexão
          </Button>
        </section>
      ) : null}
    </section>
  );
}
