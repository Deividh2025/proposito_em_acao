import "server-only";

import { getServerEnv } from "@/lib/config/env";

export type SafeEmailMessage = {
  to: string;
  subject: string;
  body: string;
  metadata: {
    goalId: string;
    grantId?: string;
    templateKey: string;
    templateVersion: string;
  };
};

export type EmailSendResult = {
  provider: "none" | "mock" | "configured";
  status: "pending_provider_config" | "queued" | "sent" | "blocked";
  message: string;
};

export type EmailProvider = {
  name: "none" | "mock" | "configured";
  canSend: boolean;
  send(message: SafeEmailMessage): Promise<EmailSendResult>;
};

export function createEmailProvider(): EmailProvider {
  const env = getServerEnv();
  const hasProvider = Boolean(env.EMAIL_PROVIDER?.trim() && env.EMAIL_FROM?.trim());

  if (!hasProvider) {
    return {
      canSend: false,
      name: "none",
      async send() {
        return {
          message: "E-mail real nao configurado. Notificacao mantida como pending_provider_config.",
          provider: "none",
          status: "pending_provider_config"
        };
      }
    };
  }

  return {
    canSend: false,
    name: "configured",
    async send() {
      return {
        message: "Provider informado, mas adaptador real ainda nao foi implementado nesta etapa.",
        provider: "configured",
        status: "blocked"
      };
    }
  };
}
