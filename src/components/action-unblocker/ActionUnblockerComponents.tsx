import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

export function ActionUnblockerCard() {
  return (
    <Card className="border-purpose-100">
      <Badge intent="purpose">Desbloqueador</Badge>
      <h2 className="mt-3 font-bold text-ink-900">Sair da trava para o primeiro passo</h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        Base visual para bloqueio, energia, tempo e próximo passo. Sem IA real nesta etapa.
      </p>
    </Card>
  );
}

export function ObstacleSelector() {
  return (
    <Card>
      <h2 className="font-bold text-ink-900">O que travou?</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {["clareza", "medo", "energia", "tempo", "perfeccionismo"].map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    </Card>
  );
}

export function TinyStepCard() {
  return (
    <Card className="border-action-100 bg-action-50">
      <h2 className="font-bold text-action-900">Passo minúsculo</h2>
      <p className="mt-2 text-sm leading-6 text-action-900">
        Abrir, escolher, iniciar. O primeiro passo deve caber em poucos minutos.
      </p>
    </Card>
  );
}

export function MinimumViableActionCard() {
  return (
    <Card className="border-warmth-100 bg-warmth-50">
      <h2 className="font-bold text-warmth-900">Versão mínima aceitável</h2>
      <p className="mt-2 text-sm leading-6 text-warmth-900">
        Fazer menos, mas fazer de forma honesta, é uma rota válida de retomada.
      </p>
    </Card>
  );
}
