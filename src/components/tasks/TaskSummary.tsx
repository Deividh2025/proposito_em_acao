import Link from "next/link";

import type { TaskBreakdownOutput } from "@/ai/schemas";
import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

export function TaskSummary({ breakdown, taskId }: { breakdown: TaskBreakdownOutput; taskId: string }) {
  return (
    <Card as="section" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <ExecutionStatusBadge status="pending" />
          <h2 className="mt-3 text-xl font-bold text-ink-900">{breakdown.task_title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">{breakdown.reason}</p>
        </div>
        <Link href={`/tasks/${taskId}`}>
          <Button variant="outline">Ver detalhe</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag>{breakdown.estimated_minutes} min</Tag>
        <Tag>energia {breakdown.energy_level}</Tag>
        <Tag>{breakdown.microtasks.length} microtarefas</Tag>
      </div>
      <div className="rounded-card border border-purpose-100 bg-purpose-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Proxima acao</p>
        <p className="mt-1 text-sm font-semibold text-purpose-900">{breakdown.first_micro_action}</p>
      </div>
    </Card>
  );
}
