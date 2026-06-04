import { FocusSessionShell } from "@/components/focus/FocusSessionShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getFocusSetupData } from "@/lib/supabase/queries/daily";

type FocusPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FocusPage({ searchParams }: FocusPageProps) {
  const params = (await searchParams) ?? {};
  const minutesParam = Array.isArray(params.minutes) ? params.minutes[0] : params.minutes;
  const taskId = Array.isArray(params.taskId) ? params.taskId[0] : params.taskId;
  const parsedMinutes = Number(minutesParam);
  const initialDurationMinutes = Number.isFinite(parsedMinutes) && parsedMinutes > 0 ? parsedMinutes : 25;
  const focusData = await getFocusSetupData({ durationMinutes: initialDurationMinutes, taskId });

  return (
    <div className="space-y-6">
      <PageHeader
        description="Execute uma tarefa com timer simples, captura de distracoes e rota segura para destravar ou refletir."
        status={focusData.canUseSampleData ? "Amostra local-demo" : "Dados autenticados"}
        title="Modo Foco"
      />
      <FocusSessionShell
        dataMessage={focusData.message}
        initialDurationMinutes={focusData.plan.durationMinutes}
        initialNextStep={focusData.plan.nextStep}
        initialReason={focusData.plan.reason}
        initialTaskId={focusData.plan.taskId ?? taskId}
        initialTaskTitle={focusData.plan.taskTitle}
      />
    </div>
  );
}
