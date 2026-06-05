import { beforeEach, describe, expect, test, vi } from "vitest";

type SupabaseMock = {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
    resetPasswordForEmail: ReturnType<typeof vi.fn>;
    signInWithPassword: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
    signUp: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
  };
  from: ReturnType<typeof vi.fn>;
};

class RedirectSignal extends Error {
  constructor(readonly location: string) {
    super(`Redirected to ${location}`);
  }
}

let supabaseMock: SupabaseMock;

vi.mock("next/navigation", () => ({
  redirect: vi.fn((location: string) => {
    throw new RedirectSignal(location);
  })
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => supabaseMock)
}));

function authForm(overrides: Record<string, string> = {}) {
  const form = new FormData();
  form.set("mode", overrides.mode ?? "sign-in");
  form.set("email", overrides.email ?? "user@example.com");
  form.set("password", overrides.password ?? "senha-segura");

  for (const [key, value] of Object.entries(overrides)) {
    form.set(key, value);
  }

  return form;
}

function expectRedirect(fn: () => Promise<unknown>, location: string) {
  return expect(fn()).rejects.toMatchObject({ location });
}

function setSupabasePublicEnv(configured: boolean) {
  if (configured) {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.example.test");
    return;
  }

  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://127.0.0.1:3000");
}

function queryMock(result: unknown) {
  const chain = {
    eq: vi.fn(() => chain),
    select: vi.fn(() => chain),
    single: vi.fn(async () => result),
    update: vi.fn(() => chain)
  };

  return chain;
}

describe("Auth SSR action contracts", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    setSupabasePublicEnv(true);
    supabaseMock = {
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } })),
        resetPasswordForEmail: vi.fn(async () => ({ error: null })),
        signInWithPassword: vi.fn(async () => ({ error: null })),
        signOut: vi.fn(async () => ({ error: null })),
        signUp: vi.fn(async () => ({ error: null })),
        updateUser: vi.fn(async () => ({ error: null }))
      },
      from: vi.fn()
    };
  });

  test("rejects invalid auth input with a neutral redirect and no provider details", async () => {
    const { submitAuthAction } = await import("@/app/auth/actions");

    await expectRedirect(
      () => submitAuthAction(authForm({ email: "invalid", password: "123" })),
      "/auth?status=invalid"
    );
    expect(supabaseMock.auth.signInWithPassword).not.toHaveBeenCalled();
    expect(supabaseMock.auth.signUp).not.toHaveBeenCalled();
  });

  test("preserves local-demo behavior when Supabase public env is absent", async () => {
    setSupabasePublicEnv(false);
    const { submitAuthAction } = await import("@/app/auth/actions");

    await expectRedirect(() => submitAuthAction(authForm()), "/auth?status=local");
    expect(supabaseMock.auth.signInWithPassword).not.toHaveBeenCalled();
    expect(supabaseMock.auth.signUp).not.toHaveBeenCalled();
  });

  test("uses the sanitized dashboard fallback after successful login with an untrusted next target", async () => {
    const { submitAuthAction } = await import("@/app/auth/actions");

    await expectRedirect(
      () => submitAuthAction(authForm({ next: "https://evil.example/phish" })),
      "/dashboard"
    );
    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "senha-segura"
    });
  });

  test("allows only same-origin next paths after successful login", async () => {
    const { submitAuthAction } = await import("@/app/auth/actions");

    await expectRedirect(() => submitAuthAction(authForm({ next: "/tasks?filter=today" })), "/tasks?filter=today");
  });

  test("sign-up sends only the configured app redirect and returns a neutral confirmation status", async () => {
    const { submitAuthAction } = await import("@/app/auth/actions");

    await expectRedirect(
      () => submitAuthAction(authForm({ mode: "sign-up" })),
      "/auth?status=signup-sent"
    );
    expect(supabaseMock.auth.signUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "senha-segura",
      options: {
        emailRedirectTo: "https://app.example.test/auth/confirm"
      }
    });
  });

  test("forgot password stays neutral for invalid emails without calling the provider", async () => {
    const { requestPasswordResetAction } = await import("@/app/auth/actions");

    await expectRedirect(
      () => requestPasswordResetAction(authForm({ email: "not-an-email" })),
      "/auth/forgot-password?status=sent"
    );
    expect(supabaseMock.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  test("forgot password returns the same sent status for valid emails", async () => {
    const { requestPasswordResetAction } = await import("@/app/auth/actions");

    await expectRedirect(
      () => requestPasswordResetAction(authForm({ email: "user@example.com" })),
      "/auth/forgot-password?status=sent"
    );
    expect(supabaseMock.auth.resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: "https://app.example.test/auth/update-password"
    });
  });

  test("password update requires an active Supabase session", async () => {
    supabaseMock.auth.updateUser.mockResolvedValue({ error: { message: "Auth session missing" } });
    const { updatePasswordAction } = await import("@/app/auth/actions");

    await expectRedirect(
      () => updatePasswordAction(authForm({ confirmPassword: "nova-senha", password: "nova-senha" })),
      "/auth/error?status=session"
    );
  });

  test("logout clears the Supabase session before redirecting to a safe status", async () => {
    const { signOutAction } = await import("@/app/auth/actions");

    await expectRedirect(() => signOutAction(), "/auth?status=signed-out&next=%2Fauth");
    expect(supabaseMock.auth.signOut).toHaveBeenCalledTimes(1);
  });

  test("logout remains neutral in local-demo without calling Supabase", async () => {
    setSupabasePublicEnv(false);
    const { signOutAction } = await import("@/app/auth/actions");

    await expectRedirect(() => signOutAction(), "/auth?status=signed-out&next=%2Fauth");
    expect(supabaseMock.auth.signOut).not.toHaveBeenCalled();
  });

  test("update actions require a session outside local-demo and do not write without one", async () => {
    vi.stubEnv("APP_RUNTIME_MODE", "preview");
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    supabaseMock.from.mockReturnValue(queryMock({ data: { id: "task-1" }, error: null }));
    const { updateTaskStatus } = await import("@/app/tasks/actions");

    const result = await updateTaskStatus("task-1", "completed");

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Entre na sua conta");
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  test("onboarding save requires a session outside local-demo and does not keep a successful local draft", async () => {
    vi.stubEnv("APP_RUNTIME_MODE", "preview");
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const { buildCallingMockDraft } = await import("@/ai/schemas/calling");
    const { saveOnboarding } = await import("@/app/onboarding/actions");

    const result = await saveOnboarding({
      acceptedCallingDraft: true,
      callingAnswers: {
        core_values: "Servico e fidelidade",
        gifts: "Organizacao",
        people_to_serve: "Familia",
        recurring_burdens: "Falta de direcao"
      },
      callingDraft: buildCallingMockDraft({
        answers: {
          core_values: "Servico e fidelidade",
          gifts: "Organizacao",
          people_to_serve: "Familia",
          world_burden: "Falta de direcao"
        }
      }),
      lifeMap: [],
      profile: {
        aiSupportTone: "balanced",
        christianLayerPreference: "balanced",
        currentRoutine: "Rotina de trabalho e familia com blocos de foco irregulares.",
        disorderAreas: "Agenda e acompanhamento de projetos.",
        faithRelationship: "Deseja manter reflexao discreta e opcional.",
        familyContext: "Contexto familiar estavel para teste.",
        focusRelationship: "Perde foco quando ha muitas prioridades simultaneas.",
        habitualEnergy: "medium",
        mainDifficulty: "Transformar direcao em proximas acoes.",
        mainResponsibilities: "Trabalho, familia e projetos pessoais.",
        name: "Usuario Teste",
        occupation: "Analista",
        platformExpectation: "Organizar alvos, tarefas e revisoes."
      }
    });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Entre na sua conta");
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });
});
