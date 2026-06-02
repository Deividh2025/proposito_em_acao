import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type RestartMomentsCardProps = {
  moments: string[];
};

export function RestartMomentsCard({ moments }: RestartMomentsCardProps) {
  return (
    <Card as="section" className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-bold text-ink-900">Retomadas</h3>
        <Badge intent="restart">progresso real</Badge>
      </div>
      <ul className="space-y-2 text-sm leading-6 text-ink-700">
        {moments.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
