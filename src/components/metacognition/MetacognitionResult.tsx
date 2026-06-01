"use client";

import Link from "next/link";
import { AlertTriangle, Brain, CheckCircle2 } from "lucide-react";

import type { MetacognitionOutput } from "@/ai/schemas";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { Tag } from "@/components/ui/Tag";

type MetacognitionResultProps = {
  output: MetacognitionOutput;
  onSave: () => void;
  isPending: boolean;
};

export function MetacognitionResult({ isPending, onSave, output }: MetacognitionResultProps) {
  const isCrisis = output.recommended_route === "emergency_support";

  return (
    <section className="space-y-4" aria-live="polite">
      {isCrisis ? (
        <SensitiveDataNotice title="Ajuda humana agora">
          Esta resposta não fará análise profunda nem transformará crise em produtividade. Procure uma
          pessoa de confiança ou serviço local de emergência se houver risco imediato.
        </SensitiveDataNotice>
      ) : null}

      <Card className="border-action-100 bg-action-50">
        <Brain aria-hidden className="h-5 w-5 text-action-700" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge intent="lowEnergy">Privada por padrão</Badge>
          <Tag>{output.category}</Tag>
          <Tag>{output.intensity_observed}</Tag>
        </div>
        <h2 className="mt-3 text-lg font-bold text-action-900">{output.state_name}</h2>
        <p className="mt-2 text-sm leading-6 text-action-900">{output.privacy_note}</p>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Fato", output.fact],
          ["Interpretação", output.interpretation],
          ["Sentimento", output.feeling],
          ["Impulso", output.impulse]
        ].map(([label, value]) => (
          <Card as="div" key={label}>
            <h3 className="font-bold text-ink-900">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-600">{value}</p>
          </Card>
        ))}
      </div>

      <Card as="section">
        <h2 className="font-bold text-ink-900">Pensamento e padrões prováveis</h2>
        <p className="mt-2 text-sm leading-6 text-ink-700">{output.dominant_automatic_thought}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {output.cognitive_patterns.map((pattern) => (
            <Badge intent="warning" key={pattern}>
              {pattern}
            </Badge>
          ))}
        </div>
      </Card>

      <Card as="section">
        <h2 className="font-bold text-ink-900">Desmonte lógico</h2>
        <p className="mt-2 text-sm leading-6 text-ink-700">{output.logical_deconstruction}</p>
      </Card>

      <Card className="border-purpose-100">
        <h2 className="font-bold text-ink-900">Pergunta de confronto</h2>
        <p className="mt-2 text-sm leading-6 text-ink-700">{output.confrontation_question}</p>
      </Card>

      <Card className="border-purpose-100 bg-purpose-50">
        <h2 className="font-bold text-purpose-900">Reformulação e próxima ação</h2>
        <p className="mt-2 text-sm leading-6 text-purpose-900">{output.reframe}</p>
        <p className="mt-3 text-sm font-semibold leading-6 text-purpose-900">{output.next_action}</p>
      </Card>

      {output.christian_anchor ? (
        <Card className="border-warmth-100 bg-warmth-50">
          <h2 className="font-bold text-warmth-900">Âncora cristã opcional</h2>
          <p className="mt-2 text-sm leading-6 text-warmth-900">{output.christian_anchor}</p>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={isPending} onClick={onSave}>
          <CheckCircle2 aria-hidden className="h-4 w-4" />
          Salvar sessão privada
        </Button>
        {output.recommended_route === "action_unblocker" ? (
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-action-100 px-4 text-sm font-semibold text-action-900 transition duration-200 hover:bg-action-50"
            href="/action-unblocker"
          >
            Abrir Desbloqueador
          </Link>
        ) : null}
        {isCrisis ? (
          <div className="inline-flex min-h-11 items-center gap-2 rounded-control border border-gentleDanger-100 bg-gentleDanger-50 px-4 text-sm font-semibold text-gentleDanger-900">
            <AlertTriangle aria-hidden className="h-4 w-4" />
            Priorizar segurança
          </div>
        ) : null}
      </div>
    </section>
  );
}
