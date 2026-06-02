"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";

import { generateWeeklyReviewDraft, persistWeeklyReview } from "@/app/review/actions";
import type { GardenStateOutput, WeeklyReviewOutput } from "@/ai/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Textarea } from "@/components/ui/Textarea";
import { weeklyReviewQuestions } from "@/domain/review";
import { WeeklyReviewSummary } from "./WeeklyReviewSummary";

type Answers = Record<string, string>;

const initialAnswers: Answers = {
  advanced: "Retomei uma tarefa importante e fiz dois blocos de foco.",
  stuck: "Adiei uma tarefa grande quando a energia caiu.",
  completed: "Conclui uma microtarefa que estava parada.",
  postponed: "Revisao financeira ficou para depois.",
  goalsProgressed: "Saude e trabalho caminharam um pouco.",
  projectsPaused: "Financas ficou em pausa.",
  habitsMaintained: "Caminhada minima e leitura curta.",
  restarts: "Voltei depois de falhar na terca.",
  excess: "Agenda apertada sem descanso suficiente.",
  neglectedAreas: "Familia e descanso.",
  metacognition: "Padrao agregado: tudo ou nada apareceu mais de uma vez.",
  scoreboard: "Placar mostrou retomada e pausa consciente.",
  adjustments: "Reduzir escopo das manhas e proteger descanso.",
  nextWeekFocus: "Proteger energia e concluir uma tarefa essencial.",
  firstActionNextWeek: "Bloquear 25 minutos para revisar financas."
};

export function WeeklyReviewForm() {
  const [weekStart, setWeekStart] = useState("2026-06-01");
  const [weekEnd, setWeekEnd] = useState("2026-06-07");
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [output, setOutput] = useState<WeeklyReviewOutput | null>(null);
  const [garden, setGarden] = useState<GardenStateOutput | null>(null);
  const [message, setMessage] = useState("");
  const [christianReflectionEnabled, setChristianReflectionEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function generateReview() {
    startTransition(async () => {
      const result = await generateWeeklyReviewDraft({
        answers,
        christianReflectionEnabled,
        weekEnd,
        weekStart
      });

      if (result.output) {
        setOutput(result.output);
      }
      if (result.garden) {
        setGarden(result.garden);
      }
      setMessage(result.message);
    });
  }

  function saveReview() {
    if (!output || !garden) return;

    startTransition(async () => {
      const result = await persistWeeklyReview({
        answers,
        garden,
        output,
        weekEnd,
        weekStart
      });
      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-5">
        <Card as="section" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-ink-900">Revisar a semana</h2>
            <p className="mt-1 text-sm leading-6 text-ink-600">
              Responda em blocos curtos. O objetivo e aprender, ajustar e escolher o primeiro passo.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Inicio da semana
              <Input value={weekStart} onChange={(event) => setWeekStart(event.target.value)} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink-900">
              Fim da semana
              <Input value={weekEnd} onChange={(event) => setWeekEnd(event.target.value)} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <input
              checked={christianReflectionEnabled}
              className="h-4 w-4 rounded border-ink-300"
              onChange={(event) => setChristianReflectionEnabled(event.target.checked)}
              type="checkbox"
            />
            Incluir nota crista opcional e sem culpa espiritual
          </label>
        </Card>

        <div className="grid gap-4">
          {weeklyReviewQuestions.map((question) => (
            <Card as="section" className="space-y-2" key={question.id}>
              <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">{question.label}</p>
              <label className="grid gap-2 text-sm font-semibold text-ink-900">
                {question.prompt}
                <Textarea
                  aria-label={question.prompt}
                  onChange={(event) => updateAnswer(question.id, event.target.value)}
                  placeholder={question.lowEnergyPrompt}
                  value={answers[question.id] ?? ""}
                />
              </label>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button disabled={isPending} onClick={generateReview}>
            <Sparkles aria-hidden className="h-4 w-4" />
            Gerar sintese mock
          </Button>
          <Button disabled={!output || isPending} onClick={saveReview} variant="soft">
            Salvar revisao
          </Button>
        </div>
        {message ? <p className="text-sm leading-6 text-ink-600">{message}</p> : null}

        {output ? <WeeklyReviewSummary garden={garden} output={output} /> : null}
      </div>

      <aside className="space-y-4">
        <SensitiveDataNotice title="Revisao privada por padrao">
          Metacognicao, Placar bruto, calendario completo e revisoes privadas nao sao enviados ao Atalaia.
        </SensitiveDataNotice>
        <Card as="aside" className="space-y-2 border-warmth-100 bg-warmth-50">
          <h2 className="font-bold text-warmth-900">Modo baixa energia</h2>
          <p className="text-sm leading-6 text-warmth-900">
            Se estiver pesado, responda so uma vitoria, uma trava e a primeira acao. Isso ja conta como retomada.
          </p>
        </Card>
      </aside>
    </div>
  );
}
