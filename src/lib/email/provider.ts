import "server-only";

import { getServerEnv, type ServerEnv } from "@/lib/config/env";

import { queueMockEmail } from "./mockProvider";
import { createResendEmailProvider } from "./resendProvider";

export type EmailProviderName = "none" | "mock" | "resend";
export type EmailSendStatus = "blocked" | "failed" | "pending_provider_config" | "queued" | "sent";

export type SafeEmailMessage = {
  body: string;
  to: string;
  subject: string;
  metadata: {
    goalId: string;
    grantId?: string;
    notificationId?: string;
    templateKey: string;
    templateVersion: string;
  };
};

export type EmailSendResult = {
  blockedReason?: string;
  message: string;
  provider: EmailProviderName;
  providerMessageId?: string;
  status: EmailSendStatus;
};

export type EmailProvider = {
  canSend: boolean;
  name: EmailProviderName;
  send(message: SafeEmailMessage): Promise<EmailSendResult>;
};

function blockedProvider(provider: EmailProviderName, message: string, blockedReason: string): EmailProvider {
  return {
    canSend: false,
    name: provider,
    async send() {
      return {
        blockedReason,
        message,
        provider,
        status: blockedReason === "pending_provider_config" ? "pending_provider_config" : "blocked"
      };
    }
  };
}

function normalizeProviderName(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function extractEmailAddress(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  const match = trimmed.match(/<([^<>@\s]+@[^<>@\s]+)>$/);

  return (match?.[1] ?? trimmed).toLowerCase();
}

export function resolveNotificationSender(env: ServerEnv = getServerEnv()) {
  return env.EMAIL_FROM_NOTIFICATIONS?.trim() || env.EMAIL_FROM?.trim() || "";
}

function hasApprovedSenderDomain(sender: string) {
  const email = extractEmailAddress(sender);

  if (!email || !email.includes("@")) {
    return false;
  }

  const domain = email.split("@")[1] ?? "";

  return domain.startsWith("notify.") && domain !== "notify.example.com";
}

export function createEmailProvider(): EmailProvider {
  const env = getServerEnv();
  const providerName = normalizeProviderName(env.EMAIL_PROVIDER);
  const sender = resolveNotificationSender(env);

  if (!providerName || !sender) {
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

  if (env.APP_RUNTIME_MODE === "local-demo" && !env.EMAIL_REAL_ENABLED) {
    return {
      canSend: false,
      name: "mock",
      send: queueMockEmail
    };
  }

  if (providerName !== "resend") {
    return blockedProvider("none", "Provider de e-mail nao aprovado para esta etapa.", "unsupported_provider");
  }

  if (!env.EMAIL_REAL_ENABLED) {
    return blockedProvider("resend", "E-mail real desligado por kill switch.", "email_real_disabled");
  }

  if (!env.RESEND_API_KEY?.trim()) {
    return blockedProvider("resend", "Resend sem API key server-side configurada.", "missing_resend_api_key");
  }

  if (!env.EMAIL_DOMAIN_VERIFIED) {
    return blockedProvider("resend", "Dominio de e-mail ainda nao verificado para envio real.", "domain_not_verified");
  }

  if (!hasApprovedSenderDomain(sender)) {
    return blockedProvider("resend", "Remetente transacional ainda nao usa dominio notify aprovado.", "sender_not_approved");
  }

  return createResendEmailProvider({
    apiKey: env.RESEND_API_KEY,
    from: sender
  });
}
