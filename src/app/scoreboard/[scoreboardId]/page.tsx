import { PageHeader } from "@/components/layout/PageHeader";
import { ScoreboardCard } from "@/components/scoreboard/ScoreboardCard";

type ScoreboardDetailPageProps = {
  params: Promise<{ scoreboardId: string }>;
};

export default async function ScoreboardDetailPage({ params }: ScoreboardDetailPageProps) {
  const { scoreboardId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        description={`Detalhe local/dev do Placar ${scoreboardId}. Marcacoes reais exigem Auth/Supabase.`}
        status="Prompt 11"
        title="Placar"
      />
      <ScoreboardCard />
    </div>
  );
}
