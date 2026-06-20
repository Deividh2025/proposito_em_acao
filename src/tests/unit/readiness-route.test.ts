import { describe, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getReadinessAppUrlStatus, isReadinessAppUrlConfigured } from "@/app/api/ready/readiness";
import { GET } from "@/app/api/ready/route";

describe("readiness app URL checks", () => {
  test("allows local-demo without a published HTTPS app URL", () => {
    const status = getReadinessAppUrlStatus("local-demo", "http://localhost:3000");

    expect(status).toBe("local-demo");
    expect(isReadinessAppUrlConfigured(status)).toBe(true);
  });

  test("fails closed in preview without a published HTTPS app URL", () => {
    const status = getReadinessAppUrlStatus("preview", "http://localhost:3000");

    expect(status).toBe("missing-published-https-url");
    expect(isReadinessAppUrlConfigured(status)).toBe(false);
  });

  test("passes in preview with a published HTTPS app URL", () => {
    const status = getReadinessAppUrlStatus("preview", "https://preview.example.com");

    expect(status).toBe("configured");
    expect(isReadinessAppUrlConfigured(status)).toBe(true);
  });
});

describe("readiness GET handler", () => {
  test("returns 200 in local-demo when essential config is present", async () => {
    vi.stubEnv("APP_RUNTIME_MODE", "local-demo");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fake-anon");

    const response = GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      ok: true,
      checks: {
        appUrl: "local-demo",
        supabase: "configured",
        integrationKeys: "configured"
      }
    });
  });

  test("fails with 503 if AI_REAL_ENABLED is true but DEEPSEEK_API_KEY is missing", async () => {
    vi.stubEnv("APP_RUNTIME_MODE", "local-demo");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fake-anon");
    vi.stubEnv("AI_REAL_ENABLED", "true");
    vi.stubEnv("DEEPSEEK_API_KEY", "");

    const response = GET();
    expect(response.status).toBe(503);

    const body = await response.json();
    expect(body).toMatchObject({
      ok: false,
      checks: {
        integrationKeys: "missing: DEEPSEEK_API_KEY"
      },
      missing: ["DEEPSEEK_API_KEY"]
    });
  });

  test("fails with 503 if EMAIL_REAL_ENABLED is true but RESEND_API_KEY is missing", async () => {
    vi.stubEnv("APP_RUNTIME_MODE", "local-demo");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fake-anon");
    vi.stubEnv("EMAIL_REAL_ENABLED", "true");
    vi.stubEnv("RESEND_API_KEY", "");

    const response = GET();
    expect(response.status).toBe(503);

    const body = await response.json();
    expect(body).toMatchObject({
      ok: false,
      checks: {
        integrationKeys: "missing: RESEND_API_KEY"
      },
      missing: ["RESEND_API_KEY"]
    });
  });
});

