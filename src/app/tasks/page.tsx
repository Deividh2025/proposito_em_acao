import Link from "next/link";

export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/layout/PageHeader";
import { TaskSummary } from "@/components/tasks/TaskSummary";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { loadTaskList, type ExecutionDataMode } from "@/lib/supabase/queries/execution";

export default async function TasksPage() {
  const tasksData = await loadTaskList();

  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <Link href="/tasks/new">
            <Button>Criar tarefa</Button>
          </Link>
        }
        description="Centro operacional inicial: tarefa, energia, tempo, microtarefas e proxima microacao."
        status={tasksData.mode === "local-demo" ? "Amostra local-demo" : "Dados autenticados"}
        title="Tarefas e microtarefas"
      />
      <DataStateNotice mode={tasksData.mode} message={tasksData.message} />
      {tasksData.items.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-4">
            {tasksData.items.map((task) => (
              <TaskSummary key={task.id} task={task} />
            ))}
          </div>
          <Card as="aside" className="border-warmth-100 bg-warmth-50">
            <h2 className="font-bold text-warmth-900">Tarefa travada</h2>
            <p className="mt-2 text-sm leading-6 text-warmth-900">
              Estado travado vira rota de apoio: reduzir para versao minima, usar Desbloqueador ou
              encaminhar para Metacognicao quando a trava for pensamento.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-control bg-warmth-700 px-4 text-sm font-semibold text-white transition duration-200 hover:bg-warmth-900"
                href="/action-unblocker"
              >
                Destravar agora
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-warmth-100 px-4 text-sm font-semibold text-warmth-900 transition duration-200 hover:bg-warmth-100"
                href="/metacognition"
              >
                Clarear pensamento
              </Link>
            </div>
          </Card>
        </div>
      ) : (
        <EmptyTasksState mode={tasksData.mode} />
      )}
    </div>
  );
}

function DataStateNotice({ message, mode }: { message: string; mode: ExecutionDataMode }) {
  return (
    <Card as="section" className={mode === "local-demo" ? "border-purpose-100 bg-purpose-50" : ""}>
      <p className="text-sm leading-6 text-ink-700">{message}</p>
    </Card>
  );
}

function EmptyTasksState({ mode }: { mode: ExecutionDataMode }) {
  const needsAuth = mode === "auth-required" || mode === "blocked";

  return (
    <Card as="section">
      <h2 className="font-bold text-ink-900">
        {needsAuth ? "Nenhuma tarefa real carregada" : "Nenhuma tarefa salva ainda"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        {needsAuth
          ? "Tarefas reais aparecem somente com usuario autenticado e Supabase/RLS disponivel."
          : "Crie a primeira tarefa executavel com proxima microacao clara."}
      </p>
      <Link className="mt-4 inline-flex" href="/tasks/new">
        <Button>Criar tarefa</Button>
      </Link>
    </Card>
  );
}
