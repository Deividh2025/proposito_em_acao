import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreboardCard } from "@/components/scoreboard/ScoreboardCard";
import { getDailyRoutineData } from "@/lib/supabase/queries/daily";

type ScoreboardDetailPageProps = {
  params: Promise<{ scoreboardId: string }>;
};

export default async function ScoreboardDetailPage({ params }: ScoreboardDetailPageProps) {
  const { scoreboardId } = await params;
  const dailyData = await getDailyRoutineData();
  const scoreboard = dailyData.scoreboard?.id === scoreboardId ? dailyData.scoreboard : null;

  return (
    <div className="space-y-6">
      <PageHeader
        description={scoreboard ? dailyData.message : "Placar real nao encontrado para este usuario."}
        status={dailyData.canUseSampleData ? "Amostra local-demo" : "Dados autenticados"}
        title={scoreboard?.title ?? "Placar"}
      />
      <ScoreboardCard
        canUseSampleData={dailyData.canUseSampleData}
        dataMessage={dailyData.message}
        initialRestartCount={dailyData.restartCount}
        initialScoreboard={scoreboard}
      />
    </div>
  );
}
