"use client";

import { useState, useTransition } from "react";
import { Save, Scissors } from "lucide-react";

import { createTask, generateTaskBreakdownDraft, persistTaskBreakdown } from "@/app/tasks/actions";
import type { TaskBreakdownOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Textarea } from "@/components/ui/Textarea";
import { MicrotaskChecklist } from "@/components/execution/MicrotaskChecklist";

export function TaskBreakdownForm() {
  const [title, setTitle] = useState("organizar finanças");
  const [reason, setReason] = useState("reduzir ansiedade e decidir a primeira conta a quitar");
  const [nextAction, setNextAction] = useState("Abrir extrato");
  const [energyLevel, setEnergyLevel] = useState("medium");
  const [estimatedMinutes, setEstimatedMinutes] = useState(50);
  const [draft, setDraft] = useState<TaskBreakdownOutput | null>(null);
  const [taskId, setTaskId] = useState<string | undefined>();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function generateDraft() {
    startTransition(async () => {
      const output = await generateTaskBreakdownDraft({
        title,
        reason,
        nextAction,
        energyLevel,
        estimatedMinutes
      });
      setDraft(output);
      setMessage("Quebra mock gerou microtarefas revisaveis.");
    });
  }

  function saveTask() {
    startTransition(async () => {
      const taskResult = await createTask({
        title,
        reason,
        nextAction,
        energyLevel,
        estimatedMinutes,
        status: "pending",
        priority: "medium",
        taskType: "project_task"
      });
      setTaskId(taskResult.id);
      setMessage(taskResult.message);

      if (draft) {
        const breakdownResult = await persistTaskBreakdown({ taskId: taskResult.id, output: draft });
        setMessage(`${taskResult.message} ${breakdownResult.message}`);
      }
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <Card as="section" className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Criar tarefa e quebrar em microtarefas</h2>
          <p className="mt-1 text-sm leading-6 text-ink-600">
            Tarefa grande so fica executavel quando tem primeira microacao clara.
          </p>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Tarefa
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Motivo da tarefa
          <Textarea value={reason} onChange={(event) => setReason(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink-900">
          Proxima acao manual
          <Input value={nextAction} onChange={(event) => setNextAction(event.target.value)} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Energia
            <Select value={energyLevel} onChange={(event) => setEnergyLevel(event.target.value)}>
              <option value="low">baixa</option>
              <option value="medium">media</option>
              <option value="high">alta</option>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Minutos estimados
            <Input
              min={1}
              max={240}
              type="number"
              value={estimatedMinutes}
              onChange={(event) => setEstimatedMinutes(Number(event.target.value))}
            />
          </label>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button disabled={isPending} onClick={generateDraft} variant="soft">
            <Scissors aria-hidden className="h-4 w-4" />
            Quebrar tarefa
          </Button>
          <Button disabled={isPending} onClick={saveTask}>
            <Save aria-hidden className="h-4 w-4" />
            Salvar revisado
          </Button>
        </div>
        {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
      </Card>
      <aside className="space-y-4">
        <SensitiveDataNotice>
          Tarefas podem revelar rotina privada. Atalaia nao recebe esses dados nesta etapa.
        </SensitiveDataNotice>
        {draft ? <MicrotaskChecklist breakdown={draft} taskId={taskId} /> : null}
      </aside>
    </div>
  );
}
