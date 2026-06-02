export type AccountabilityStatus = "invited" | "active" | "revoked" | "expired";

export type AccountabilityLevel = "light" | "balanced" | "firm";

export type AccountabilityNotificationFrequency =
  | "milestones_only"
  | "weekly"
  | "important_events"
  | "paused";

export type AccountabilityPermission =
  | "goal_name"
  | "deadline"
  | "status"
  | "progress_percentage"
  | "completed_milestones"
  | "limited_scoreboard"
  | "help_request"
  | "delay_alert"
  | "completion"
  | "custom_message"
  | "commitment_document";

export type AccountabilityPermissions = Partial<Record<AccountabilityPermission, boolean>>;

export type AccountabilityPartnerDraft = {
  name: string;
  email: string;
  status: AccountabilityStatus;
};

export type AccountabilityGrantDraft = {
  id: string;
  goalId: string;
  goalTitle: string;
  status: AccountabilityStatus;
  level: AccountabilityLevel;
  notificationFrequency: AccountabilityNotificationFrequency;
  permissions: AccountabilityPermission[];
  inviteToken: string;
  reviewedAt: string | null;
  revokedAt: string | null;
};

export const accountabilityPermissionLabels: Record<AccountabilityPermission, string> = {
  goal_name: "Ver nome do alvo",
  deadline: "Ver prazo",
  status: "Ver status geral",
  progress_percentage: "Ver progresso percentual",
  completed_milestones: "Ver marcos concluídos",
  limited_scoreboard: "Ver resumo limitado do Placar",
  help_request: "Receber pedido de ajuda",
  delay_alert: "Receber alerta de atraso",
  completion: "Receber conclusão",
  custom_message: "Ver mensagem personalizada",
  commitment_document: "Ver Documento de Compromisso"
};

export const accountabilityLevelLabels: Record<AccountabilityLevel, string> = {
  light: "Leve",
  balanced: "Equilibrado",
  firm: "Firme"
};

export const accountabilityNotificationFrequencyLabels: Record<AccountabilityNotificationFrequency, string> = {
  important_events: "Eventos importantes",
  milestones_only: "Somente marcos",
  paused: "Pausada",
  weekly: "Semanal"
};

export const defaultPermissionsByLevel: Record<AccountabilityLevel, AccountabilityPermission[]> = {
  light: ["goal_name", "status", "completed_milestones", "completion"],
  balanced: ["goal_name", "deadline", "status", "progress_percentage", "completed_milestones", "help_request", "completion"],
  firm: [
    "goal_name",
    "deadline",
    "status",
    "progress_percentage",
    "completed_milestones",
    "limited_scoreboard",
    "help_request",
    "delay_alert",
    "completion",
    "custom_message"
  ]
};

export const prohibitedAccountabilityCategories = [
  "Metacognicao",
  "Chamado completo",
  "Mapa da Vida completo",
  "saude",
  "familia",
  "financas",
  "emocoes",
  "Revisao Semanal completa",
  "Inbox bruto",
  "agenda completa",
  "distracoes de foco",
  "prompts ou respostas brutas de IA"
] as const;
