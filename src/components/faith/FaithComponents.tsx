import { Card } from "@/components/ui/Card";

export function ReflectionCard() {
  return (
    <Card>
      <h2 className="font-bold text-ink-900">Reflexão opcional</h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        Espaço discreto para sabedoria, descanso e mordomia, respeitando configuração futura.
      </p>
    </Card>
  );
}

export function GratitudePrompt() {
  return (
    <Card>
      <h2 className="font-bold text-ink-900">Gratidão</h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        Uma pergunta curta para perceber avanço real sem moralismo.
      </p>
    </Card>
  );
}

export function WisdomNote() {
  return (
    <Card>
      <h2 className="font-bold text-ink-900">Nota de sabedoria</h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        Camada cristã deve ser configurável, madura e nunca culpabilizante.
      </p>
    </Card>
  );
}
