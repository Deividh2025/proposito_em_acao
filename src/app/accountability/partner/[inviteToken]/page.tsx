import { PartnerLimitedPanel } from "@/components/accountability/PartnerLimitedPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { getAccountabilityInvitePreview } from "@/app/accountability/actions";
import { AcceptInviteButton } from "./AcceptInviteButton";

type PartnerInvitePageProps = {
  params: Promise<{ inviteToken: string }>;
};

export default async function PartnerInvitePage({ params }: PartnerInvitePageProps) {
  const { inviteToken } = await params;
  const preview = await getAccountabilityInvitePreview({ inviteToken });

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
      {!preview.ok ? (
        <SensitiveDataNotice title={preview.requiresAuth ? "Autenticacao necessaria" : "Convite indisponivel"}>
          {preview.message}
        </SensitiveDataNotice>
      ) : null}
      {preview.grant ? <PartnerLimitedPanel grant={preview.grant} /> : null}
      {preview.canAccept ? <AcceptInviteButton inviteToken={inviteToken} /> : null}
    </div>
  );
}
