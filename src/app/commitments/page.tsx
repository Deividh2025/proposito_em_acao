import { CommitmentDocumentBuilder } from "@/components/commitments/CommitmentDocumentBuilder";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CommitmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Documento revisavel, recompensas saudaveis e consequencias restaurativas antes de qualquer compartilhamento."
        status="Prompt 13"
        title="Documento de Compromisso"
      />
      <CommitmentDocumentBuilder />
    </div>
  );
}
