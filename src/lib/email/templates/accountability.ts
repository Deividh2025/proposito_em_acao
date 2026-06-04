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
const footer =
  "Proposito em Acao envia apenas avisos transacionais. Dados sensiveis nao sao enviados por e-mail. Se voce nao reconhece este aviso, ignore esta mensagem.";

function withFooter(lines: string[]) {
  return [...lines, "", footer].join("\n");
}

export function buildAccountabilityEmailTemplate({
  event,
  secureLink = fallbackLink,
  userName
}: AccountabilityEmailTemplateInput): AccountabilityEmailTemplate {
  void userName;

  if (event === "grant_revoked") {
    return {
      body: withFooter([
        "Um acesso de acompanhamento foi encerrado.",
        "Nenhum detalhe privado foi incluido nesta mensagem.",
        `Acesse o app pelo link seguro: ${secureLink}.`
      ]),
      subject: "Atualizacao de acesso",
      templateKey: "accountability_grant_revoked",
      templateVersion: "accountability_email_v1"
    };
  }

  if (event === "commitment_document_shared") {
    return {
      body: withFooter([
        "Um documento foi disponibilizado para revisao dentro do escopo autorizado.",
        "O conteudo fica protegido no app e nao e enviado por e-mail.",
        `Acesse pelo link seguro: ${secureLink}.`
      ]),
      subject: "Documento disponivel para revisao",
      templateKey: "commitment_document_shared",
      templateVersion: "accountability_email_v1"
    };
  }

  if (event === "help_request") {
    return {
      body: withFooter([
        "Ha um pedido de apoio dentro de um acompanhamento autorizado.",
        "Veja o contexto somente no app, dentro do escopo permitido.",
        `Acesse pelo link seguro: ${secureLink}.`
      ]),
      subject: "Pedido de apoio autorizado",
      templateKey: "accountability_help_request",
      templateVersion: "accountability_email_v1"
    };
  }

  if (event === "invite_accepted") {
    return {
      body: withFooter([
        "Um convite de acompanhamento foi aceito.",
        "O acesso continua limitado ao escopo autorizado."
      ]),
      subject: "Convite de acompanhamento aceito",
      templateKey: "accountability_invite_accepted",
      templateVersion: "accountability_email_v1"
    };
  }

  if (event === "delay_alert" || event === "abandonment_risk" || event === "important_status_authorized") {
    return {
      body: withFooter([
        "Ha uma atualizacao importante em um acompanhamento autorizado.",
        "Detalhes ficam disponiveis apenas no app.",
        `Acesse pelo link seguro: ${secureLink}.`
      ]),
      subject: "Atualizacao de acompanhamento",
      templateKey: event === "important_status_authorized" ? "accountability_status_update" : "accountability_delay_alert",
      templateVersion: "accountability_email_v1"
    };
  }

  if (event === "goal_completed" || event === "milestone_completed") {
    return {
      body: withFooter([
        "Um progresso autorizado foi registrado.",
        "Detalhes ficam disponiveis apenas no app.",
        `Acesse pelo link seguro: ${secureLink}.`
      ]),
      subject: "Progresso registrado",
      templateKey: event === "milestone_completed" ? "accountability_milestone_completed" : "accountability_goal_completed",
      templateVersion: "accountability_email_v1"
    };
  }

  return {
    body: withFooter([
      "Voce recebeu um convite para um acompanhamento limitado.",
      "Revise o escopo autorizado antes de aceitar. Dados privados nao sao enviados por e-mail.",
      `Acesse pelo link seguro: ${secureLink}.`
    ]),
    subject: "Convite de acompanhamento",
    templateKey: "accountability_invite",
    templateVersion: "accountability_email_v1"
  };
}
