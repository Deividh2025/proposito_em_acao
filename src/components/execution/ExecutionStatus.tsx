import { Badge } from "@/components/ui/Badge";
import type { GoalStatus } from "@/domain/goals";
import type { ProjectStatus } from "@/domain/projects";
import type { MicrotaskStatus, TaskStatus } from "@/domain/tasks";

type Status = GoalStatus | ProjectStatus | TaskStatus | MicrotaskStatus;

const labels: Record<Status, string> = {
  draft: "Rascunho",
  active: "Ativo",
  paused: "Pausado",
  completed: "Concluido",
  abandoned: "Abandonado",
  needs_review: "Revisar",
  archived: "Arquivado",
  pending: "Pendente",
  scheduled: "Agendado",
  in_focus: "Em foco",
  deferred: "Adiado",
  stuck: "Travado",
  cancelled: "Cancelado",
  skipped: "Pulou"
};

export function ExecutionStatusBadge({ status }: { status: Status }) {
  const intent = status === "completed" ? "success" : status === "stuck" || status === "needs_review" ? "warning" : "neutral";

  return <Badge intent={intent}>{labels[status]}</Badge>;
}
