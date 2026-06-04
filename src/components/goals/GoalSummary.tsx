import Link from "next/link";

import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import type { ExecutionGoalSummary } from "@/lib/supabase/queries/execution";

export function GoalSummary({ goal }: { goal: ExecutionGoalSummary }) {
  return (
    <Card as="section" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <ExecutionStatusBadge status={goal.status} />
          <h2 className="mt-3 text-xl font-bold text-ink-900">{goal.title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">{goal.specific}</p>
        </div>
        <Link href={`/goals/${goal.id}`}>
          <Button variant="outline">Ver detalhe</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag>{goal.lifeArea}</Tag>
        <Tag>alinhamento {goal.alignmentLevel}</Tag>
        <Tag>{goal.isEcologicallySafe ? "ecologico" : "revisar ecologia"}</Tag>
        {goal.isSample ? <Tag>Amostra local-demo</Tag> : null}
      </div>
      <div className="rounded-card border border-purpose-100 bg-purpose-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Proxima acao</p>
        <p className="mt-1 text-sm font-semibold text-purpose-900">{goal.firstAction}</p>
      </div>
    </Card>
  );
}
