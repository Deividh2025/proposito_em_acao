import { HabitList } from "@/components/habits/HabitList";
import { HabitRestartPrompt } from "@/components/habits/HabitRestartPrompt";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDailyRoutineData } from "@/lib/supabase/queries/daily";

export const dynamic = "force-dynamic";

type HabitDetailPageProps = {
  params: Promise<{ habitId: string }>;
};

export default async function HabitDetailPage({ params }: HabitDetailPageProps) {
  const { habitId } = await params;
  const dailyData = await getDailyRoutineData();
  const habit = dailyData.habits.find((item) => item.id === habitId);

  return (
    <div className="space-y-6">
      <PageHeader
        description={habit ? dailyData.message : "Habito real nao encontrado para este usuario."}
        status={dailyData.canUseSampleData ? "Amostra local-demo" : "Dados autenticados"}
        title={habit?.title ?? "Habito"}
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <HabitList
          canUseSampleData={dailyData.canUseSampleData}
          dataMessage={dailyData.message}
          initialHabits={habit ? [habit] : []}
        />
        <HabitRestartPrompt />
      </div>
    </div>
  );
}
