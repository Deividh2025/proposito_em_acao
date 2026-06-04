import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));

type SupabaseMock = {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
  };
  from: ReturnType<typeof vi.fn>;
};

let supabaseMock: SupabaseMock;

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => supabaseMock)
}));

function queryMock(result: unknown) {
  const chain = {
    delete: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    maybeSingle: vi.fn(async () => result),
    select: vi.fn(() => chain),
    single: vi.fn(async () => result),
    update: vi.fn(() => chain)
  };

  return chain;
}

function setRuntime(mode: "local-demo" | "preview" | "beta" | "production") {
  vi.stubEnv("APP_RUNTIME_MODE", mode);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
}

describe("server action runtime error contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    setRuntime("local-demo");
    supabaseMock = {
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: "user-1" } } }))
      },
      from: vi.fn()
    };
  });

  test("returns ok:false when a configured Supabase insert fails", async () => {
    const taskInsert = queryMock({ data: null, error: { message: "duplicate key value" } });
    supabaseMock.from.mockReturnValue(taskInsert);

    const { createTask } = await import("@/app/tasks/actions");
    const result = await createTask({
      estimatedMinutes: 15,
      nextAction: "Abrir documento",
      title: "Preparar proposta"
    });

    expect(result.ok).toBe(false);
    expect(result.mode).toBe("supabase");
    expect(result.message).not.toContain("duplicate key");
  });

  test("allows missing local-demo session to remain a local draft", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });

    const { createTask } = await import("@/app/tasks/actions");
    const result = await createTask({
      estimatedMinutes: 15,
      nextAction: "Abrir documento",
      title: "Preparar proposta"
    });

    expect(result.ok).toBe(true);
    expect(result.mode).toBe("local-draft");
  });

  test("fails closed without a session outside local-demo", async () => {
    setRuntime("preview");
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });

    const { createTask } = await import("@/app/tasks/actions");
    const result = await createTask({
      estimatedMinutes: 15,
      nextAction: "Abrir documento",
      title: "Preparar proposta"
    });

    expect(result.ok).toBe(false);
    expect(result.mode).toBe("local-draft");
  });

  test("metacognition history returns an empty private state without a session outside local-demo", async () => {
    setRuntime("preview");
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });

    const { listMetacognitionHistory } = await import("@/app/metacognition/actions");
    const result = await listMetacognitionHistory({ limit: 6 });

    expect(result.mode).toBe("blocked");
    expect(result.items).toEqual([]);
    expect(result.message).toContain("Entre");
  });

  test("returns ok:false when update affects no rows", async () => {
    const taskUpdate = queryMock({ data: null, error: null });
    supabaseMock.from.mockReturnValue(taskUpdate);

    const { updateTaskStatus } = await import("@/app/tasks/actions");
    const result = await updateTaskStatus("task-1", "completed");

    expect(result.ok).toBe(false);
    expect(result.mode).toBe("supabase");
    expect(result.message).toContain("Tarefa nao encontrada");
  });

  test("calendar validation returns a controlled action result", async () => {
    const { createCalendarBlock } = await import("@/app/calendar/actions");
    const result = await createCalendarBlock({
      endTime: "2026-06-03T16:00:00-03:00",
      title: "",
      type: "task"
    });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Revise os dados");
  });
});
