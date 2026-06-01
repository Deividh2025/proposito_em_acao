"use client";

import Link from "next/link";
import { Brain, CheckCircle2, Play } from "lucide-react";

import type { ActionUnblockerOutput } from "@/ai/schemas";
import { MinimumViableActionCard } from "@/components/action-unblocker/MinimumViableActionCard";
import { TinyStepCard } from "@/components/action-unblocker/TinyStepCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Tag } from "@/components/ui/Tag";

type ActionUnblockerResultProps = {
  output: ActionUnblockerOutput;
  onSave: () => void;
  onStartFocus: () => void;
  isPending: boolean;
};

export function ActionUnblockerResult({
  isPending,
  onSave,
  onStartFocus,
  output
}: ActionUnblockerResultProps) {
  const isCrisis = output.crisis_detected || output.next_route === "human_help";

  return (
    <section className="space-y-4" aria-live="polite">
      {isCrisis ? (
        <SensitiveDataNotice title="Segurança primeiro">
          Este retorno saiu do modo produtividade. Procure uma pessoa de confiança ou serviço local de
          emergência se houver risco imediato.
        </SensitiveDataNotice>
      ) : null}

      <TinyStepCard output={output} />
      <MinimumViableActionCard output={output} />

      <Card as="section">
        <div className="flex flex-wrap items-center gap-2">
          <Badge intent={output.suggest_metacognition ? "warning" : "purpose"}>{output.next_route}</Badge>
          <Tag>{output.obstacle_type}</Tag>
          <Tag>{output.confidence_level}</Tag>
        </div>
        <h2 className="mt-3 font-bold text-ink-900">Sequência curta</h2>
        <ol className="mt-3 space-y-2">
          {output.microtasks.map((microtask) => (
            <li className="flex items-start gap-3 text-sm leading-6 text-ink-700" key={microtask.order}>
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purpose-50 text-xs font-bold text-purpose-900">
                {microtask.order}
              </span>
              <span>
                <span className="font-semibold text-ink-900">{microtask.title}</span>
                <span className="ml-2 text-xs text-ink-500">{microtask.estimated_minutes} min</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-card border border-ink-100 bg-ink-50 p-3 text-sm leading-6 text-ink-700">
          {output.reorientation_phrase}
        </div>
      </Card>

      {output.suggest_metacognition ? (
        <Card className="border-action-100 bg-action-50">
          <Brain aria-hidden className="h-5 w-5 text-action-700" />
          <h2 className="mt-2 font-bold text-action-900">Talvez seja pensamento, não só tarefa</h2>
          <p className="mt-2 text-sm leading-6 text-action-900">
            {output.reason_to_suggest_metacognition}
          </p>
          <Link
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-action-100 px-4 text-sm font-semibold text-action-900 transition duration-200 hover:bg-action-100"
            href="/metacognition"
          >
            Abrir Metacognição
          </Link>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={isPending || isCrisis} intent="action" onClick={onStartFocus}>
          <Play aria-hidden className="h-4 w-4" />
          Começar agora
        </Button>
        <Button disabled={isPending} onClick={onSave} variant="outline">
          <CheckCircle2 aria-hidden className="h-4 w-4" />
          Salvar sessão
        </Button>
      </div>
    </section>
  );
}
