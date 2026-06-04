import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

const getClaimsMock = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getClaims: getClaimsMock
    }
  }))
}));

vi.mock("server-only", () => ({}));

function requestFor(path: string) {
  return new NextRequest(`https://app.example.test${path}`);
}

function setRuntime(mode: "local-demo" | "preview" | "beta" | "production", configured: boolean) {
  vi.stubEnv("APP_RUNTIME_MODE", mode);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", configured ? "https://example.supabase.co" : "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", configured ? "anon-key" : "");
}

describe("Auth SSR proxy contracts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  test("preserves local-demo routes when Supabase is not configured", async () => {
    setRuntime("local-demo", false);
    const { refreshSupabaseAuth } = await import("@/lib/supabase/proxy");

    const response = await refreshSupabaseAuth(requestFor("/dashboard"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(getClaimsMock).not.toHaveBeenCalled();
  });

  test("fails closed when Auth config is missing outside local-demo", async () => {
    setRuntime("preview", false);
    const { refreshSupabaseAuth } = await import("@/lib/supabase/proxy");

    const response = await refreshSupabaseAuth(requestFor("/dashboard"));

    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(getClaimsMock).not.toHaveBeenCalled();
  });

  test("redirects protected routes to Auth when claims are absent", async () => {
    setRuntime("preview", true);
    getClaimsMock.mockResolvedValue({ data: { claims: null }, error: null });
    const { refreshSupabaseAuth } = await import("@/lib/supabase/proxy");

    const response = await refreshSupabaseAuth(requestFor("/dashboard"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://app.example.test/auth?next=%2Fdashboard");
  });

  test("allows public Auth routes without redirect when claims are absent", async () => {
    setRuntime("preview", true);
    getClaimsMock.mockResolvedValue({ data: { claims: null }, error: null });
    const { refreshSupabaseAuth } = await import("@/lib/supabase/proxy");

    const response = await refreshSupabaseAuth(requestFor("/auth"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
