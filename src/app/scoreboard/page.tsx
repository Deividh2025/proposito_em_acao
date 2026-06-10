import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreboardCard } from "@/components/scoreboard/ScoreboardCard";
import { getDailyRoutineData } from "@/lib/supabase/queries/daily";

export const dynamic = "force-dynamic";

export default async function ScoreboardPage() {
  const dailyData = await getDailyRoutineData();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Marque comportamentos-chave, habitos, foco e retomadas de forma leve, privada e sem vergonha."
        status={dailyData.canUseSampleData ? "Amostra local-demo" : "Dados autenticados"}
        title="Placar da Disciplina"
      />
      <ScoreboardCard
        canUseSampleData={dailyData.canUseSampleData}
        dataMessage={dailyData.message}
        initialRestartCount={dailyData.restartCount}
        initialScoreboard={dailyData.scoreboard}
      />
    </div>
  );
}
