import Link from "next/link";

import { AccountabilityGrantCard } from "@/components/accountability/AccountabilityGrantCard";
import { PartnerLimitedPanel } from "@/components/accountability/PartnerLimitedPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { getAccountabilityOverview, type AccountabilityOverview } from "@/lib/supabase/queries/accountability";
import { getAuthenticatedDataContext } from "@/lib/supabase/queries/authenticated-data";

async function loadOverview(): Promise<{ message: string | null; overview: AccountabilityOverview | null }> {
  const context = await getAuthenticatedDataContext();

  if (context.kind !== "authenticated") {
    return {
      message: context.kind === "local-demo" ? "Nenhum dado real carregado no modo local-demo." : context.userMessage,
      overview: null
    };
  }

  try {
    return {
      message: null,
      overview: await getAccountabilityOverview(context.supabase, context.user)
    };
  } catch {
    return {
      message: "Nao foi possivel carregar Atalaias reais agora.",
      overview: null
    };
  }
}

export default async function AccountabilityPage() {
  const { message, overview } = await loadOverview();
  const ownedGrants = overview?.ownedGrants ?? [];
  const partnerGrants = overview?.partnerGrants ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/accountability/new">
              <Button>Novo Atalaia</Button>
            </Link>
            <Link href="/commitments">
              <Button variant="soft">Documento de compromisso</Button>
            </Link>
          </div>
        }
        description="Convide uma pessoa para acompanhar apenas um alvo, com permissoes claras, previa e revogacao."
        status="Prompt 13"
        title="Atalaia"
      />
      <Card as="section" className="space-y-2">
        <h2 className="text-lg font-bold text-ink-900">Proxima acao</h2>
        <p className="max-w-2xl text-sm leading-6 text-ink-600">
          Comece criando um convite para um unico alvo. Depois revise a previa, confirme os campos visiveis e registre o
          convite preparado.
        </p>
        <Link href="/accountability/new">
          <Button variant="soft">Criar convite com previa</Button>
        </Link>
      </Card>
      {message ? <SensitiveDataNotice title="Dados reais indisponiveis">{message}</SensitiveDataNotice> : null}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink-900">Meus Atalaias</h2>
        {ownedGrants.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {ownedGrants.map((grant) => (
              <AccountabilityGrantCard grant={grant} key={grant.id} />
            ))}
          </div>
        ) : (
          <Card as="section" className="space-y-2">
            <h3 className="font-bold text-ink-900">Nenhum Atalaia encontrado</h3>
            <p className="text-sm leading-6 text-ink-600">
              Quando houver grant real criado para um alvo, ele aparece aqui. Sem permissao ou revogacao, nada e exibido.
            </p>
          </Card>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-ink-900">Acessos recebidos</h2>
        {partnerGrants.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {partnerGrants.map((grant) => (
              <PartnerLimitedPanel grant={grant} key={grant.id} />
            ))}
          </div>
        ) : (
          <Card as="section" className="space-y-2">
            <h3 className="font-bold text-ink-900">Nenhum acesso autorizado</h3>
            <p className="text-sm leading-6 text-ink-600">
              Convites revogados, expirados ou sem grant ativo nao liberam painel de Atalaia.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
