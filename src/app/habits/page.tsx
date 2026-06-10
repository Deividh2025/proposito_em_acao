import { HabitForm } from "@/components/habits/HabitForm";
import { HabitList } from "@/components/habits/HabitList";
import { HabitRestartPrompt } from "@/components/habits/HabitRestartPrompt";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDailyRoutineData } from "@/lib/supabase/queries/daily";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const dailyData = await getDailyRoutineData();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Crie habitos com versao minima, gatilho, recompensa, plano se/entao e retomada sem culpa."
        status={dailyData.canUseSampleData ? "Amostra local-demo" : "Dados autenticados"}
        title="Habitos"
      />
      <HabitForm />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <HabitList
          canUseSampleData={dailyData.canUseSampleData}
          dataMessage={dailyData.message}
          initialHabits={dailyData.habits}
        />
        <HabitRestartPrompt />
      </div>
    </div>
  );
}
