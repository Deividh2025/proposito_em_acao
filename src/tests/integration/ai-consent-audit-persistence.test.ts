import { beforeEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";

const authGetUserMock = vi.fn();
const serverFromMock = vi.fn();
const adminFromMock = vi.fn();

vi.mock("server-only", () => ({}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: {
      getUser: authGetUserMock
    },
    from: serverFromMock
  }))
}));

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => ({
    from: adminFromMock
  }))
}));

const tinyOutputSchema = z
  .object({
    message: z.string().min(1),
    user_review_required: z.literal(true)
  })
  .strict();

const safeOutput = {
  message: "Criar uma microacao revisavel sem enviar dados sensiveis.",
  user_review_required: true
};

function query(data: unknown) {
  const chain = {
    eq: vi.fn(() => chain),
    in: vi.fn(async () => ({ data, error: null })),
    maybeSingle: vi.fn(async () => ({ data, error: null })),
    select: vi.fn(() => chain)
  };

  return chain;
}

describe("persistent AI consent and audit boundary", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();

    vi.stubEnv("APP_RUNTIME_MODE", "preview");
    vi.stubEnv("AI_REAL_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");

    authGetUserMock.mockResolvedValue({
      data: {
        user: {
          id: "user-1"
        }
      },
      error: null
    });

    serverFromMock.mockImplementation((table: string) => {
      if (table === "user_preferences") {
        return query({
          ai_provider_preference: "openai"
        });
      }

      if (table === "consent_records") {
        return query([
          {
            accepted_at: "2026-06-05T12:00:00.000Z",
            consent_type: "ai_provider_deepseek",
            revoked_at: null,
            version: "ai_provider_deepseek_v1"
          }
        ]);
      }

      throw new Error(`Unexpected server table: ${table}`);
    });
  });

  test(
    "uses persisted provider consent and writes minimal AI audit through admin",
    async () => {
      const insert = vi.fn(async () => ({ error: null }));
      adminFromMock.mockReturnValue({ insert });
      const provider = {
        name: "deepseek" as const,
        invoke: vi.fn().mockResolvedValue(safeOutput)
      };
      const { invokeAiWithPersistentConsentAndAudit } = await import("@/lib/ai");

      const result = await invokeAiWithPersistentConsentAndAudit({
        agentKey: "smartGoal",
        fallback: safeOutput,
        input: {
          desire: "organizar a semana",
          raw_prompt: "nao deve chegar ao provider"
        },
        models: {
          deepseekFlash: "deepseek-chat",
          deepseekPro: "deepseek-reasoner"
        },
        providers: {
          deepseek: provider
        },
        promptVersion: "smart_goal_prompt_v1",
        schema: tinyOutputSchema,
        schemaName: "tiny_output_v1"
      });

      expect(result.source).toBe("provider");
      expect(result.audit.consent_version).toBe("ai_provider_deepseek_v1");
      expect(provider.invoke).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            desire: "organizar a semana"
          }
        })
      );
      expect(adminFromMock).toHaveBeenCalledWith("ai_run_audits");
      expect(insert).toHaveBeenCalledWith(
        expect.objectContaining({
          agent_name: "smartGoal",
          schema_name: "tiny_output_v1",
          schema_version: "ai_run_audit_v1",
          status: "success",
          user_id: "user-1",
          metadata_minimal: expect.objectContaining({
            consent_version: "ai_provider_deepseek_v1",
            contains_raw_prompt: false,
            contains_raw_response: false,
            invocation_mode: "real",
            provider: "deepseek"
          })
        })
      );
    },
    15_000
  );

  test("blocks real provider before external call when session is missing", async () => {
    authGetUserMock.mockResolvedValue({ data: { user: null }, error: null });
    const provider = {
      name: "deepseek" as const,
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };
    const { invokeAiWithPersistentConsentAndAudit } = await import("@/lib/ai");

    const result = await invokeAiWithPersistentConsentAndAudit({
      agentKey: "smartGoal",
      fallback: safeOutput,
      input: { desire: "organizar a semana" },
      providers: {
        deepseek: provider
      },
      promptVersion: "smart_goal_prompt_v1",
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1"
    });

    expect(provider.invoke).not.toHaveBeenCalled();
    expect(result.source).toBe("fallback");
    expect(result.audit.error_category).toBe("missing_provider_consent");
  });
});
