import { HabitForm } from "@/components/habits/HabitForm";
import { HabitList } from "@/components/habits/HabitList";
import { HabitRestartPrompt } from "@/components/habits/HabitRestartPrompt";
import { PageHeader } from "@/components/layout/PageHeader";

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Crie habitos com versao minima, gatilho, recompensa, plano se/entao e retomada sem culpa."
        status="Prompt 11"
        title="Habitos"
      />
      <HabitForm />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <HabitList />
        <HabitRestartPrompt />
      </div>
    </div>
  );
}
