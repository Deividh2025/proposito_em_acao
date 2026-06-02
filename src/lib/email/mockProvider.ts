import type { EmailSendResult, SafeEmailMessage } from "./provider";

export async function queueMockEmail(message: SafeEmailMessage): Promise<EmailSendResult> {
  void message;

  return {
    message: "Fallback seguro: template validado e mantido em fila local/dev sem envio real.",
    provider: "mock",
    status: "pending_provider_config"
  };
}
