import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { TaskSummary } from "@/components/tasks/TaskSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { sampleExecutionLinks, sampleTaskBreakdown } from "@/domain/execution/sample-data";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/tasks/new">
            <Button>Criar tarefa</Button>
          </Link>
        }
        description="Centro operacional inicial: tarefa, energia, tempo, microtarefas e proxima microacao."
        status="Prompt 8"
        title="Tarefas e microtarefas"
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <TaskSummary breakdown={sampleTaskBreakdown} taskId={sampleExecutionLinks.taskId} />
        <Card as="aside" className="border-warmth-100 bg-warmth-50">
          <h2 className="font-bold text-warmth-900">Tarefa travada</h2>
          <p className="mt-2 text-sm leading-6 text-warmth-900">
            Estado travado vira rota de apoio: reduzir para versao minima, usar Desbloqueador futuro ou
            encaminhar para Metacognicao futura. Nenhum desses fluxos completos foi implementado aqui.
          </p>
        </Card>
      </div>
    </div>
  );
}
