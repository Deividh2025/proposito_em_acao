"use client";

import { useMemo, useState, useTransition } from "react";
import { Play, Save } from "lucide-react";

import { captureFocusDistraction, completeFocusSession, startFocusSession } from "@/app/focus/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatFocusTime, type FocusDistractionType } from "@/domain/focus";

type FocusStatus = "setup" | "running" | "completed";

type MobileFocusQuickStartProps = {
  initialDurationMinutes?: number;
};

export function MobileFocusQuickStart({ initialDurationMinutes = 5 }: MobileFocusQuickStartProps) {
  const [durationMinutes, setDurationMinutes] = useState(initialDurationMinutes);
  const [taskTitle, setTaskTitle] = useState("Foco livre");
  const [nextStep, setNextStep] = useState("Fazer o primeiro gesto visível");
  const [status, setStatus] = useState<FocusStatus>("setup");
  const [sessionId, setSessionId] = useState("");
  const [message, setMessage] = useState("");
  const [distraction, setDistraction] = useState("");
  const [captured, setCaptured] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const timeLabel = useMemo(() => formatFocusTime(durationMinutes * 60), [durationMinutes]);

  function start() {
    startTransition(async () => {
      const result = await startFocusSession({
        durationMinutes,
        nextStep,
        reason: "Foco curto mobile de baixo atrito.",
        taskTitle
      });
      setSessionId(result.id ?? `local-mobile-focus-${Date.now()}`);
      setStatus("running");
      setMessage(`Foco curto iniciado. ${result.message}`);
    });
  }

  function capture() {
    if (distraction.trim().length < 2) return;

    const currentSessionId = sessionId || `local-mobile-focus-${Date.now()}`;
    const content = distraction.trim();
    setCaptured((current) => [content, ...current]);
    setDistraction("");

    startTransition(async () => {
      const result = await captureFocusDistraction({
        content,
        routeToInbox: true,
        sessionId: currentSessionId,
        type: "reminder" satisfies FocusDistractionType
      });
      setMessage(result.message);
    });
  }

  function complete() {
    const currentSessionId = sessionId || `local-mobile-focus-${Date.now()}`;

    startTransition(async () => {
      const result = await completeFocusSession({
        completionNote: "Foco curto concluído pelo mobile.",
        postEnergyLevel: "medium",
        sessionId: currentSessionId
      });
      setStatus("completed");
      setMessage(result.message);
    });
  }

  return (
    <section className="space-y-4 rounded-card border border-ink-100 bg-white p-4 shadow-sm">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-purpose-700">Timer curto</p>
        <p className="mt-2 text-5xl font-bold text-ink-900">{timeLabel}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => setDurationMinutes(5)}
          variant={durationMinutes === 5 ? "solid" : "soft"}
        >
          5 min
        </Button>
        <Button
          onClick={() => setDurationMinutes(15)}
          variant={durationMinutes === 15 ? "solid" : "soft"}
        >
          15 min
        </Button>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Tarefa ou foco livre
        <Input onChange={(event) => setTaskTitle(event.target.value)} value={taskTitle} />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink-900">
        Próximo gesto
        <Input onChange={(event) => setNextStep(event.target.value)} value={nextStep} />
      </label>
      {status === "setup" ? (
        <Button className="w-full" disabled={isPending} onClick={start}>
          <Play aria-hidden className="h-4 w-4" />
          Começar foco
        </Button>
      ) : null}
      {status === "running" ? (
        <div className="space-y-3">
          <label className="grid gap-2 text-sm font-semibold text-ink-900">
            Distração
            <Textarea
              maxLength={500}
              onChange={(event) => setDistraction(event.target.value)}
              rows={3}
              value={distraction}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Button disabled={isPending || distraction.trim().length < 2} onClick={capture} variant="soft">
              <Save aria-hidden className="h-4 w-4" />
              Capturar
            </Button>
            <Button disabled={isPending} onClick={complete}>
              Concluir
            </Button>
          </div>
        </div>
      ) : null}
      {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}
      {captured.length > 0 ? (
        <ul className="space-y-2 text-sm leading-6 text-ink-700">
          {captured.map((item) => (
            <li className="rounded-control bg-ink-50 px-3 py-2" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
