import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export function LifeGardenPreview() {
  return (
    <Card className="border-purpose-100 bg-purpose-50">
      <Badge intent="purpose">Jardim da Vida</Badge>
      <h2 className="mt-3 font-bold text-purpose-900">Cuidado integral, sem punição</h2>
      <p className="mt-2 text-sm leading-6 text-purpose-900">
        Prévia simbólica para áreas da vida. Áreas frágeis aparecem como convite de cuidado.
      </p>
    </Card>
  );
}

export function GardenAreaTile() {
  return (
    <Card as="div">
      <h3 className="font-bold text-ink-900">Família e descanso</h3>
      <p className="mt-2 text-sm leading-6 text-ink-600">Tile base de área, sem dados reais.</p>
    </Card>
  );
}

export function GardenGrowthIndicator() {
  return <Progress label="Cuidado recente" value={45} />;
}

export function CareNeededIndicator() {
  return <Badge intent="warning">convite de cuidado</Badge>;
}
