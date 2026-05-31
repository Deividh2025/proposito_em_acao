import Link from "next/link";

import type { SmartGoalOutput } from "@/ai/schemas";
import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

export function GoalSummary({ goal, goalId }: { goal: SmartGoalOutput; goalId: string }) {
  return (
    <Card as="section" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <ExecutionStatusBadge status={goal.status} />
          <h2 className="mt-3 text-xl font-bold text-ink-900">{goal.title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">{goal.specific}</p>
        </div>
        <Link href={`/goals/${goalId}`}>
          <Button variant="outline">Ver detalhe</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag>{goal.life_area}</Tag>
        <Tag>alinhamento {goal.calling_alignment.alignment_level}</Tag>
        <Tag>{goal.ecological_analysis.is_ecologically_safe ? "ecologico" : "revisar ecologia"}</Tag>
      </div>
      <div className="rounded-card border border-purpose-100 bg-purpose-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Proxima acao</p>
        <p className="mt-1 text-sm font-semibold text-purpose-900">{goal.first_action}</p>
      </div>
    </Card>
  );
}
