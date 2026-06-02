import type { GardenStateOutput, WeeklyReviewOutput } from "@/ai/schemas";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PatternInsightCard } from "./PatternInsightCard";
import { RestartMomentsCard } from "./RestartMomentsCard";
import { NextWeekFocusCard } from "./NextWeekFocusCard";

type WeeklyReviewSummaryProps = {
  output: WeeklyReviewOutput;
  garden: GardenStateOutput | null;
};

export function WeeklyReviewSummary({ garden, output }: WeeklyReviewSummaryProps) {
  return (
    <section className="space-y-4" aria-label="Sintese da revisao semanal">
      <Card as="section" className="space-y-3 border-purpose-100 bg-purpose-50">
        <Badge intent="purpose">Sintese revisavel</Badge>
        <h2 className="text-xl font-bold text-purpose-900">Resumo da semana</h2>
        <p className="text-sm leading-6 text-purpose-900">{output.week_summary}</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card as="section">
          <h3 className="font-bold text-ink-900">Vitorias</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-700">
            {output.wins.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card as="section">
          <h3 className="font-bold text-ink-900">Travas sem julgamento</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-700">
            {output.stuck_points.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <PatternInsightCard patterns={output.patterns} />
      <RestartMomentsCard moments={output.restart_moments} />
      <NextWeekFocusCard firstAction={output.first_action_next_week} focus={output.next_week_focus} />

      <Card as="section" className="space-y-3">
        <h3 className="font-bold text-ink-900">Jardim atualizado</h3>
        <p className="text-sm leading-6 text-ink-600">
          {garden?.garden_state.weekly_growth_summary ?? "O Jardim sera atualizado depois da revisao."}
        </p>
        <div className="flex flex-wrap gap-2">
          {garden?.garden_state.unlocked_items.map((item) => (
            <Badge intent="restart" key={item}>{item}</Badge>
          ))}
        </div>
      </Card>

      <Card as="section" className="space-y-2 border-warmth-100 bg-warmth-50">
        <h3 className="font-bold text-warmth-900">Encorajamento</h3>
        <p className="text-sm leading-6 text-warmth-900">{output.encouragement}</p>
        {output.christian_reflection ? (
          <p className="text-sm leading-6 text-warmth-900">{output.christian_reflection}</p>
        ) : null}
      </Card>
    </section>
  );
}
