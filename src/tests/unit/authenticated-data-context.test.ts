import { beforeEach, describe, expect, test, vi } from "vitest";

import type { AppRuntimeMode } from "@/lib/config";
import {
  AUTH_REQUIRED_DATA_MESSAGE,
  CONFIG_REQUIRED_DATA_MESSAGE,
  LOCAL_DEMO_DATA_MESSAGE,
  getAuthenticatedDataContext,
  resolveAuthenticatedDataMode
} from "@/lib/supabase/queries/authenticated-data";

type SupabaseMock = {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
  };
};

let supabaseMock: SupabaseMock;

vi.mock("server-only", () => ({}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => supabaseMock)
}));

function setRuntime(mode: AppRuntimeMode, configured = true) {
  vi.stubEnv("APP_RUNTIME_MODE", mode);

  if (configured) {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    return;
  }

  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
}

describe("authenticated data context", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    supabaseMock = {
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } }, error: null }))
      }
    };
  });

  test("allows sample data only in local-demo decisions", () => {
    expect(
      resolveAuthenticatedDataMode({
        hasSupabaseConfig: false,
        hasUser: false,
        runtimeMode: "local-demo"
      })
    ).toEqual({
      canUseSampleData: true,
      kind: "local-demo",
      reason: "local-demo"
    });

    for (const runtimeMode of ["preview", "beta", "production"] satisfies AppRuntimeMode[]) {
      expect(
        resolveAuthenticatedDataMode({
          hasSupabaseConfig: true,
          hasUser: false,
          runtimeMode
        })
      ).toEqual({
        canUseSampleData: false,
        kind: "blocked",
        reason: "auth-required"
      });
    }
  });

  test("returns local-demo context only when the runtime is explicitly local-demo", async () => {
    setRuntime("local-demo", false);

    await expect(getAuthenticatedDataContext()).resolves.toEqual({
      canUseSampleData: true,
      kind: "local-demo",
      message: LOCAL_DEMO_DATA_MESSAGE,
      runtimeMode: "local-demo",
      supabase: null,
      user: null
    });
  });

  test("blocks sample data when authenticated data config is missing outside local-demo", async () => {
    setRuntime("preview", false);

    await expect(getAuthenticatedDataContext()).resolves.toEqual({
      canUseSampleData: false,
      kind: "blocked",
      reason: "config-missing",
      runtimeMode: "preview",
      userMessage: CONFIG_REQUIRED_DATA_MESSAGE
    });
  });

  test("blocks sample data when Supabase is configured but the user is absent", async () => {
    setRuntime("beta");
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

    await expect(getAuthenticatedDataContext()).resolves.toEqual({
      canUseSampleData: false,
      kind: "blocked",
      reason: "auth-required",
      runtimeMode: "beta",
      userMessage: AUTH_REQUIRED_DATA_MESSAGE
    });
  });

  test("fails closed instead of falling back to sample data on Supabase service errors", async () => {
    setRuntime("production");
    supabaseMock.auth.getUser.mockRejectedValue(new Error("network timeout loading auth user"));

    await expect(getAuthenticatedDataContext()).resolves.toMatchObject({
      canUseSampleData: false,
      kind: "blocked",
      reason: "service-error",
      runtimeMode: "production"
    });
  });

  test("returns authenticated context with sample data disabled when a real user exists", async () => {
    setRuntime("preview");
    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { email: "owner@example.com", id: "user-1" } },
      error: null
    });

    await expect(getAuthenticatedDataContext()).resolves.toMatchObject({
      canUseSampleData: false,
      kind: "authenticated",
      runtimeMode: "preview",
      user: { id: "user-1" }
    });
  });
});
