import { beforeEach, describe, expect, test, vi } from "vitest";

type SupabaseChain = {
  data: unknown;
  error: unknown;
  eq: ReturnType<typeof vi.fn>;
  in: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
};

type SupabaseMock = {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
  };
  from: ReturnType<typeof vi.fn>;
};

const createSupabaseServerClientMock = vi.hoisted(() => vi.fn());

let supabaseMock: SupabaseMock;
let chains: Record<string, SupabaseChain>;

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock
}));

vi.mock("server-only", () => ({}));

function setRuntime(mode: "local-demo" | "preview" | "beta" | "production") {
  vi.stubEnv("APP_RUNTIME_MODE", mode);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
}

function createChain(data: unknown, error: unknown = null): SupabaseChain {
  const chain = {
    data,
    error,
    eq: vi.fn(() => chain),
    in: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    maybeSingle: vi.fn(async () => ({ data, error })),
    order: vi.fn(() => chain),
    select: vi.fn(() => chain)
  };

  return chain;
}

function setupSupabase(tables: Record<string, unknown>) {
  chains = Object.fromEntries(
    Object.entries(tables).map(([table, data]) => [table, createChain(data)])
  );

  supabaseMock = {
    auth: {
      getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } }))
    },
    from: vi.fn((table: string) => chains[table] ?? createChain([]))
  };

  createSupabaseServerClientMock.mockResolvedValue(supabaseMock);
}

describe("authenticated execution queries", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    setRuntime("preview");
    setupSupabase({
      goals: [],
      microtasks: [],
      projects: [],
      tasks: []
    });
  });

  test("does not return sample execution data in preview when there is no authenticated user", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });

    const { loadExecutionOverview } = await import("@/lib/supabase/queries/execution");
    const result = await loadExecutionOverview();

    expect(result.mode).toBe("auth-required");
    expect(result.isSample).toBe(false);
    expect(result.goals).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.tasks).toEqual([]);
  });

  test("allows labelled sample execution data only in local-demo without Supabase config", async () => {
    vi.stubEnv("APP_RUNTIME_MODE", "local-demo");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    createSupabaseServerClientMock.mockRejectedValue(new Error("Supabase config missing"));

    const { loadExecutionOverview } = await import("@/lib/supabase/queries/execution");
    const result = await loadExecutionOverview();

    expect(result.mode).toBe("local-demo");
    expect(result.isSample).toBe(true);
    expect(result.goals[0]?.isSample).toBe(true);
    expect(result.goals[0]?.title).toContain("organizar minha vida financeira");
  });

  test("loads owner-scoped Supabase rows and maps snake_case fields for the UI", async () => {
    setupSupabase({
      goals: [
        {
          id: "goal-1",
          title: "Alvo real",
          status: "active",
          specific: "Organizar finanças sem sacrificar descanso.",
          measurable: "Revisar gastos semanalmente.",
          achievable: "Começar por 15 minutos.",
          relevant: "Mordomia familiar.",
          time_bound: "2026-07-01",
          ecological_analysis: {
            adjustments: ["Manter limite de tempo."],
            is_ecologically_safe: true,
            protected_areas: ["familia", "descanso"],
            risks: []
          },
          progress_percent: 35,
          next_action: "Abrir extrato",
          created_at: "2026-06-01T12:00:00.000Z"
        }
      ],
      microtasks: [],
      projects: [],
      tasks: [
        {
          id: "task-1",
          title: "Separar contas",
          status: "pending",
          reason: "Reduzir ansiedade financeira.",
          energy_level: "low",
          estimated_minutes: 15,
          next_action: "Abrir pasta de contas",
          priority: "medium",
          task_type: "project_task",
          created_at: "2026-06-02T12:00:00.000Z"
        }
      ]
    });

    const { loadExecutionOverview } = await import("@/lib/supabase/queries/execution");
    const result = await loadExecutionOverview();

    expect(result.mode).toBe("supabase");
    expect(result.isSample).toBe(false);
    expect(chains.goals.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(chains.tasks.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(result.goals[0]).toMatchObject({
      firstAction: "Abrir extrato",
      progressPercent: 35,
      protectedAreas: ["familia", "descanso"],
      timebound: "2026-07-01",
      title: "Alvo real"
    });
    expect(result.tasks[0]).toMatchObject({
      energyLevel: "low",
      estimatedMinutes: 15,
      nextAction: "Abrir pasta de contas",
      taskType: "project_task"
    });
  });
});
