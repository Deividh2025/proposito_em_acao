"use client";

import { useState, useTransition } from "react";
import { Sparkles, Save } from "lucide-react";

import { createManualGoal, generateSmartGoalDraft, persistSmartGoalDraft } from "@/app/goals/actions";
import type { SmartGoalOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Textarea } from "@/components/ui/Textarea";

const lifeAreas = ["fe", "saude", "familia", "financas", "trabalho", "relacionamentos", "servico", "aprendizado", "descanso"];

export function GoalForm() {
  const [desire, setDesire] = useState("quero organizar minha vida financeira");
  const [lifeArea, setLifeArea] = useState("financas");
  const [callingSummary, setCallingSummary] = useState("Servir minha familia com constancia e mordomia.");
  const [draft, setDraft] = useState<SmartGoalOutput | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function generateDraft() {
    startTransition(async () => {
      const output = await generateSmartGoalDraft({
        desire,
        lifeArea,
        callingSummary,
        lifeMapWarnings: ["descanso", "familia"]
      });
      setDraft(output);
      setMessage("Mock seguro gerou um alvo SMART-E revisavel. Nenhuma chamada OpenAI real foi feita.");
    });
  }

  function saveDraft() {
    startTransition(async () => {
      if (draft) {
        const result = await persistSmartGoalDraft({ output: draft });
        setMessage(result.message);
        return;
      }

      const result = await createManualGoal({
        title: desire,
        lifeArea,
        specific: desire,
        measurable: "Uma metrica simples revisada semanalmente.",
        achievable: "Versao minima em ate 25 minutos.",
        relevant: callingSummary || "Alinhamento com Chamado a revisar.",
        timebound: "30 dias",
        firstAction: "Abrir o contexto e escolher uma microacao.",
        status: "needs_review"
      });
      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <Card as="section" className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Criar alvo SMART-E</h2>
          <p className="mt-1 text-sm leading-6 text-ink-600">
            Comece com um desejo vago. A estrutura completa aparece como rascunho editavel.
          </p>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Desejo ou alvo bruto
          <Textarea value={desire} onChange={(event) => setDesire(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Area da vida
          <Select value={lifeArea} onChange={(event) => setLifeArea(event.target.value)}>
            {lifeAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Resumo do Chamado usado como filtro
          <Input value={callingSummary} onChange={(event) => setCallingSummary(event.target.value)} />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button disabled={isPending} onClick={generateDraft} variant="soft">
            <Sparkles aria-hidden className="h-4 w-4" />
            Gerar com mock
          </Button>
          <Button disabled={isPending} onClick={saveDraft}>
            <Save aria-hidden className="h-4 w-4" />
            Salvar revisado
          </Button>
        </div>
        {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
      </Card>

      <aside className="space-y-4">
        <SensitiveDataNotice>
          Analise ecologica pode citar areas sensiveis. Ela fica owner-only e nao vai ao Atalaia.
        </SensitiveDataNotice>
        {draft ? (
          <Card as="section" className="border-purpose-100 bg-purpose-50">
            <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Rascunho SMART-E</p>
            <h3 className="mt-2 text-lg font-bold text-purpose-900">{draft.title}</h3>
            <p className="mt-3 text-sm leading-6 text-purpose-900">{draft.specific}</p>
            <dl className="mt-4 space-y-3 text-sm text-purpose-900">
              <div>
                <dt className="font-bold">Metrica</dt>
                <dd>{draft.measurable}</dd>
              </div>
              <div>
                <dt className="font-bold">Ecologia</dt>
                <dd>{draft.ecological_analysis.protected_areas.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-bold">Primeira acao</dt>
                <dd>{draft.first_action}</dd>
              </div>
            </dl>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}
