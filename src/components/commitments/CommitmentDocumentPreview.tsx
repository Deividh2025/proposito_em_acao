import type { CommitmentDocumentDraft } from "@/domain/commitments";
import { accountabilityPermissionLabels } from "@/domain/accountability";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type CommitmentDocumentPreviewProps = {
  draft: CommitmentDocumentDraft;
};

export function CommitmentDocumentPreview({ draft }: CommitmentDocumentPreviewProps) {
  return (
    <Card as="section" className="space-y-4 border-purpose-100 bg-purpose-50/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Documento revisavel</p>
          <h2 className="mt-1 text-lg font-bold text-ink-900">{draft.document.title}</h2>
        </div>
        <Badge intent="warning">nao compartilhado</Badge>
      </div>
      <p className="text-sm leading-6 text-ink-700">{draft.document.commitment_statement}</p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-card bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Primeira acao</p>
          <p className="mt-1 text-sm font-semibold text-ink-900">{draft.document.first_action}</p>
        </div>
        <div className="rounded-card bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Permissoes de compartilhamento</p>
          <p className="mt-1 text-sm font-semibold text-ink-900">
            {draft.document.sharing_permissions.length
              ? draft.document.sharing_permissions.map((permission) => accountabilityPermissionLabels[permission]).join(", ")
              : "nenhuma"}
          </p>
        </div>
      </div>
      {draft.document.calling_summary ? (
        <p className="rounded-card border border-purpose-100 bg-white p-3 text-sm leading-6 text-ink-700">
          Resumo autorizado do Chamado: {draft.document.calling_summary}
        </p>
      ) : null}
      <p className="text-sm leading-6 text-ink-600">{draft.privacyNotice}</p>
    </Card>
  );
}
