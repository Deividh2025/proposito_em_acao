import { FocusSessionShell } from "@/components/focus/FocusSessionShell";
import { PageHeader } from "@/components/layout/PageHeader";

type FocusPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FocusPage({ searchParams }: FocusPageProps) {
  const params = (await searchParams) ?? {};
  const minutesParam = Array.isArray(params.minutes) ? params.minutes[0] : params.minutes;
  const taskId = Array.isArray(params.taskId) ? params.taskId[0] : params.taskId;
  const parsedMinutes = Number(minutesParam);
  const initialDurationMinutes = Number.isFinite(parsedMinutes) && parsedMinutes > 0 ? parsedMinutes : 25;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Execute uma tarefa com timer simples, captura de distracoes e rota segura para destravar ou refletir."
        status="Prompt 11"
        title="Modo Foco"
      />
      <FocusSessionShell initialDurationMinutes={initialDurationMinutes} initialTaskId={taskId} />
    </div>
  );
}
