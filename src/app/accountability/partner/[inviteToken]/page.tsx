import { PartnerLimitedPanel } from "@/components/accountability/PartnerLimitedPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { buildAccountabilityInviteDraft } from "@/domain/accountability";
import { AcceptInviteButton } from "./AcceptInviteButton";

type PartnerInvitePageProps = {
  params: Promise<{ inviteToken: string }>;
};

export default async function PartnerInvitePage({ params }: PartnerInvitePageProps) {
  const { inviteToken } = await params;
  const grant = buildAccountabilityInviteDraft({
    completedMilestones: ["Marco inicial revisado"],
    firstAction: "Acompanhar uma atualizacao autorizada.",
    goalDeadline: "2026-07-31",
    goalId: "goal-exemplo",
    goalStatus: "ativo",
    goalTitle: "Concluir primeiro marco do alvo",
    level: "balanced",
    notificationFrequency: "weekly",
    partnerEmail: "atalia@example.com",
    partnerName: "Pessoa de confianca",
    permissions: ["goal_name", "status", "completed_milestones", "help_request"],
    progressPercentage: 32
  }).grant;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Aceite apenas se voce entende que o acesso e limitado ao alvo e pode ser revogado."
        status="Prompt 13"
        title="Convite de Atalaia"
      />
      <SensitiveDataNotice title="Escopo limitado">
        Este convite nao libera conta inteira, Chamado completo, Metacognicao, revisoes privadas, inbox ou agenda.
      </SensitiveDataNotice>
      <PartnerLimitedPanel grant={{ ...grant, inviteToken, status: "invited" }} />
      <AcceptInviteButton inviteToken={inviteToken} />
    </div>
  );
}
