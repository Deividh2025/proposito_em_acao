"use client";

import { useState, useTransition } from "react";
import { Sparkles, Save } from "lucide-react";

import { generateProjectPlanDraft, persistProjectPlan } from "@/app/projects/actions";
import type { ProjectPlanOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Textarea } from "@/components/ui/Textarea";

export function ProjectPlanner() {
  const [goalId, setGoalId] = useState("goal-financas");
  const [goalTitle, setGoalTitle] = useState("organizar minha vida financeira");
  const [firstAction, setFirstAction] = useState("Abrir o extrato bancario");
  const [draft, setDraft] = useState<ProjectPlanOutput | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function generateDraft() {
    startTransition(async () => {
      const output = await generateProjectPlanDraft({
        goalId,
        goalTitle,
        lifeArea: "financas",
        firstAction
      });
      setDraft(output);
      setMessage("Planejador mock gerou projeto, tarefa inicial e microtarefas revisaveis.");
    });
  }

  function saveDraft() {
    if (!draft) {
      setMessage("Gere um plano revisavel antes de salvar.");
      return;
    }

    startTransition(async () => {
      const result = await persistProjectPlan({ output: draft });
      setMessage(result.message);
    });
  }

  const project = draft?.projects[0];

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <Card as="section" className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Gerar projeto a partir do alvo</h2>
          <p className="mt-1 text-sm leading-6 text-ink-600">
            O projeto nasce pequeno: fase, marcos, riscos, recursos, primeira tarefa e retomada.
          </p>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          ID do alvo
          <Input value={goalId} onChange={(event) => setGoalId(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Titulo do alvo
          <Textarea value={goalTitle} onChange={(event) => setGoalTitle(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Primeira acao do alvo
          <Input value={firstAction} onChange={(event) => setFirstAction(event.target.value)} />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button disabled={isPending} onClick={generateDraft} variant="soft">
            <Sparkles aria-hidden className="h-4 w-4" />
            Sugerir projeto
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
          O planejador nao cria calendario, habitos ou Atalaia nesta etapa.
        </SensitiveDataNotice>
        {project ? (
          <Card as="section" className="border-action-100 bg-action-50">
            <p className="text-xs font-semibold uppercase tracking-wide text-action-700">Plano revisavel</p>
            <h3 className="mt-2 text-lg font-bold text-action-900">{project.title}</h3>
            <p className="mt-2 text-sm leading-6 text-action-900">{project.description}</p>
            <p className="mt-3 text-sm font-bold text-action-900">Primeira tarefa: {project.tasks[0]?.title}</p>
            <p className="mt-3 text-sm leading-6 text-action-900">{project.restart_plan}</p>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}
