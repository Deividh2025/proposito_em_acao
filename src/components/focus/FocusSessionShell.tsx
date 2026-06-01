"use client";

import Link from "next/link";
import { Brain, ListRestart, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";

import {
  captureFocusDistraction,
  completeFocusSession,
  interruptFocusSession,
  startFocusSession
} from "@/app/focus/actions";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Textarea } from "@/components/ui/Textarea";
import {
  focusDurationOptions,
  type FocusDistraction,
  type FocusDistractionType
} from "@/domain/focus";
import { DistractionCapture } from "./DistractionCapture";
import { FocusCompleteSummary } from "./FocusCompleteSummary";
import { FocusPauseControls } from "./FocusPauseControls";
import { FocusTimer } from "./FocusTimer";

type SessionStatus = "setup" | "running" | "paused" | "completed";

type FocusSessionShellProps = {
  initialDurationMinutes?: number;
  initialSessionId?: string;
  initialTaskId?: string;
};

const defaultSession = {
  taskTitle: "Organizar documentos da semana",
  nextStep: "Abrir a pasta e separar apenas o primeiro documento",
  reason: "Reduzir peso mental e liberar a proxima decisao financeira."
};

export function FocusSessionShell({
  initialDurationMinutes = 25,
  initialSessionId,
  initialTaskId
}: FocusSessionShellProps) {
  const [taskTitle, setTaskTitle] = useState(defaultSession.taskTitle);
  const [nextStep, setNextStep] = useState(defaultSession.nextStep);
  const [reason, setReason] = useState(defaultSession.reason);
  const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes);
  const [customMinutes, setCustomMinutes] = useState(initialDurationMinutes.toString());
  const [remainingSeconds, setRemainingSeconds] = useState(initialDurationMinutes * 60);
  const [status, setStatus] = useState<SessionStatus>(initialSessionId ? "paused" : "setup");
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [targetEndAt, setTargetEndAt] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [completionNote, setCompletionNote] = useState("");
  const [postEnergyLevel, setPostEnergyLevel] = useState<"low" | "medium" | "high">("medium");
  const [completeTask, setCompleteTask] = useState(false);
  const [distractions, setDistractions] = useState<FocusDistraction[]>([]);
  const [isPending, startTransition] = useTransition();

  const selectedDuration = useMemo(() => {
    const parsed = Number(customMinutes);
    return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 120) : durationMinutes;
  }, [customMinutes, durationMinutes]);

  useEffect(() => {
    if (status !== "running" || targetEndAt === null) return;

    const interval = window.setInterval(() => {
      const nextRemaining = Math.max(0, Math.ceil((targetEndAt - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);

      if (nextRemaining <= 0) {
        setStatus("paused");
        setTargetEndAt(null);
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [status, targetEndAt]);

  function startSession() {
    const duration = selectedDuration;
    setDurationMinutes(duration);
    setRemainingSeconds(duration * 60);

    startTransition(async () => {
      const result = await startFocusSession({
        durationMinutes: duration,
        nextStep,
        reason,
        taskId: initialTaskId,
        taskTitle
      });
      const nextSessionId = result.id ?? `local-focus-${Date.now()}`;
      setSessionId(nextSessionId);
      setStatus("running");
      setTargetEndAt(Date.now() + duration * 60_000);
      setMessage(result.message);
    });
  }

  function pauseSession() {
    setStatus("paused");
    setTargetEndAt(null);
    setMessage("Pausa consciente registrada localmente. Retomar tambem conta.");
  }

  function resumeSession() {
    setStatus("running");
    setTargetEndAt(Date.now() + remainingSeconds * 1000);
    setMessage("Retomada registrada como progresso real.");
  }

  function completeSession() {
    const currentSessionId = sessionId ?? `local-focus-${Date.now()}`;

    startTransition(async () => {
      const result = await completeFocusSession({
        completeTask,
        completionNote,
        postEnergyLevel,
        sessionId: currentSessionId,
        taskId: initialTaskId
      });
      setStatus("completed");
      setTargetEndAt(null);
      setMessage(result.message);
    });
  }

  function interruptSession() {
    const currentSessionId = sessionId ?? `local-focus-${Date.now()}`;

    startTransition(async () => {
      const result = await interruptFocusSession({
        completionNote: completionNote || "Sessao encerrada para retomar com menor carga.",
        sessionId: currentSessionId,
        status: "interrupted"
      });
      setStatus("paused");
      setTargetEndAt(null);
      setMessage(result.message);
    });
  }

  function capture(input: { content: string; routeToInbox: boolean; type: FocusDistractionType }) {
    const currentSessionId = sessionId ?? `local-focus-${Date.now()}`;
    const localDistraction: FocusDistraction = {
      id: `local-distraction-${Date.now()}`,
      capturedAt: new Date().toISOString(),
      content: input.content,
      focusSessionId: currentSessionId,
      routedToInbox: input.routeToInbox,
      type: input.type
    };

    setDistractions((current) => [localDistraction, ...current]);

    startTransition(async () => {
      const result = await captureFocusDistraction({
        content: input.content,
        routeToInbox: input.routeToInbox,
        sessionId: currentSessionId,
        type: input.type
      });
      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-5">
        <Card as="section" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {focusDurationOptions.map((option) => (
              <button
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  durationMinutes === option.value
                    ? "bg-purpose-700 text-white"
                    : "bg-ink-50 text-ink-700 hover:bg-purpose-50"
                }`}
                key={option.value}
                onClick={() => {
                  setDurationMinutes(option.value);
                  setCustomMinutes(option.value.toString());
                  setRemainingSeconds(option.value * 60);
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Personalizado em minutos
            <Input
              min={1}
              max={120}
              onChange={(event) => {
                setCustomMinutes(event.target.value);
                const parsed = Number(event.target.value);
                if (Number.isFinite(parsed) && parsed > 0) {
                  setDurationMinutes(Math.min(parsed, 120));
                  setRemainingSeconds(Math.min(parsed, 120) * 60);
                }
              }}
              type="number"
              value={customMinutes}
            />
          </label>
        </Card>

        <FocusTimer durationMinutes={durationMinutes} remainingSeconds={remainingSeconds} status={status} />

        <Card as="section" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge intent="lowEnergy">baixo atrito</Badge>
            <Badge intent="restart">retomada conta</Badge>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Tarefa atual
            <Input disabled={status !== "setup"} onChange={(event) => setTaskTitle(event.target.value)} value={taskTitle} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Proximo passo
            <Input disabled={status !== "setup"} onChange={(event) => setNextStep(event.target.value)} value={nextStep} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Motivo
            <Textarea disabled={status !== "setup"} onChange={(event) => setReason(event.target.value)} value={reason} />
          </label>
          <FocusPauseControls
            canComplete={Boolean(sessionId) || status !== "setup"}
            isPending={isPending}
            onComplete={completeSession}
            onInterrupt={interruptSession}
            onPause={pauseSession}
            onResume={resumeSession}
            onStart={startSession}
            status={status}
          />
          {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
        </Card>

        {status === "completed" ? <FocusCompleteSummary distractions={distractions} message={message} /> : null}
      </div>

      <aside className="space-y-4">
        <SensitiveDataNotice title="Foco privado por padrao">
          Distracoes podem conter conteudo intimo. Nada vai ao Atalaia, e envio para Inbox e uma escolha explicita.
        </SensitiveDataNotice>
        <DistractionCapture disabled={status === "setup" || status === "completed"} distractions={distractions} onCapture={capture} />
        <Card as="section" className="space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck aria-hidden className="mt-1 h-5 w-5 text-action-700" />
            <div>
              <h2 className="font-bold text-ink-900">Final da sessao</h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                Ao concluir, registre energia e decida se a tarefa tambem foi concluida.
              </p>
            </div>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Energia depois
            <Select value={postEnergyLevel} onChange={(event) => setPostEnergyLevel(event.target.value as "low" | "medium" | "high")}>
              <option value="low">baixa</option>
              <option value="medium">media</option>
              <option value="high">alta</option>
            </Select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Nota opcional
            <Textarea maxLength={1000} onChange={(event) => setCompletionNote(event.target.value)} value={completionNote} />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <input
              checked={completeTask}
              className="h-4 w-4 rounded border-ink-300"
              onChange={(event) => setCompleteTask(event.target.checked)}
              type="checkbox"
            />
            Marcar tarefa como concluida
          </label>
        </Card>
        <Card as="section" className="space-y-3">
          <h2 className="font-bold text-ink-900">Travou?</h2>
          <Link className="flex items-center gap-2 text-sm font-semibold text-purpose-900" href="/action-unblocker">
            <ListRestart aria-hidden className="h-4 w-4" />
            Usar Desbloqueador
          </Link>
          <Link className="flex items-center gap-2 text-sm font-semibold text-purpose-900" href="/metacognition">
            <Brain aria-hidden className="h-4 w-4" />
            Abrir Metacognicao
          </Link>
        </Card>
      </aside>
    </div>
  );
}
