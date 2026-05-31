import Link from "next/link";

import type { ProjectPlanOutput } from "@/ai/schemas";
import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

export function ProjectSummary({ plan, projectId }: { plan: ProjectPlanOutput; projectId: string }) {
  const project = plan.projects[0];

  if (!project) {
    return null;
  }

  return (
    <Card as="section" className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <ExecutionStatusBadge status="needs_review" />
          <h2 className="mt-3 text-xl font-bold text-ink-900">{project.title}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">{project.description}</p>
        </div>
        <Link href={`/projects/${projectId}`}>
          <Button variant="outline">Ver detalhe</Button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Tag>{project.phase}</Tag>
        <Tag>{project.milestones.length} marcos</Tag>
        <Tag>{project.tasks.length} tarefa inicial</Tag>
      </div>
      <div className="rounded-card border border-action-100 bg-action-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-action-700">Proxima acao</p>
        <p className="mt-1 text-sm font-semibold text-action-900">
          {project.tasks[0]?.microtasks[0] ?? "Escolher a primeira tarefa pequena."}
        </p>
      </div>
    </Card>
  );
}
