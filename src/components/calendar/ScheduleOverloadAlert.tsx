import { AlertTriangle } from "lucide-react";

import type { ScheduleOverloadOutput } from "@/ai/schemas";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type ScheduleOverloadAlertProps = {
  alert: ScheduleOverloadOutput;
};

export function ScheduleOverloadAlert({ alert }: ScheduleOverloadAlertProps) {
  if (alert.overload_level === "low") {
    return null;
  }

  return (
    <Card as="section" className="border-warmth-100 bg-warmth-50">
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden className="mt-1 h-5 w-5 text-warmth-900" />
        <div>
          <Badge intent="warning">Sobrecarga com cuidado</Badge>
          <h2 className="mt-2 font-bold text-warmth-900">{alert.message}</h2>
          <ul className="mt-3 space-y-1 text-sm leading-6 text-warmth-900">
            {alert.recommended_adjustments.slice(0, 3).map((adjustment) => (
              <li key={adjustment}>{adjustment}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
