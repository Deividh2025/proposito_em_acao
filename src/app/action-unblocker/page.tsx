import { ActionUnblockerForm } from "@/components/action-unblocker/ActionUnblockerForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const dynamic = "force-dynamic";

export default function ActionUnblockerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Transforme uma trava operacional em microação de 2 a 5 minutos, com rota segura para foco, descanso, Metacognição ou ajuda humana."
        status="Prompt 10"
        title="Desbloqueador de ação"
      />
      <ActionUnblockerForm />
    </div>
  );
}
