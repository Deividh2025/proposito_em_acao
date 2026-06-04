import Link from "next/link";

import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import type { ExecutionProjectSummary } from "@/lib/supabase/queries/execution";

export function ProjectSummary({ project }: { project: ExecutionProjectSummary }) {
  return (
    <Card as="section" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <ExecutionStatusBadge status={project.status} />
          <h2 className="mt-3 text-xl font-bold text-ink-900">{project.title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">{project.description}</p>
        </div>
        <Link href={`/projects/${project.id}`}>
          <Button variant="outline">Ver detalhe</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag>{project.phase}</Tag>
        <Tag>{project.risks.length} riscos</Tag>
        <Tag>{project.initialTasks.length} tarefas iniciais</Tag>
        {project.isSample ? <Tag>Amostra local-demo</Tag> : null}
      </div>
      <div className="rounded-card border border-action-100 bg-action-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-action-700">Proxima acao</p>
        <p className="mt-1 text-sm font-semibold text-action-900">{project.nextAction}</p>
      </div>
    </Card>
  );
}
