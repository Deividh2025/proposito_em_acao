import { describe, expect, test } from "vitest";

import type { AccountabilityNotificationEvent } from "@/domain/notifications";
import { redactEmailOperationalText } from "@/lib/email/redaction";
import { buildAccountabilityEmailTemplate } from "@/lib/email/templates/accountability";

const events: AccountabilityNotificationEvent[] = [
  "invite",
  "invite_accepted",
  "grant_revoked",
  "commitment_document_shared",
  "milestone_completed",
  "delay_alert",
  "help_request",
  "goal_completed",
  "abandonment_risk",
  "important_status_authorized"
];

const prohibitedTerms = [
  "metacognicao",
  "chamado",
  "financas",
  "familia",
  "saude",
  "emocoes",
  "calendario",
  "tarefa",
  "prompt bruto",
  "resposta bruta"
];

describe("accountability email templates", () => {
  test.each(events)("keeps %s transactional and neutral", (event) => {
    const template = buildAccountabilityEmailTemplate({
      event,
      safeSummary: "familia financas saude metacognicao tarefa calendario",
      secureLink: "https://app.example.test/accountability/partner/token-super-secreto-1234567890",
      userName: "Usuario"
    });
    const content = `${template.subject}\n${template.body}`.toLowerCase();

    expect(template.subject.length).toBeGreaterThan(5);
    expect(template.body).toContain("Dados sensiveis nao sao enviados por e-mail");
    for (const term of prohibitedTerms) {
      expect(content).not.toContain(term);
    }
  });

  test("redacts invite tokens and provider secrets from operational text", () => {
    const text =
      "https://app.example.test/accountability/partner/token-super-secreto-1234567890?next=/dashboard re_secret whsec_secret";

    const redacted = redactEmailOperationalText(text);

    expect(redacted).not.toContain("token-super-secreto");
    expect(redacted).not.toContain("re_secret");
    expect(redacted).not.toContain("whsec_secret");
    expect(redacted).toContain("/accountability/partner/[redacted]");
  });
});
