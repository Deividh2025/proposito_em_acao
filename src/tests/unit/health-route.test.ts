import { describe, expect, test, vi } from "vitest";

import { GET } from "@/app/api/health/route";

describe("health route", () => {
  test("returns sanitized liveness metadata without requiring real providers", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_NAME", "Prop\u00f3sito em A\u00e7\u00e3o");
    vi.stubEnv("APP_RUNTIME_MODE", "local-demo");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "supabase-secret-value");
    vi.stubEnv("OPENAI_API_KEY", "fake-openai-secret-value");

    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/application\/json/);

    const body = await response.json();
    expect(body).toMatchObject({
      ok: true,
      app: "Prop\u00f3sito em A\u00e7\u00e3o",
      runtime: "local-demo",
      environment: "sanitized"
    });
    expect(body.timestamp).toEqual(expect.any(String));
    expect(Date.parse(body.timestamp)).not.toBeNaN();
    expect(body.version).toEqual(expect.any(String));

    const serialized = JSON.stringify(body);
    expect(serialized).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(serialized).not.toContain("OPENAI_API_KEY");
    expect(serialized).not.toContain("supabase-secret-value");
    expect(serialized).not.toContain("fake-openai-secret-value");
  });

  test("sanitizes invalid runtime values instead of echoing raw environment input", async () => {
    vi.stubEnv("APP_RUNTIME_MODE", "token-like-runtime");

    const response = GET();
    const body = await response.json();

    expect(body.runtime).toBe("local-demo");
    expect(JSON.stringify(body)).not.toContain("token-like-runtime");
  });
});
