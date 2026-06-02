import { ShieldCheck } from "lucide-react";

import type { AccountabilityInviteDraft } from "@/domain/accountability";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type AccountabilityInvitePreviewProps = {
  draft: AccountabilityInviteDraft;
};

export function AccountabilityInvitePreview({ draft }: AccountabilityInvitePreviewProps) {
  return (
    <Card as="section" className="space-y-4 border-purpose-100 bg-purpose-50/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purpose-700">Previa antes de enviar</p>
          <h2 className="mt-1 text-lg font-bold text-ink-900">{draft.preview.subject}</h2>
        </div>
        <Badge intent={draft.preview.privacy_check.safe_to_send ? "success" : "warning"}>
          {draft.preview.privacy_check.safe_to_send ? "privacy check ok" : "revisar"}
        </Badge>
      </div>
      <p className="text-sm leading-6 text-ink-700">{draft.preview.body}</p>
      <div className="grid gap-2 rounded-card border border-purpose-100 bg-white p-3 text-sm text-ink-700">
        <p className="flex items-center gap-2 font-semibold text-purpose-900">
          <ShieldCheck aria-hidden className="h-4 w-4" />
          Excluido por padrao
        </p>
        <p>{draft.excludedPrivateCategories.join(", ")}.</p>
      </div>
      <p className="text-sm leading-6 text-ink-600">
        Status de notificacao: <strong>{draft.notificationStatus}</strong>. E-mail real so sai quando houver provider
        configurado e nova aprovacao.
      </p>
    </Card>
  );
}
