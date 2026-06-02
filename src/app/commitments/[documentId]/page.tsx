import { CommitmentDocumentPreview } from "@/components/commitments/CommitmentDocumentPreview";
import { PageHeader } from "@/components/layout/PageHeader";
import { buildCommitmentDocumentDraft } from "@/domain/commitments";

type CommitmentDetailPageProps = {
  params: Promise<{ documentId: string }>;
};

export default async function CommitmentDetailPage({ params }: CommitmentDetailPageProps) {
  const { documentId } = await params;
  const draft = buildCommitmentDocumentDraft({
    callingSummary: "",
    callingSummaryAuthorized: false,
    deadline: "2026-07-31",
    firstAction: "Executar o primeiro passo combinado.",
    goalId: "goal-exemplo",
    goalTitle: "Concluir primeiro marco do alvo",
    linkedProjects: ["Preparar ambiente", "Executar primeiro passo"],
    partnerEmail: "atalia@example.com",
    partnerName: "Pessoa de confianca",
    restorativeConsequence: "Fazer uma revisao curta e reduzir escopo.",
    reward: "Pausa curta planejada.",
    scoreboardItems: ["Primeiro passo concluido"],
    sharingPermissions: ["goal_name", "deadline", "status", "commitment_document"],
    supportingHabits: ["Revisao de 10 minutos"],
    userName: "Usuario"
  });

  return (
    <div className="space-y-6">
      <PageHeader
        description={`Documento ${documentId}. Exemplo local/dev; compartilhar exige permissao e nova previa.`}
        status="Prompt 13"
        title="Compromisso"
      />
      <CommitmentDocumentPreview draft={draft} />
    </div>
  );
}
