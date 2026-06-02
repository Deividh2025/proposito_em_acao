import type { AccountabilityNotificationEvent } from "@/domain/notifications";

export type AccountabilityEmailTemplateInput = {
  event: AccountabilityNotificationEvent;
  userName: string;
  safeSummary?: string;
  secureLink?: string;
};

export type AccountabilityEmailTemplate = {
  subject: string;
  body: string;
  templateKey: string;
  templateVersion: "accountability_email_v1";
};

const fallbackLink = "link seguro pendente de configuracao";

export function buildAccountabilityEmailTemplate({
  event,
  safeSummary,
  secureLink = fallbackLink,
  userName
}: AccountabilityEmailTemplateInput): AccountabilityEmailTemplate {
  if (event === "help_request") {
    return {
      body: `${userName} pediu apoio em um alvo autorizado. Pedido: ${safeSummary ?? "resumo autorizado pendente"}. Responda com cuidado e sem cobranca. Acesse: ${secureLink}.`,
      subject: "Pedido de apoio autorizado",
      templateKey: "accountability_help_request",
      templateVersion: "accountability_email_v1"
    };
  }

  if (event === "invite_accepted") {
    return {
      body: "O convite de acompanhamento foi aceito. O acesso continua limitado ao alvo e as permissoes autorizadas.",
      subject: "Convite de Atalaia aceito",
      templateKey: "accountability_invite_accepted",
      templateVersion: "accountability_email_v1"
    };
  }

  if (event === "delay_alert" || event === "abandonment_risk") {
    return {
      body: `Ha um sinal autorizado de atraso em um alvo acompanhado. Resumo seguro: ${safeSummary ?? "revisao pendente"}. Detalhes sensiveis nao sao enviados por e-mail. Acesse: ${secureLink}.`,
      subject: "Atualizacao de alvo autorizado",
      templateKey: "accountability_delay_alert",
      templateVersion: "accountability_email_v1"
    };
  }

  if (event === "goal_completed") {
    return {
      body: `Um alvo acompanhado foi concluido. Resumo autorizado: ${safeSummary ?? "conclusao registrada"}. Acesse: ${secureLink}.`,
      subject: "Alvo autorizado concluido",
      templateKey: "accountability_goal_completed",
      templateVersion: "accountability_email_v1"
    };
  }

  return {
    body: `${userName} convidou voce para acompanhar um alvo especifico. Voce vera apenas o escopo autorizado. Revise o convite pelo link seguro: ${secureLink}.`,
    subject: "Convite para acompanhar um alvo no Proposito em Acao",
    templateKey: "accountability_invite",
    templateVersion: "accountability_email_v1"
  };
}
