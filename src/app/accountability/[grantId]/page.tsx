import { AccountabilityGrantCard } from "@/components/accountability/AccountabilityGrantCard";
import { PartnerLimitedPanel } from "@/components/accountability/PartnerLimitedPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { getAccountabilityGrantDetail } from "@/lib/supabase/queries/accountability";
import { getAuthenticatedDataContext } from "@/lib/supabase/queries/authenticated-data";

export const dynamic = "force-dynamic";

type AccountabilityGrantPageProps = {
  params: Promise<{ grantId: string }>;
};

export default async function AccountabilityGrantPage({ params }: AccountabilityGrantPageProps) {
  const { grantId } = await params;
  const context = await getAuthenticatedDataContext();
  const grant =
    context.kind === "authenticated" ? await getAccountabilityGrantDetail(context.supabase, context.user, grantId) : null;
  const message =
    context.kind === "authenticated"
      ? null
      : context.kind === "local-demo"
        ? "Nenhum grant real carregado no modo local-demo."
        : context.userMessage;

  return (
    <div className="space-y-6">
      <PageHeader
        description={`Grant ${grantId}. Leitura limitada por Auth, RLS e estado de revogacao.`}
        status="Prompt 13"
        title="Detalhe do Atalaia"
      />
      {message ? <SensitiveDataNotice title="Dados reais indisponiveis">{message}</SensitiveDataNotice> : null}
      {!grant ? (
        <Card as="section" className="space-y-2">
          <h2 className="font-bold text-ink-900">Acesso indisponivel</h2>
          <p className="text-sm leading-6 text-ink-600">
            Grant inexistente, revogado, expirado ou sem permissao para a sessao atual nao mostra dados do Atalaia.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {grant.viewerRole === "owner" ? <AccountabilityGrantCard grant={grant} /> : null}
          {grant.status === "active" ? <PartnerLimitedPanel grant={grant} /> : null}
        </div>
      )}
    </div>
  );
}
