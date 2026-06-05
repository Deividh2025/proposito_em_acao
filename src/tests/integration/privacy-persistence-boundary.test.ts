import { beforeEach, describe, expect, test, vi } from "vitest";

const authGetUserMock = vi.fn();
const authFromMock = vi.fn();
const adminFromMock = vi.fn();

vi.mock("server-only", () => ({}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: {
      getUser: authGetUserMock
    },
    from: authFromMock
  }))
}));

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: adminFromMock
  }))
}));

function maybeSingleQuery(data: unknown) {
  const chain = {
    eq: vi.fn(() => chain),
    maybeSingle: vi.fn(async () => ({ data, error: null })),
    select: vi.fn(() => chain)
  };

  return chain;
}

function consentQuery() {
  const chain = {
    eq: vi.fn(async () => ({
      data: [
        {
          accepted_at: "2026-06-05T12:00:00.000Z",
          consent_type: "product_analytics",
          revoked_at: null,
          version: "product_analytics_v1"
        },
        {
          accepted_at: "2026-06-05T12:00:00.000Z",
          consent_type: "beta_feedback",
          revoked_at: null,
          version: "beta_feedback_v1"
        }
      ],
      error: null
    })),
    select: vi.fn(() => chain)
  };

  return chain;
}

function adminInsertQuery() {
  return {
    insert: vi.fn(async () => ({ error: null }))
  };
}

describe("privacy persistence boundary", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();

    vi.stubEnv("APP_RUNTIME_MODE", "preview");
    vi.stubEnv("ANALYTICS_REAL_ENABLED", "true");
    vi.stubEnv("FEEDBACK_REAL_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");

    authGetUserMock.mockResolvedValue({
      data: {
        user: {
          email: "user@example.test",
          id: "user-1"
        }
      },
      error: null
    });

    authFromMock.mockImplementation((table: string) => {
      if (table === "profiles") {
        return maybeSingleQuery({
          ai_tone: "structured",
          christian_layer_intensity: "balanced",
          email: "user@example.test"
        });
      }

      if (table === "user_preferences") {
        return maybeSingleQuery({
          ai_provider_preference: "automatic",
          analytics_opt_in: true,
          low_energy_mode: false
        });
      }

      if (table === "consent_records") {
        return consentQuery();
      }

      throw new Error(`Unexpected authenticated insert/read table: ${table}`);
    });
  });

  test("persists analytics through the server-only admin client after minimization", async () => {
    const insert = vi.fn(async () => ({ error: null }));
    adminFromMock.mockReturnValue({ insert });
    const { persistProductAnalyticsEvent } = await import("@/lib/supabase/queries/privacy-settings");

    const result = await persistProductAnalyticsEvent({
      metadata: {
        module: "dashboard",
        source: "server_action",
        step: "navigation"
      },
      name: "module_navigation"
    });

    expect(result.ok).toBe(true);
    expect(authFromMock).not.toHaveBeenCalledWith("product_analytics_events");
    expect(adminFromMock).toHaveBeenCalledWith("product_analytics_events");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        event_name: "module_navigation",
        metadata: expect.objectContaining({
          module: "dashboard",
          source: "server_action",
          step: "navigation"
        }),
        user_id: "user-1"
      })
    );
  });

  test("persists beta feedback through the server-only admin client after sensitive-hint screening", async () => {
    const insert = adminInsertQuery().insert;
    adminFromMock.mockReturnValue({ insert });
    const { persistBetaFeedback } = await import("@/lib/supabase/queries/privacy-settings");

    const result = await persistBetaFeedback(
      {
        blocked: "Nada bloqueou o teste agora.",
        clarityScore: 5,
        comment: "Fluxo claro para validar beta.",
        confused: "Pouca coisa ficou confusa.",
        frictionScore: 1,
        module: "dashboard",
        usefulnessScore: 5,
        worked: "A pagina abriu e salvou o feedback."
      },
      true
    );

    expect(result.ok).toBe(true);
    expect(authFromMock).not.toHaveBeenCalledWith("beta_feedback_items");
    expect(adminFromMock).toHaveBeenCalledWith("beta_feedback_items");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        has_sensitive_hint: false,
        module: "dashboard",
        status: "submitted",
        user_id: "user-1"
      })
    );
  });
});
