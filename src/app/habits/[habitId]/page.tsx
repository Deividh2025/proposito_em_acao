import { HabitList } from "@/components/habits/HabitList";
import { HabitRestartPrompt } from "@/components/habits/HabitRestartPrompt";
import { PageHeader } from "@/components/layout/PageHeader";

type HabitDetailPageProps = {
  params: Promise<{ habitId: string }>;
};

export default async function HabitDetailPage({ params }: HabitDetailPageProps) {
  const { habitId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        description={`Detalhe local/dev do habito ${habitId}. Persistencia real depende de Auth/Supabase.`}
        status="Prompt 11"
        title="Habito"
      />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <HabitList />
        <HabitRestartPrompt />
      </div>
    </div>
  );
}
