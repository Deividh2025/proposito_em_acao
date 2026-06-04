import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tag } from "@/components/ui/Tag";
import { loadProjectDetail } from "@/lib/supabase/queries/execution";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const projectData = await loadProjectDetail(projectId);
  const project = projectData.item;

  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/tasks/new">
            <Button>Criar tarefa</Button>
          </Link>
        }
        description={projectData.isSample ? "Amostra local-demo rotulada; nao representa persistencia real." : projectData.message}
        status={projectData.mode === "local-demo" ? "Amostra local-demo" : "Detalhe autenticado"}
        title={project?.title ?? "Projeto"}
      />
      {!project ? (
        <EmptyState
          description="Projeto real nao encontrado para este usuario, ou o ambiente ainda nao esta autenticado."
          title="Projeto indisponivel"
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <Card as="section">
            <ExecutionStatusBadge status={project.status} />
            {project.isSample ? <Tag>Amostra local-demo</Tag> : null}
            <p className="mt-4 text-sm leading-6 text-ink-700">{project.description}</p>
            <h2 className="mt-5 font-bold text-ink-900">Tarefas iniciais</h2>
            {project.initialTasks.length > 0 ? (
              <ol className="mt-3 space-y-3">
                {project.initialTasks.map((task) => (
                  <li className="rounded-card border border-ink-100 bg-ink-50 p-3" key={task.id}>
                    <p className="font-semibold text-ink-900">{task.title}</p>
                    <p className="mt-1 text-sm leading-6 text-ink-600">{task.description || task.nextAction}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm leading-6 text-ink-600">Nenhuma tarefa real vinculada ainda.</p>
            )}
          </Card>
          <aside className="space-y-4">
            <Card className="border-action-100 bg-action-50">
              <p className="text-xs font-semibold uppercase tracking-wide text-action-700">Proxima acao</p>
              <p className="mt-2 text-base font-bold text-action-900">{project.nextAction}</p>
            </Card>
            <Card>
              <h2 className="font-bold text-ink-900">Riscos e recursos</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[...project.risks, ...project.resources].map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
