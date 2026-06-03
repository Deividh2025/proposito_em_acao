import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { AccountabilityGrantPreview } from "@/domain/accountability";

type PartnerLimitedPanelProps = {
  grant: AccountabilityGrantPreview;
};

export function PartnerLimitedPanel({ grant }: PartnerLimitedPanelProps) {
  return (
    <Card as="section" className="space-y-4 border-action-100 bg-action-50/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-action-700">Painel limitado do Atalaia</p>
          <h2 className="mt-1 text-lg font-bold text-ink-900">{grant.goalTitle}</h2>
        </div>
        <Badge intent="action">{grant.status}</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-card bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Status</p>
          <p className="mt-1 font-bold text-ink-900">Alvo autorizado</p>
        </div>
        <div className="rounded-card bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Escopo</p>
          <p className="mt-1 font-bold text-ink-900">{grant.permissions.length} permissoes</p>
        </div>
        <div className="rounded-card bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Revogacao</p>
          <p className="mt-1 font-bold text-ink-900">Efeito imediato</p>
        </div>
      </div>
      <p className="flex items-start gap-2 text-sm leading-6 text-ink-700">
        <ShieldCheck aria-hidden className="mt-1 h-4 w-4 shrink-0 text-action-700" />
        Este painel nao mostra conta inteira nem categorias privadas fora do escopo autorizado.
      </p>
    </Card>
  );
}
