import "server-only";

import { z } from "zod";

import type { EmailProvider, EmailSendResult, SafeEmailMessage } from "./provider";
import { sanitizeEmailErrorCategory } from "./redaction";

const RESEND_EMAIL_API_URL = "https://api.resend.com/emails";
const RESEND_REQUEST_TIMEOUT_MS = 10_000;

const resendSendResponseSchema = z
  .object({
    id: z.string().trim().min(1).optional()
  })
  .passthrough();

export type ResendEmailProviderConfig = {
  apiKey: string;
  from: string;
};

function emailTagValue(value: string | undefined) {
  return (value ?? "not_set").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 128);
}

function failedResult(message: string, blockedReason: string): EmailSendResult {
  return {
    blockedReason,
    message,
    provider: "resend",
    status: "failed"
  };
}

export function createResendEmailProvider(config: ResendEmailProviderConfig): EmailProvider {
  return {
    canSend: true,
    name: "resend",
    async send(message: SafeEmailMessage): Promise<EmailSendResult> {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), RESEND_REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(RESEND_EMAIL_API_URL, {
          body: JSON.stringify({
            from: config.from,
            subject: message.subject,
            text: message.body,
            to: [message.to],
            tags: [
              { name: "template_key", value: emailTagValue(message.metadata.templateKey) },
              { name: "template_version", value: emailTagValue(message.metadata.templateVersion) },
              { name: "notification_id", value: emailTagValue(message.metadata.notificationId) }
            ]
          }),
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "proposito-em-acao/0.1"
          },
          method: "POST",
          signal: controller.signal
        });

        if (!response.ok) {
          return failedResult(
            "Resend recusou a requisicao. A notificacao nao foi marcada como enviada.",
            sanitizeEmailErrorCategory(response.status)
          );
        }

        const parsed = resendSendResponseSchema.safeParse(await response.json().catch(() => ({})));

        return {
          message: "E-mail aceito pelo Resend para processamento.",
          provider: "resend",
          providerMessageId: parsed.success ? parsed.data.id : undefined,
          status: "queued"
        };
      } catch (error) {
        const aborted = error instanceof DOMException && error.name === "AbortError";

        return failedResult(
          aborted
            ? "Tempo de envio por e-mail excedido. A notificacao nao foi marcada como enviada."
            : "Falha tecnica no envio por e-mail. A notificacao nao foi marcada como enviada.",
          aborted ? "provider_timeout" : "provider_network_error"
        );
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}
