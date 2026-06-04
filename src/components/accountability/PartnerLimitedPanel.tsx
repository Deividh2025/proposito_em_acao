import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  accountabilityPermissionLabels,
  type AccountabilityGrantAccessView,
  type AccountabilityGrantPreview,
  type AccountabilityPermission
} from "@/domain/accountability";

type PartnerLimitedPanelProps = {
  grant: AccountabilityGrantPreview | AccountabilityGrantAccessView;
};

function canSee(grant: AccountabilityGrantPreview | AccountabilityGrantAccessView, permission: AccountabilityPermission) {
  return grant.permissions.includes(permission);
}

function sharedValue(grant: AccountabilityGrantPreview | AccountabilityGrantAccessView, permission: AccountabilityPermission) {
  if (!("sharedData" in grant)) {
    return null;
  }

  if (permission === "goal_name") {
    return grant.sharedData.goalTitle;
  }

  if (permission === "deadline") {
    return grant.sharedData.deadline;
  }

  if (permission === "status") {
    return grant.sharedData.goalStatus;
  }

  if (permission === "progress_percentage") {
    return grant.sharedData.progressPercentage === null ? null : `${grant.sharedData.progressPercentage}%`;
  }

  if (permission === "completed_milestones") {
    return grant.sharedData.completedMilestones.length > 0
      ? `${grant.sharedData.completedMilestones.length} marcos compartilhados`
      : "Sem marcos compartilhados";
  }

  return null;
}

export function PartnerLimitedPanel({ grant }: PartnerLimitedPanelProps) {
  const title = canSee(grant, "goal_name") ? sharedValue(grant, "goal_name") ?? grant.goalTitle : "Alvo autorizado";
  const availableFields: AccountabilityPermission[] = [
    "goal_name",
    "deadline",
    "status",
    "progress_percentage",
    "completed_milestones",
    "limited_scoreboard",
    "help_request",
    "delay_alert",
    "completion",
    "custom_message",
    "commitment_document"
  ];
  const visibleFields = availableFields.filter((permission) => canSee(grant, permission));

  return (
    <Card as="section" className="space-y-4 border-action-100 bg-action-50/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-action-700">Painel limitado do Atalaia</p>
          <h2 className="mt-1 text-lg font-bold text-ink-900">{title}</h2>
        </div>
        <Badge intent="action">{grant.status}</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-card bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Acesso</p>
          <p className="mt-1 font-bold text-ink-900">{grant.status === "active" ? "Ativo" : "Indisponivel"}</p>
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
      {visibleFields.length > 0 ? (
        <div className="grid gap-2 text-sm text-ink-700">
          {visibleFields.map((permission) => (
            <p key={permission}>
              <span className="font-semibold text-ink-900">{accountabilityPermissionLabels[permission]}:</span>{" "}
              {sharedValue(grant, permission) ?? "Autorizado sem detalhe adicional nesta tela"}
            </p>
          ))}
        </div>
      ) : null}
      <p className="flex items-start gap-2 text-sm leading-6 text-ink-700">
        <ShieldCheck aria-hidden className="mt-1 h-4 w-4 shrink-0 text-action-700" />
        Este painel nao mostra conta inteira nem categorias privadas fora do escopo autorizado.
      </p>
    </Card>
  );
}
