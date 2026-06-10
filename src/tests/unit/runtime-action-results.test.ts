import { afterEach, describe, expect, test, vi } from "vitest";

import {
  getAppRuntimeMode,
  getRealIntegrationFlags,
  getRuntimeEnvironmentStatus,
  getServerEnv
} from "@/lib/config/env";
import {
  localOnlyDraftResult,
  missingSupabaseConfigResult,
  persistenceCatchResult,
  realServiceErrorResult
} from "@/domain/execution/action-results";
import { executionActionResultSchema } from "@/domain/execution/persistence";

describe("runtime environment contract", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("defaults to local-demo and keeps real integration switches disabled", () => {
    vi.stubEnv("APP_RUNTIME_MODE", undefined);
    vi.stubEnv("AI_REAL_ENABLED", undefined);
    vi.stubEnv("EMAIL_REAL_ENABLED", undefined);
    vi.stubEnv("ANALYTICS_REAL_ENABLED", undefined);
    vi.stubEnv("FEEDBACK_REAL_ENABLED", undefined);

    expect(getAppRuntimeMode()).toBe("local-demo");
    expect(getRealIntegrationFlags()).toEqual({
      ai: false,
      analytics: false,
      email: false,
      feedback: false
    });
  });

  test("only literal true enables real integration switches", () => {
    vi.stubEnv("AI_REAL_ENABLED", "true");
    vi.stubEnv("EMAIL_REAL_ENABLED", "false");
    vi.stubEnv("ANALYTICS_REAL_ENABLED", "1");
    vi.stubEnv("FEEDBACK_REAL_ENABLED", "");

    expect(getServerEnv()).toMatchObject({
      AI_REAL_ENABLED: true,
      ANALYTICS_REAL_ENABLED: false,
      EMAIL_REAL_ENABLED: false,
      FEEDBACK_REAL_ENABLED: false
    });
  });

  test("does not require Supabase/Auth config in local-demo readiness", () => {
    vi.stubEnv("APP_RUNTIME_MODE", "local-demo");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");

    const status = getRuntimeEnvironmentStatus();

    expect(status.auth.configured).toBe(true);
    expect(status.auth.missing).toEqual([]);
    expect(status.localDemoFallbackAllowed).toBe(true);
  });

  test("reports exact missing Auth env vars outside local-demo", () => {
    vi.stubEnv("APP_RUNTIME_MODE", "preview");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");

    const status = getRuntimeEnvironmentStatus();

    expect(status.auth.configured).toBe(false);
    expect(status.auth.missing).toEqual([
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_APP_URL"
    ]);
  });
});

describe("action result fallback contract", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("allows local-draft only for missing Supabase config in local-demo", () => {
    vi.stubEnv("APP_RUNTIME_MODE", "local-demo");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    const result = missingSupabaseConfigResult(
      executionActionResultSchema,
      "Rascunho local permitido."
    );

    expect(result).toEqual({
      message: "Rascunho local permitido.",
      mode: "local-draft",
      ok: true
    });
  });

  test("fails closed for missing Supabase config outside local-demo", () => {
    vi.stubEnv("APP_RUNTIME_MODE", "beta");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    const result = missingSupabaseConfigResult(
      executionActionResultSchema,
      "Rascunho local permitido."
    );

    expect(result.ok).toBe(false);
    expect(result.mode).toBe("local-draft");
  });

  test("does not convert a configured Supabase failure into local success", () => {
    vi.stubEnv("APP_RUNTIME_MODE", "local-demo");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

    const result = persistenceCatchResult(
      executionActionResultSchema,
      "Rascunho local permitido.",
      undefined,
      {},
      "Falha real sanitizada."
    );

    expect(result).toEqual({
      message: "Falha real sanitizada.",
      mode: "supabase",
      ok: false
    });
  });

  test("local-only drafts fail closed outside local-demo", () => {
    vi.stubEnv("APP_RUNTIME_MODE", "production");

    const result = localOnlyDraftResult(
      executionActionResultSchema,
      "Rascunho local permitido.",
      undefined,
      {},
      "Salve o registro antes de continuar."
    );

    expect(result).toEqual({
      message: "Salve o registro antes de continuar.",
      mode: "local-draft",
      ok: false
    });
  });

  test("real service errors stay sanitized", () => {
    const result = realServiceErrorResult(executionActionResultSchema);

    expect(result.ok).toBe(false);
    expect(result.mode).toBe("supabase");
    expect(result.message).not.toContain("duplicate key");
  });
});
