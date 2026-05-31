import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { Tag } from "@/components/ui/Tag";

export function MetacognitionEntryCard() {
  return (
    <Card className="border-action-100 bg-action-50">
      <Badge intent="lowEnergy">Privada por padrão</Badge>
      <h2 className="mt-3 text-lg font-bold text-action-900">Nomear antes de obedecer</h2>
      <p className="mt-2 text-sm leading-6 text-action-900">
        Estrutura visual para estado interno, pensamento automático e retorno à microação.
      </p>
    </Card>
  );
}

export function EmotionIntensityScale() {
  return <Slider label="Intensidade emocional" max={10} min={0} defaultValue={4} />;
}

export function ThoughtBreakdownPreview() {
  return (
    <Card>
      <h2 className="font-bold text-ink-900">Prévia de desmontagem</h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        O pensamento será tratado como hipótese a examinar, não como verdade automática.
      </p>
    </Card>
  );
}

export function FactInterpretationFeelingImpulseGrid() {
  const items = ["Fato", "Interpretação", "Sentimento", "Impulso"];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <Card as="div" key={item}>
          <h3 className="font-bold text-ink-900">{item}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-600">Campo visual base, sem coleta real.</p>
        </Card>
      ))}
    </div>
  );
}

export function CognitivePatternBadge() {
  return <Badge intent="warning">Padrão provável, não diagnóstico</Badge>;
}

export function ReframeCard() {
  return (
    <Card>
      <h2 className="font-bold text-ink-900">Reformulação responsável</h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        Versão mais verdadeira, útil e praticável do pensamento.
      </p>
    </Card>
  );
}

export function ConfrontationQuestionCard() {
  return (
    <Card className="border-purpose-100">
      <h2 className="font-bold text-ink-900">Pergunta de confronto</h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        O que está sob sua responsabilidade agora, sem transformar isso em vergonha?
      </p>
    </Card>
  );
}

export function NextActionAfterReflectionCard() {
  return (
    <Card className="border-purpose-100 bg-purpose-50">
      <h2 className="font-bold text-purpose-900">Depois da reflexão</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <Tag>microação</Tag>
        <Tag>descanso legítimo</Tag>
        <Tag>oração/reflexão opcional</Tag>
      </div>
    </Card>
  );
}
