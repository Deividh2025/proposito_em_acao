import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));

function setBaseEnv() {
  vi.stubEnv("APP_RUNTIME_MODE", "preview");
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.test");
  vi.stubEnv("EMAIL_PROVIDER", "resend");
  vi.stubEnv("EMAIL_FROM_NOTIFICATIONS", "notificacoes@notify.example.org");
  vi.stubEnv("EMAIL_DOMAIN_VERIFIED", "true");
}

const message = {
  body: "Aviso transacional neutro.",
  metadata: {
    goalId: "00000000-0000-4000-8000-000000000001",
    grantId: "00000000-0000-4000-8000-000000000002",
    notificationId: "00000000-0000-4000-8000-000000000003",
    templateKey: "accountability_invite",
    templateVersion: "accountability_email_v1"
  },
  subject: "Convite de acompanhamento",
  to: "atalia@example.com"
};

describe("email provider", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    setBaseEnv();
  });

  test("returns pending provider config when provider or sender is missing", async () => {
    vi.stubEnv("EMAIL_PROVIDER", "");
    vi.stubEnv("EMAIL_FROM_NOTIFICATIONS", "");
    const { createEmailProvider } = await import("@/lib/email/provider");

    const result = await createEmailProvider().send(message);

    expect(result.status).toBe("pending_provider_config");
    expect(result.provider).toBe("none");
  });

  test("uses local mock without real send in local-demo", async () => {
    vi.stubEnv("APP_RUNTIME_MODE", "local-demo");
    vi.stubEnv("EMAIL_REAL_ENABLED", "false");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { createEmailProvider } = await import("@/lib/email/provider");

    const result = await createEmailProvider().send(message);

    expect(result.provider).toBe("mock");
    expect(result.status).toBe("pending_provider_config");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("blocks Resend when EMAIL_REAL_ENABLED is false", async () => {
    vi.stubEnv("EMAIL_REAL_ENABLED", "false");
    vi.stubEnv("RESEND_API_KEY", "re_placeholder");
    const { createEmailProvider } = await import("@/lib/email/provider");

    const result = await createEmailProvider().send(message);

    expect(result.status).toBe("blocked");
    expect(result.blockedReason).toBe("email_real_disabled");
  });

  test("blocks Resend without API key", async () => {
    vi.stubEnv("EMAIL_REAL_ENABLED", "true");
    vi.stubEnv("RESEND_API_KEY", "");
    const { createEmailProvider } = await import("@/lib/email/provider");

    const result = await createEmailProvider().send(message);

    expect(result.status).toBe("blocked");
    expect(result.blockedReason).toBe("missing_resend_api_key");
  });

  test("blocks example sender even when the kill switch is enabled", async () => {
    vi.stubEnv("EMAIL_REAL_ENABLED", "true");
    vi.stubEnv("RESEND_API_KEY", "re_placeholder");
    vi.stubEnv("EMAIL_FROM_NOTIFICATIONS", "notificacoes@notify.example.com");
    const { createEmailProvider } = await import("@/lib/email/provider");

    const result = await createEmailProvider().send(message);

    expect(result.status).toBe("blocked");
    expect(result.blockedReason).toBe("sender_not_approved");
  });

  test("queues a Resend API request without putting the API key in the body", async () => {
    vi.stubEnv("EMAIL_REAL_ENABLED", "true");
    vi.stubEnv("RESEND_API_KEY", "re_placeholder");
    const fetchMock = vi.fn(async () => ({
      json: async () => ({ id: "email_123" }),
      ok: true,
      status: 200
    }));
    vi.stubGlobal("fetch", fetchMock);
    const { createEmailProvider } = await import("@/lib/email/provider");

    const result = await createEmailProvider().send(message);
    const calls = fetchMock.mock.calls as unknown as Array<
      [
        string,
        {
          body: string;
          headers: Record<string, string>;
        }
      ]
    >;
    const request = calls[0]?.[1];

    if (!request) {
      throw new Error("Expected Resend fetch request.");
    }

    expect(result.status).toBe("queued");
    expect(result.providerMessageId).toBe("email_123");
    expect(request.headers.Authorization).toBe("Bearer re_placeholder");
    expect(request.headers["User-Agent"]).toContain("proposito-em-acao");
    expect(request.body).not.toContain("re_placeholder");
    expect(request.body).not.toContain(message.metadata.grantId);
  });
});
