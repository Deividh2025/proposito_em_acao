import { PageHeader } from "@/components/layout/PageHeader";
import { TaskBreakdownForm } from "@/components/tasks/TaskBreakdownForm";

export const dynamic = "force-dynamic";

export default function NewTaskPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Crie uma tarefa pequena ou quebre uma tarefa grande em microtarefas antes de salvar."
        status="Microtarefas"
        title="Nova tarefa"
      />
      <TaskBreakdownForm />
    </div>
  );
}
