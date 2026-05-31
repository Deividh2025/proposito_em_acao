import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export function ScoreboardCard() {
  return (
    <Card>
      <Badge intent="success">Placar</Badge>
      <h2 className="mt-3 font-bold text-ink-900">Constância sem vergonha</h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        Marcações futuras devem valorizar retomada, não perfeição.
      </p>
    </Card>
  );
}

export function ScoreboardItem() {
  return (
    <div className="rounded-card border border-ink-100 bg-white p-3">
      <p className="font-semibold text-ink-900">Microação alinhada</p>
      <p className="mt-1 text-sm text-ink-500">Placeholder de item do Placar.</p>
    </div>
  );
}

export function ScoreboardMarker() {
  return <Badge intent="purpose">marcado hoje</Badge>;
}

export function StreakSoftIndicator() {
  return <Progress label="Ritmo suave" value={60} />;
}

export function RestartCountBadge() {
  return <Badge intent="restart">2 retomadas valorizadas</Badge>;
}
