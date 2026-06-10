import { CommitmentDocumentPreview } from "@/components/commitments/CommitmentDocumentPreview";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { SensitiveDataNotice } from "@/components/ui/SensitiveDataNotice";
import { getAuthenticatedDataContext } from "@/lib/supabase/queries/authenticated-data";
import { getCommitmentDocumentDetail } from "@/lib/supabase/queries/commitments";

export const dynamic = "force-dynamic";

type CommitmentDetailPageProps = {
  params: Promise<{ documentId: string }>;
};

export default async function CommitmentDetailPage({ params }: CommitmentDetailPageProps) {
  const { documentId } = await params;
  const context = await getAuthenticatedDataContext();
  const detail =
    context.kind === "authenticated" ? await getCommitmentDocumentDetail(context.supabase, context.user, documentId) : null;
  const message =
    context.kind === "authenticated"
      ? null
      : context.kind === "local-demo"
        ? "Nenhum documento real carregado no modo local-demo."
        : context.userMessage;

  return (
    <div className="space-y-6">
      <PageHeader
        description={`Documento ${documentId}. Leitura real respeita privacidade, RLS e permissao de compartilhamento.`}
        status="Prompt 13"
        title="Compromisso"
      />
      {message ? <SensitiveDataNotice title="Dados reais indisponiveis">{message}</SensitiveDataNotice> : null}
      {detail ? (
        <CommitmentDocumentPreview draft={detail.draft} />
      ) : (
        <Card as="section" className="space-y-2">
          <h2 className="font-bold text-ink-900">Documento indisponivel</h2>
          <p className="text-sm leading-6 text-ink-600">
            Documento inexistente, privado para outro usuario, nao compartilhado ou sem grant ativo nao e exibido.
          </p>
        </Card>
      )}
    </div>
  );
}
