import { PageHeader } from "@/components/layout/PageHeader";
import { InitialJourneyDashboard } from "@/components/dashboard/InitialJourneyDashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Estado inicial da jornada: direção, próxima microação e módulos limitados até existir hipótese de Chamado."
        status="Dashboard inicial"
        title="Sua direção agora"
      />
      <InitialJourneyDashboard />
    </div>
  );
}
