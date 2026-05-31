import { PageHeader } from "@/components/layout/PageHeader";
import { MicrotaskChecklist } from "@/components/execution/MicrotaskChecklist";
import { ExecutionStatusBadge } from "@/components/execution/ExecutionStatus";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { sampleTaskBreakdown } from "@/domain/execution/sample-data";

type TaskDetailPageProps = {
  params: Promise<{ taskId: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { taskId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        description={`Detalhe executavel da tarefa ${taskId}: foco em proxima microacao, energia e retomada.`}
        status="Detalhe de tarefa"
        title={sampleTaskBreakdown.task_title}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card as="section" className="space-y-4">
          <ExecutionStatusBadge status="pending" />
          <p className="text-sm leading-6 text-ink-700">{sampleTaskBreakdown.reason}</p>
          <div className="flex flex-wrap gap-2">
            <Tag>{sampleTaskBreakdown.estimated_minutes} min</Tag>
            <Tag>energia {sampleTaskBreakdown.energy_level}</Tag>
            <Tag>{sampleTaskBreakdown.microtasks.length} microtarefas</Tag>
          </div>
          <MicrotaskChecklist breakdown={sampleTaskBreakdown} taskId={taskId} />
        </Card>
        <aside className="space-y-4">
          <Card className="border-purpose-100 bg-purpose-50">
            <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Primeira microacao</p>
            <p className="mt-2 text-base font-bold text-purpose-900">
              {sampleTaskBreakdown.first_micro_action}
            </p>
          </Card>
          <Card className="border-action-100 bg-action-50">
            <h2 className="font-bold text-action-900">Baixa energia</h2>
            <p className="mt-2 text-sm leading-6 text-action-900">
              Versao minima: {sampleTaskBreakdown.fallback_minimum_version}
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
