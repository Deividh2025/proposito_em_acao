import { CheckCircle2 } from "lucide-react";

import type { ActionUnblockerOutput } from "@/ai/schemas";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

export function TinyStepCard({ output }: { output: ActionUnblockerOutput }) {
  return (
    <Card className="border-action-100 bg-action-50">
      <div className="flex items-start gap-3">
        <CheckCircle2 aria-hidden className="mt-1 h-5 w-5 shrink-0 text-action-700" />
        <div>
          <Tag>{output.recommended_focus_minutes} min</Tag>
          <h2 className="mt-3 text-lg font-bold text-action-900">Primeiro passo</h2>
          <p className="mt-2 text-sm leading-6 text-action-900">{output.first_step}</p>
        </div>
      </div>
    </Card>
  );
}
