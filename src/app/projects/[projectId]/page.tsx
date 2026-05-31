import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { sampleProjectPlan } from "@/domain/execution/sample-data";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const project = sampleProjectPlan.projects[0]!;

  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/tasks/new">
            <Button>Criar tarefa</Button>
          </Link>
        }
        description={`Detalhe revisavel do projeto ${projectId}. Calendario funcional fica para etapa futura.`}
        status="Detalhe de projeto"
        title={project.title}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card as="section">
          <ExecutionStatusBadge status="needs_review" />
          <p className="mt-4 text-sm leading-6 text-ink-700">{project.description}</p>
          <h2 className="mt-5 font-bold text-ink-900">Tarefas iniciais</h2>
          <ol className="mt-3 space-y-3">
            {project.tasks.map((task) => (
              <li className="rounded-card border border-ink-100 bg-ink-50 p-3" key={task.title}>
                <p className="font-semibold text-ink-900">{task.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-600">{task.description}</p>
              </li>
            ))}
          </ol>
        </Card>
        <aside className="space-y-4">
          <Card className="border-action-100 bg-action-50">
            <p className="text-xs font-semibold uppercase tracking-wide text-action-700">Proxima acao</p>
            <p className="mt-2 text-base font-bold text-action-900">
              {project.tasks[0]?.microtasks[0] ?? "Escolher a primeira tarefa pequena."}
            </p>
          </Card>
          <Card>
            <h2 className="font-bold text-ink-900">Riscos e recursos</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.risks.map((risk) => (
                <Tag key={risk}>{risk}</Tag>
              ))}
              {project.resources_needed.map((resource) => (
                <Tag key={resource}>{resource}</Tag>
              ))}
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-600">{project.restart_plan}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
