import { PageHeader } from "@/components/layout/PageHeader";
import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tag } from "@/components/ui/Tag";
import { loadTaskDetail } from "@/lib/supabase/queries/execution";

type TaskDetailPageProps = {
  params: Promise<{ taskId: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { taskId } = await params;
  const taskData = await loadTaskDetail(taskId);
  const task = taskData.item;

  return (
    <div className="space-y-6">
      <PageHeader
        description={taskData.isSample ? "Amostra local-demo rotulada; nao representa persistencia real." : taskData.message}
        status={taskData.mode === "local-demo" ? "Amostra local-demo" : "Detalhe autenticado"}
        title={task?.title ?? "Tarefa"}
      />
      {!task ? (
        <EmptyState
          description="Tarefa real nao encontrada para este usuario, ou o ambiente ainda nao esta autenticado."
          title="Tarefa indisponivel"
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <Card as="section" className="space-y-4">
            <ExecutionStatusBadge status={task.status} />
            <p className="text-sm leading-6 text-ink-700">{task.reason}</p>
            <div className="flex flex-wrap gap-2">
              <Tag>{task.estimatedMinutes} min</Tag>
              <Tag>energia {task.energyLevel}</Tag>
              <Tag>{task.microtasks.length} microtarefas</Tag>
              {task.isSample ? <Tag>Amostra local-demo</Tag> : null}
            </div>
            {task.microtasks.length > 0 ? (
              <ol className="space-y-3">
                {task.microtasks.map((microtask) => (
                  <li className="rounded-card border border-ink-100 bg-white p-3" key={microtask.id}>
                    <p className="font-semibold text-ink-900">{microtask.position}. {microtask.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Tag>{microtask.estimatedMinutes} min</Tag>
                      <Tag>{microtask.status}</Tag>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm leading-6 text-ink-600">Nenhuma microtarefa real salva ainda.</p>
            )}
          </Card>
          <aside className="space-y-4">
            <Card className="border-purpose-100 bg-purpose-50">
              <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Primeira microacao</p>
              <p className="mt-2 text-base font-bold text-purpose-900">{task.nextAction}</p>
            </Card>
            <Card className="border-action-100 bg-action-50">
              <h2 className="font-bold text-action-900">Baixa energia</h2>
              <p className="mt-2 text-sm leading-6 text-action-900">
                Comece por 5 minutos ou leve esta tarefa ao Desbloqueador.
              </p>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
