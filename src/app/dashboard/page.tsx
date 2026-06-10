import { PageHeader } from "@/components/layout/PageHeader";
import { InitialJourneyDashboard } from "@/components/dashboard/InitialJourneyDashboard";
import { loadExecutionOverview } from "@/lib/supabase/queries/execution";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const executionData = await loadExecutionOverview();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Direcao, proximas acoes e dados de execucao carregados com Supabase/RLS quando ha usuario autenticado."
        status={executionData.mode === "local-demo" ? "Amostra local-demo" : "Dados autenticados"}
        title="Sua direção agora"
      />
      <InitialJourneyDashboard executionData={executionData} />
    </div>
  );
}
