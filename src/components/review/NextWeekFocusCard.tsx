import { Card } from "@/components/ui/Card";

type NextWeekFocusCardProps = {
  focus: string;
  firstAction: string;
};

export function NextWeekFocusCard({ firstAction, focus }: NextWeekFocusCardProps) {
  return (
    <Card as="section" className="space-y-3 border-action-100 bg-action-50">
      <h3 className="font-bold text-action-900">Foco da proxima semana</h3>
      <p className="text-sm leading-6 text-action-900">{focus}</p>
      <div className="rounded-card bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-action-700">Primeira acao</p>
        <p className="mt-1 text-sm font-semibold text-ink-900">{firstAction}</p>
      </div>
    </Card>
  );
}
