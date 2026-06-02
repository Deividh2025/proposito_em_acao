import type { WeeklyReviewPattern } from "@/ai/schemas";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type PatternInsightCardProps = {
  patterns: WeeklyReviewPattern[];
};

export function PatternInsightCard({ patterns }: PatternInsightCardProps) {
  return (
    <Card as="section" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-ink-900">Padroes observados</h3>
        <Badge intent="neutral">leitura, nao diagnostico</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {patterns.map((pattern) => (
          <article className="rounded-card border border-ink-100 bg-white p-3" key={pattern.pattern}>
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-ink-900">{pattern.pattern}</h4>
              <Badge intent={pattern.impact === "high" ? "warning" : "purpose"}>{pattern.impact}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-600">{pattern.suggested_adjustment}</p>
            <ul className="mt-2 space-y-1 text-xs leading-5 text-ink-500">
              {pattern.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Card>
  );
}
