"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";

import { recordEnergyCheckIn } from "@/app/mobile/actions";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { buildEnergyAdjustment, type EnergyLevel } from "@/domain/energy";

const options: Array<{ label: string; value: EnergyLevel }> = [
  { label: "Baixa", value: "low" },
  { label: "Média", value: "medium" },
  { label: "Alta", value: "high" }
];

export function MobileEnergyCheckIn() {
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>("medium");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [suggestion, setSuggestion] = useState(buildEnergyAdjustment({ energyLevel }).suggestion);
  const [isPending, startTransition] = useTransition();

  function choose(nextLevel: EnergyLevel) {
    setEnergyLevel(nextLevel);
    setSuggestion(buildEnergyAdjustment({ energyLevel: nextLevel }).suggestion);
  }

  function submit() {
    startTransition(async () => {
      const result = await recordEnergyCheckIn({
        clientCreatedAt: new Date().toISOString(),
        clientMutationId: `mobile-energy-${Date.now()}`,
        energyLevel,
        note,
        source: "mobile"
      });
      setMessage(`Check-in de energia registrado. ${result.message}`);
      setSuggestion(result.suggestion ?? buildEnergyAdjustment({ energyLevel }).suggestion);
    });
  }

  return (
    <section className="space-y-4 rounded-card border border-ink-100 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => choose(option.value)}
            variant={energyLevel === option.value ? "solid" : "soft"}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Observação opcional
        <Textarea
          maxLength={500}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Uma frase, sem precisar explicar tudo."
          rows={3}
          value={note}
        />
      </label>
      <section className="rounded-card border border-purpose-100 bg-purpose-50 p-3 text-sm leading-6 text-purpose-900">
        {suggestion}
      </section>
      <Button className="w-full" disabled={isPending} onClick={submit}>
        <Save aria-hidden className="h-4 w-4" />
        Registrar energia
      </Button>
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
      <p className="text-xs leading-5 text-ink-500">Nada é compartilhado com Atalaia.</p>
    </section>
  );
}
