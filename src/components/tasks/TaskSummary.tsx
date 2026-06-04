import Link from "next/link";

import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import type { ExecutionTaskSummary } from "@/lib/supabase/queries/execution";

export function TaskSummary({ task }: { task: ExecutionTaskSummary }) {
  return (
    <Card as="section" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <ExecutionStatusBadge status={task.status} />
          <h2 className="mt-3 text-xl font-bold text-ink-900">{task.title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">{task.reason}</p>
        </div>
        <Link href={`/tasks/${task.id}`}>
          <Button variant="outline">Ver detalhe</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag>{task.estimatedMinutes} min</Tag>
        <Tag>energia {task.energyLevel}</Tag>
        <Tag>{task.microtasks.length} microtarefas</Tag>
        {task.isSample ? <Tag>Amostra local-demo</Tag> : null}
      </div>
      <div className="rounded-card border border-purpose-100 bg-purpose-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Proxima acao</p>
        <p className="mt-1 text-sm font-semibold text-purpose-900">{task.nextAction}</p>
      </div>
    </Card>
  );
}
