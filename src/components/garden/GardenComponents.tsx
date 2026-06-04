import type { GardenAreaState, GardenStateOutput } from "@/ai/schemas";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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

const visualStateLabel: Record<GardenAreaState["visual_state"], string> = {
  seed: "semente",
  sprout: "broto",
  growing: "crescendo",
  fruitful: "frutificando",
  needs_care: "pede cuidado"
};

type LifeGardenProps = {
  message?: string;
  mode?: "blocked" | "local-demo" | "supabase";
  state: GardenStateOutput | null;
};

export function LifeGarden({ message, mode = "supabase", state }: LifeGardenProps) {
  if (!state) {
    return (
      <EmptyState
        description={message ?? "Salve uma Revisao Semanal para gerar um snapshot privado do Jardim."}
        title="Sem snapshot privado do Jardim"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card as="section" className="space-y-3 border-purpose-100 bg-purpose-50">
        <div className="flex flex-wrap gap-2">
          <Badge intent="purpose">Jardim da Vida</Badge>
          {mode === "local-demo" ? <Badge intent="warning">demonstrativo local/dev</Badge> : null}
        </div>
        <h2 className="text-xl font-bold text-purpose-900">Progresso visual sem vergonha</h2>
        <p className="text-sm leading-6 text-purpose-900">{state.garden_state.weekly_growth_summary}</p>
        {message ? <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">{message}</p> : null}
        <div className="flex flex-wrap gap-2">
          {state.garden_state.unlocked_items.map((item) => (
            <Badge intent="restart" key={item}>{item}</Badge>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.garden_state.life_areas.map((area) => (
          <GardenAreaTile area={area} key={area.area} />
        ))}
      </div>
    </div>
  );
}

type GardenAreaTileProps = {
  area?: GardenAreaState;
};

export function GardenAreaTile({ area }: GardenAreaTileProps) {
  if (!area) {
    return null;
  }

  const progressValue = area.growth_level * 20;

  return (
    <Card as="article" className={area.care_needed ? "border-warmth-100 bg-warmth-50" : undefined}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-ink-900">{area.area}</h3>
          <p className="mt-1 text-sm leading-6 text-ink-600">{area.care_message}</p>
        </div>
        <Badge intent={area.care_needed ? "warning" : "purpose"}>{visualStateLabel[area.visual_state]}</Badge>
      </div>
      <div className="mt-4">
        <GardenGrowthIndicator label={`Cuidado em ${area.area}`} value={progressValue} />
      </div>
      {area.care_needed ? <CareNeededIndicator message="Convite de cuidado, nao punicao." /> : null}
      <GardenEventList events={area.recent_events} />
    </Card>
  );
}

type GardenGrowthIndicatorProps = {
  label?: string;
  value?: number;
};

export function GardenGrowthIndicator({ label = "Cuidado recente", value = 45 }: GardenGrowthIndicatorProps) {
  return <Progress label={label} value={value} />;
}

type CareNeededIndicatorProps = {
  message?: string;
};

export function CareNeededIndicator({ message = "convite de cuidado" }: CareNeededIndicatorProps) {
  return <Badge intent="warning">{message}</Badge>;
}

type GardenEventListProps = {
  events: string[];
};

export function GardenEventList({ events }: GardenEventListProps) {
  return (
    <ul className="mt-3 space-y-1 text-xs leading-5 text-ink-600">
      {events.map((event) => (
        <li key={event}>{event}</li>
      ))}
    </ul>
  );
}
