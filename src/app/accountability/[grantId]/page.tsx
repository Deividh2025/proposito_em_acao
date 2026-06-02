import { AccountabilityGrantCard } from "@/components/accountability/AccountabilityGrantCard";
import { PartnerLimitedPanel } from "@/components/accountability/PartnerLimitedPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { buildAccountabilityInviteDraft } from "@/domain/accountability";

type AccountabilityGrantPageProps = {
  params: Promise<{ grantId: string }>;
};

export default async function AccountabilityGrantPage({ params }: AccountabilityGrantPageProps) {
  const { grantId } = await params;
  const grant = buildAccountabilityInviteDraft({
    completedMilestones: ["Marco inicial concluido"],
    firstAction: "Fazer uma revisao curta do alvo.",
    goalDeadline: "2026-07-31",
    goalId: "goal-exemplo",
    goalStatus: "ativo",
    goalTitle: "Concluir primeiro marco do alvo",
    level: "firm",
    notificationFrequency: "important_events",
    partnerEmail: "atalia@example.com",
    partnerName: "Pessoa de confianca",
    permissions: ["goal_name", "deadline", "status", "progress_percentage", "delay_alert", "help_request"],
    progressPercentage: 44
  }).grant;

  return (
    <div className="space-y-6">
      <PageHeader
        description={`Grant ${grantId}. Exemplo local/dev de acesso por alvo, previa e revogacao.`}
        status="Prompt 13"
        title="Detalhe do Atalaia"
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <AccountabilityGrantCard grant={{ ...grant, id: grantId }} />
        <PartnerLimitedPanel grant={{ ...grant, id: grantId, status: "active" }} />
      </div>
    </div>
  );
}
