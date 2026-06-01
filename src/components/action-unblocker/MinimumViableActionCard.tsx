import { RotateCcw } from "lucide-react";

import type { ActionUnblockerOutput } from "@/ai/schemas";
import { Card } from "@/components/ui/Card";

export function MinimumViableActionCard({ output }: { output: ActionUnblockerOutput }) {
  return (
    <Card className="border-warmth-100 bg-warmth-50">
      <div className="flex items-start gap-3">
        <RotateCcw aria-hidden className="mt-1 h-5 w-5 shrink-0 text-warmth-900" />
        <div>
          <h2 className="font-bold text-warmth-900">Versão mínima aceitável</h2>
          <p className="mt-2 text-sm leading-6 text-warmth-900">{output.minimum_viable_action}</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-warmth-900">{output.restart_plan}</p>
        </div>
      </div>
    </Card>
  );
}
