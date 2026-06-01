import { TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/Card";

export function ScoreboardTrend() {
  return (
    <Card as="section" className="border-action-100 bg-action-50">
      <div className="flex items-start gap-3">
        <TrendingUp aria-hidden className="mt-1 h-5 w-5 text-action-700" />
        <div>
          <h2 className="font-bold text-ink-900">Tendencia cuidadosa</h2>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            Procure padroes de retorno, nao perfeicao. Se a carga subiu, ajuste o minimo.
          </p>
        </div>
      </div>
    </Card>
  );
}
