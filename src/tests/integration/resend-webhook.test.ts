import { createHmac } from "node:crypto";

import { beforeEach, describe, expect, test, vi } from "vitest";

type QueryResult = {
  data?: unknown;
  error?: null | { message: string };
};

let queryResult: QueryResult;
let updateMock: ReturnType<typeof vi.fn>;
let eqMock: ReturnType<typeof vi.fn>;

vi.mock("server-only", () => ({}));

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: vi.fn(() => {
      const chain = {
        eq: eqMock,
        maybeSingle: vi.fn(async () => queryResult),
        select: vi.fn(() => chain),
        update: updateMock
      };
      eqMock.mockReturnValue(chain);
      updateMock.mockReturnValue(chain);

      return chain;
    })
  }))
}));

function svixSecret() {
  return `whsec_${Buffer.from("resend-webhook-test-secret").toString("base64")}`;
}

function signedHeaders(payload: string, secret = svixSecret()) {
  const id = "msg_test_123";
  const timestamp = String(Math.floor(Date.now() / 1000));
  const key = Buffer.from(secret.slice("whsec_".length), "base64");
  const signature = createHmac("sha256", key).update(`${id}.${timestamp}.${payload}`).digest("base64");

  return {
    "content-type": "application/json",
    "svix-id": id,
    "svix-signature": `v1,${signature}`,
    "svix-timestamp": timestamp
  };
}

async function postWebhook(payload: unknown, headers: Record<string, string>) {
  const { POST } = await import("@/app/api/email/resend/webhook/route");

  return POST(
    new Request("https://app.example.test/api/email/resend/webhook", {
      body: JSON.stringify(payload),
      headers,
      method: "POST"
    })
  );
}

describe("Resend webhook route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("APP_RUNTIME_MODE", "preview");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.test");
    vi.stubEnv("RESEND_WEBHOOK_SECRET", svixSecret());
    queryResult = { data: { id: "notification-1" }, error: null };
    updateMock = vi.fn();
    eqMock = vi.fn();
  });

  test("rejects invalid signatures before updating notification status", async () => {
    const payload = {
      data: { email_id: "email_123", tags: [{ name: "notification_id", value: "notification-1" }] },
      type: "email.delivered"
    };
    const response = await postWebhook(payload, {
      ...signedHeaders(JSON.stringify(payload)),
      "svix-signature": "v1,invalid"
    });

    expect(response.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  test("accepts a valid delivered event and stores only redacted delivery metadata", async () => {
    const payload = {
      data: { email_id: "email_123", tags: [{ name: "notification_id", value: "notification-1" }] },
      type: "email.delivered"
    };
    const response = await postWebhook(payload, signedHeaders(JSON.stringify(payload)));

    expect(response.status).toBe(200);
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_status: "sent",
        status: "sent",
        sent_payload_redacted: expect.objectContaining({
          delivery_event: "email.delivered",
          provider: "resend",
          provider_message_id: "email_123"
        })
      })
    );
    expect(eqMock).toHaveBeenCalledWith("id", "notification-1");
    expect(JSON.stringify(updateMock.mock.calls[0]?.[0])).not.toContain("atalia@example.com");
  });

  test("records bounced events as blocked without storing raw payload", async () => {
    const payload = {
      data: { email_id: "email_456", tags: [{ name: "notification_id", value: "notification-2" }] },
      type: "email.bounced"
    };
    const response = await postWebhook(payload, signedHeaders(JSON.stringify(payload)));

    expect(response.status).toBe(200);
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        blocked_reason: "resend_bounced",
        provider_status: "blocked",
        status: "blocked"
      })
    );
  });
});
