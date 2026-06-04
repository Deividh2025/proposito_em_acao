import { beforeEach, describe, expect, test, vi } from "vitest";

import { buildAccountabilityMessagePreview, type CreateAccountabilityInviteInput } from "@/domain/accountability";

type QueryResult = {
  data?: unknown;
  error?: null | { message: string };
};

type QueryMock = ReturnType<typeof createQueryMock>;

type SupabaseMock = {
  auth: {
    getUser: ReturnType<typeof vi.fn>;
  };
  from: ReturnType<typeof vi.fn>;
};

let serverSupabaseMock: SupabaseMock;
let adminSupabaseMock: SupabaseMock;
let queryMocksByTable: Map<string, QueryMock[]>;
let createdQueryMocksByTable: Map<string, QueryMock[]>;

vi.mock("server-only", () => ({}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => serverSupabaseMock)
}));

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(() => adminSupabaseMock)
}));

function createQueryMock(result: QueryResult) {
  const chain = {
    delete: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    gt: vi.fn(() => chain),
    in: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    is: vi.fn(() => chain),
    maybeSingle: vi.fn(async () => result),
    select: vi.fn(() => chain),
    single: vi.fn(async () => result),
    then: vi.fn((resolve, reject) => Promise.resolve(result).then(resolve, reject)),
    update: vi.fn(() => chain)
  };

  return chain;
}

function queueTableResult(tableName: string, result: QueryResult) {
  const queryMock = createQueryMock(result);
  const queue = queryMocksByTable.get(tableName) ?? [];
  const created = createdQueryMocksByTable.get(tableName) ?? [];
  queue.push(queryMock);
  created.push(queryMock);
  queryMocksByTable.set(tableName, queue);
  createdQueryMocksByTable.set(tableName, created);
}

function createTableRouter() {
  return vi.fn((tableName: string) => {
    const queue = queryMocksByTable.get(tableName);
    const next = queue?.shift();

    if (!next) {
      throw new Error(`Unexpected table access in test: ${tableName}`);
    }

    return next;
  });
}

function setRuntime(mode: "local-demo" | "preview" | "beta" | "production") {
  vi.stubEnv("APP_RUNTIME_MODE", mode);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");
}

function inviteInput(overrides: Partial<CreateAccountabilityInviteInput> = {}): CreateAccountabilityInviteInput {
  return {
    completedMilestones: ["Marco revisado"],
    firstAction: "Executar uma microacao.",
    goalDeadline: "2026-07-31",
    goalId: "00000000-0000-4000-8000-000000000001",
    goalStatus: "ativo",
    goalTitle: "Alvo autorizado",
    level: "balanced",
    notificationFrequency: "weekly",
    partnerEmail: "atalia@example.com",
    partnerName: "Atalaia",
    permissions: ["goal_name", "status"],
    progressPercentage: 30,
    ...overrides
  };
}

describe("secure accountability actions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    setRuntime("preview");
    queryMocksByTable = new Map();
    createdQueryMocksByTable = new Map();
    serverSupabaseMock = {
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { email: "owner@example.com", id: "user-1" } } }))
      },
      from: createTableRouter()
    };
    adminSupabaseMock = {
      auth: {
        getUser: vi.fn()
      },
      from: createTableRouter()
    };
  });

  test("returns a safe validation result when invite draft text contains private categories", async () => {
    const { generateAccountabilityInviteDraft } = await import("@/app/accountability/actions");

    const result = await generateAccountabilityInviteDraft(
      inviteInput({
        customMessage: "Resumo inclui metacognicao, chamado completo, saude, familia, financas e emocoes.",
        permissions: ["goal_name", "custom_message"]
      })
    );

    expect(result.ok).toBe(false);
    expect(result.draft).toBeUndefined();
    expect(result.preview).toBeUndefined();
    expect(result.message).toContain("dado privado fora do escopo");
  });

  test("rejects invite persistence when the approved preview no longer matches the reviewed payload", async () => {
    const preview = buildAccountabilityMessagePreview(inviteInput({ permissions: ["goal_name"] }));
    const { persistAccountabilityInvite } = await import("@/app/accountability/actions");

    const result = await persistAccountabilityInvite({
      ...inviteInput({ permissions: ["goal_name", "status"] }),
      preview
    });

    expect(result.ok).toBe(false);
    expect(result.mode).toBe("local-draft");
    expect(result.message).toContain("previa aprovada");
    expect(serverSupabaseMock.from).not.toHaveBeenCalled();
    expect(adminSupabaseMock.from).not.toHaveBeenCalled();
  });

  test("fails closed when accountability consent cannot be persisted before creating the invite", async () => {
    queueTableResult("goals", { data: { id: "00000000-0000-4000-8000-000000000001" }, error: null });
    queueTableResult("consent_records", { data: null, error: { message: "RLS denied" } });
    const { persistAccountabilityInvite } = await import("@/app/accountability/actions");

    const result = await persistAccountabilityInvite({
      ...inviteInput(),
      preview: buildAccountabilityMessagePreview(inviteInput())
    });

    expect(result.ok).toBe(false);
    expect(result.mode).toBe("supabase");
    expect(adminSupabaseMock.from).toHaveBeenCalledWith("consent_records");
    expect(adminSupabaseMock.from).not.toHaveBeenCalledWith("accountability_partners");
    expect(adminSupabaseMock.from).not.toHaveBeenCalledWith("accountability_grants");
  });

  test("expires invite rows when mandatory invite audit persistence fails after creating the grant", async () => {
    const partnerId = "00000000-0000-4000-8000-000000000010";
    const grantId = "00000000-0000-4000-8000-000000000011";
    const consentId = "00000000-0000-4000-8000-000000000012";
    queueTableResult("goals", { data: { id: "00000000-0000-4000-8000-000000000001" }, error: null });
    queueTableResult("consent_records", { data: { id: consentId }, error: null });
    queueTableResult("accountability_partners", { data: { id: partnerId }, error: null });
    queueTableResult("accountability_grants", { data: { id: grantId }, error: null });
    queueTableResult("accountability_events", { data: null, error: { message: "RLS denied" } });
    queueTableResult("accountability_grants", { data: { id: grantId }, error: null });
    queueTableResult("accountability_partners", { data: { id: partnerId }, error: null });
    queueTableResult("consent_records", { data: { id: consentId }, error: null });
    const { persistAccountabilityInvite } = await import("@/app/accountability/actions");

    const result = await persistAccountabilityInvite({
      ...inviteInput(),
      preview: buildAccountabilityMessagePreview(inviteInput())
    });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("auditoria");
    const grantQueries = createdQueryMocksByTable.get("accountability_grants") ?? [];
    const partnerQueries = createdQueryMocksByTable.get("accountability_partners") ?? [];
    const consentQueries = createdQueryMocksByTable.get("consent_records") ?? [];
    expect(partnerQueries[0]?.insert).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: null, status: "expired" })
    );
    expect(grantQueries[0]?.insert).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: null, status: "expired" })
    );
    expect(grantQueries[1]?.update).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: null, status: "expired" })
    );
    expect(partnerQueries[1]?.update).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: null, status: "expired" })
    );
    expect(consentQueries[1]?.update).toHaveBeenCalledWith(expect.objectContaining({ revoked_at: expect.any(String) }));
  });

  test("activates an invite token only after mandatory notification persistence succeeds", async () => {
    const partnerId = "00000000-0000-4000-8000-000000000010";
    const grantId = "00000000-0000-4000-8000-000000000011";
    const consentId = "00000000-0000-4000-8000-000000000012";
    queueTableResult("goals", { data: { id: "00000000-0000-4000-8000-000000000001" }, error: null });
    queueTableResult("consent_records", { data: { id: consentId }, error: null });
    queueTableResult("accountability_partners", { data: { id: partnerId }, error: null });
    queueTableResult("accountability_grants", { data: { id: grantId }, error: null });
    queueTableResult("accountability_events", { data: { id: "00000000-0000-4000-8000-000000000013" }, error: null });
    queueTableResult("accountability_notifications", { data: { id: "00000000-0000-4000-8000-000000000014" }, error: null });
    queueTableResult("accountability_grants", { data: { id: grantId }, error: null });
    queueTableResult("accountability_partners", { data: { id: partnerId }, error: null });
    queueTableResult("accountability_notifications", { data: { id: "00000000-0000-4000-8000-000000000014" }, error: null });
    const { persistAccountabilityInvite } = await import("@/app/accountability/actions");

    const result = await persistAccountabilityInvite({
      ...inviteInput(),
      preview: buildAccountabilityMessagePreview(inviteInput())
    });

    expect(result.ok).toBe(true);
    const grantQueries = createdQueryMocksByTable.get("accountability_grants") ?? [];
    const partnerQueries = createdQueryMocksByTable.get("accountability_partners") ?? [];
    const notificationQueries = createdQueryMocksByTable.get("accountability_notifications") ?? [];
    expect(grantQueries[0]?.insert).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: null, status: "expired" })
    );
    expect(partnerQueries[0]?.insert).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: null, status: "expired" })
    );
    expect(grantQueries[1]?.update).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: expect.any(String), status: "invited" })
    );
    expect(partnerQueries[1]?.update).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: expect.any(String), status: "invited" })
    );
    expect(notificationQueries[0]?.insert).toHaveBeenCalledWith(
      expect.objectContaining({ provider_status: "pending_provider_config", status: "draft" })
    );
    expect(notificationQueries[1]?.update).toHaveBeenCalledWith(
      expect.objectContaining({ provider_status: "pending_provider_config", status: "draft" })
    );
  });

  test("does not mark an accountability notification as sent when Resend fails", async () => {
    vi.stubEnv("EMAIL_PROVIDER", "resend");
    vi.stubEnv("EMAIL_FROM_NOTIFICATIONS", "notificacoes@notify.example.org");
    vi.stubEnv("EMAIL_REAL_ENABLED", "true");
    vi.stubEnv("EMAIL_DOMAIN_VERIFIED", "true");
    vi.stubEnv("RESEND_API_KEY", "re_placeholder");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        json: async () => ({ message: "provider unavailable" }),
        ok: false,
        status: 500
      }))
    );
    const partnerId = "00000000-0000-4000-8000-000000000010";
    const grantId = "00000000-0000-4000-8000-000000000011";
    const consentId = "00000000-0000-4000-8000-000000000012";
    const notificationId = "00000000-0000-4000-8000-000000000014";
    queueTableResult("goals", { data: { id: "00000000-0000-4000-8000-000000000001" }, error: null });
    queueTableResult("consent_records", { data: { id: consentId }, error: null });
    queueTableResult("accountability_partners", { data: { id: partnerId }, error: null });
    queueTableResult("accountability_grants", { data: { id: grantId }, error: null });
    queueTableResult("accountability_events", { data: { id: "00000000-0000-4000-8000-000000000013" }, error: null });
    queueTableResult("accountability_notifications", { data: { id: notificationId }, error: null });
    queueTableResult("accountability_grants", { data: { id: grantId }, error: null });
    queueTableResult("accountability_partners", { data: { id: partnerId }, error: null });
    queueTableResult("accountability_notifications", { data: { id: notificationId }, error: null });
    const { persistAccountabilityInvite } = await import("@/app/accountability/actions");

    const result = await persistAccountabilityInvite({
      ...inviteInput(),
      preview: buildAccountabilityMessagePreview(inviteInput())
    });

    expect(result.ok).toBe(true);
    expect(result.message).toContain("nao foi marcada como enviada");
    const notificationQueries = createdQueryMocksByTable.get("accountability_notifications") ?? [];
    expect(notificationQueries[1]?.update).toHaveBeenCalledWith(
      expect.objectContaining({
        provider_status: "blocked",
        sent_at: null,
        sent_payload_redacted: expect.objectContaining({ provider: "resend", status: "failed" }),
        status: "blocked"
      })
    );
  });

  test("accepts only the grant bound to the invite token and writes audit records", async () => {
    const partnerId = "00000000-0000-4000-8000-000000000010";
    const grantId = "00000000-0000-4000-8000-000000000011";
    queueTableResult("accountability_partners", {
      data: {
        email: "atalia@example.com",
        id: partnerId,
        user_id: "user-1"
      },
      error: null
    });
    queueTableResult("accountability_grants", {
      data: {
        goal_id: "00000000-0000-4000-8000-000000000001",
        id: grantId,
        status: "invited"
      },
      error: null
    });
    queueTableResult("consent_records", { data: { id: "00000000-0000-4000-8000-000000000012" }, error: null });
    queueTableResult("accountability_events", { data: { id: "00000000-0000-4000-8000-000000000013" }, error: null });
    queueTableResult("accountability_grants", { data: { id: grantId }, error: null });
    queueTableResult("accountability_partners", { data: { id: partnerId }, error: null });
    serverSupabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { email: "atalia@example.com", id: "partner-user-1" } }
    });

    const { acceptAccountabilityInvite } = await import("@/app/accountability/actions");
    const result = await acceptAccountabilityInvite({ inviteToken: "token-seguro-1234" });

    expect(result.ok).toBe(true);
    expect(adminSupabaseMock.from).toHaveBeenCalledWith("accountability_grants");
    const grantLookups = queryMocksByTable.get("accountability_grants") ?? [];
    expect(grantLookups).toHaveLength(0);
    expect(adminSupabaseMock.from).toHaveBeenCalledWith("consent_records");
    expect(adminSupabaseMock.from).toHaveBeenCalledWith("accountability_events");
    const partnerQueries = createdQueryMocksByTable.get("accountability_partners") ?? [];
    const grantQueries = createdQueryMocksByTable.get("accountability_grants") ?? [];
    expect(partnerQueries[0]?.eq).toHaveBeenCalledWith("invite_token_hash", expect.any(String));
    expect(partnerQueries[0]?.eq).toHaveBeenCalledWith("status", "invited");
    expect(partnerQueries[0]?.is).toHaveBeenCalledWith("partner_user_id", null);
    expect(partnerQueries[1]?.eq).toHaveBeenCalledWith("id", partnerId);
    expect(partnerQueries[1]?.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(partnerQueries[1]?.eq).toHaveBeenCalledWith("invite_token_hash", expect.any(String));
    expect(grantQueries[0]?.eq).toHaveBeenCalledWith("accountability_partner_id", partnerId);
    expect(grantQueries[0]?.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(grantQueries[0]?.eq).toHaveBeenCalledWith("status", "invited");
    expect(grantQueries[0]?.eq).toHaveBeenCalledWith("invite_token_hash", expect.any(String));
    expect(grantQueries[1]?.eq).toHaveBeenCalledWith("id", grantId);
    expect(grantQueries[1]?.eq).toHaveBeenCalledWith("accountability_partner_id", partnerId);
    expect(grantQueries[1]?.eq).toHaveBeenCalledWith("invite_token_hash", expect.any(String));
  });

  test("does not activate invite scope when acceptance consent persistence fails", async () => {
    const partnerId = "00000000-0000-4000-8000-000000000010";
    const grantId = "00000000-0000-4000-8000-000000000011";
    queueTableResult("accountability_partners", {
      data: {
        email: "atalia@example.com",
        id: partnerId,
        user_id: "user-1"
      },
      error: null
    });
    queueTableResult("accountability_grants", {
      data: {
        goal_id: "00000000-0000-4000-8000-000000000001",
        id: grantId
      },
      error: null
    });
    queueTableResult("consent_records", { data: null, error: { message: "RLS denied" } });
    serverSupabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { email: "atalia@example.com", id: "partner-user-1" } }
    });

    const { acceptAccountabilityInvite } = await import("@/app/accountability/actions");
    const result = await acceptAccountabilityInvite({ inviteToken: "token-seguro-1234" });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("consentimento");
    const grantQueries = createdQueryMocksByTable.get("accountability_grants") ?? [];
    const partnerQueries = createdQueryMocksByTable.get("accountability_partners") ?? [];
    expect(grantQueries).toHaveLength(1);
    expect(partnerQueries).toHaveLength(1);
    expect(grantQueries[0]?.update).not.toHaveBeenCalled();
    expect(partnerQueries[0]?.update).not.toHaveBeenCalled();
  });

  test("does not activate invite scope when acceptance audit persistence fails", async () => {
    const partnerId = "00000000-0000-4000-8000-000000000010";
    const grantId = "00000000-0000-4000-8000-000000000011";
    const consentId = "00000000-0000-4000-8000-000000000012";
    queueTableResult("accountability_partners", {
      data: {
        email: "atalia@example.com",
        id: partnerId,
        user_id: "user-1"
      },
      error: null
    });
    queueTableResult("accountability_grants", {
      data: {
        goal_id: "00000000-0000-4000-8000-000000000001",
        id: grantId
      },
      error: null
    });
    queueTableResult("consent_records", { data: { id: consentId }, error: null });
    queueTableResult("accountability_events", { data: null, error: { message: "RLS denied" } });
    queueTableResult("accountability_grants", { data: { id: grantId }, error: null });
    queueTableResult("accountability_partners", { data: { id: partnerId }, error: null });
    queueTableResult("consent_records", { data: { id: consentId }, error: null });
    serverSupabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { email: "atalia@example.com", id: "partner-user-1" } }
    });

    const { acceptAccountabilityInvite } = await import("@/app/accountability/actions");
    const result = await acceptAccountabilityInvite({ inviteToken: "token-seguro-1234" });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("auditoria");
    const grantQueries = createdQueryMocksByTable.get("accountability_grants") ?? [];
    const partnerQueries = createdQueryMocksByTable.get("accountability_partners") ?? [];
    expect(grantQueries[1]?.update).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: null, status: "expired" })
    );
    expect(partnerQueries[1]?.update).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: null, status: "expired" })
    );
  });

  test("does not echo the raw invite token in acceptance errors", async () => {
    const rawInviteToken = "token-super-secreto-1234";
    queueTableResult("accountability_partners", { data: null, error: null });
    serverSupabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { email: "atalia@example.com", id: "partner-user-1" } }
    });

    const { acceptAccountabilityInvite } = await import("@/app/accountability/actions");
    const result = await acceptAccountabilityInvite({ inviteToken: rawInviteToken });

    expect(result.ok).toBe(false);
    expect(result.message).not.toContain(rawInviteToken);
  });

  test("does not return the raw invite token in sanitized invite preview", async () => {
    const rawInviteToken = "token-super-secreto-1234";
    const partnerId = "00000000-0000-4000-8000-000000000010";
    const grantId = "00000000-0000-4000-8000-000000000011";
    queueTableResult("accountability_partners", {
      data: {
        email: "atalia@example.com",
        id: partnerId,
        user_id: "user-1"
      },
      error: null
    });
    queueTableResult("accountability_grants", {
      data: {
        goal_id: "00000000-0000-4000-8000-000000000001",
        id: grantId,
        last_previewed_at: "2026-06-03T12:00:00.000Z",
        notification_frequency: "weekly",
        permissions: { goal_name: true, status: true },
        tracking_level: "balanced"
      },
      error: null
    });
    queueTableResult("goals", { data: { title: "Alvo autorizado" }, error: null });
    serverSupabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { email: "atalia@example.com", id: "partner-user-1" } }
    });

    const { getAccountabilityInvitePreview } = await import("@/app/accountability/actions");
    const result = await getAccountabilityInvitePreview({ inviteToken: rawInviteToken });

    expect(result.ok).toBe(true);
    if (!result.grant) {
      throw new Error("Expected sanitized grant preview.");
    }
    expect(result.grant).not.toHaveProperty("inviteToken");
    expect(JSON.stringify(result.grant)).not.toContain(rawInviteToken);
  });

  test("does not expose the goal title in invite preview without goal_name permission", async () => {
    const rawInviteToken = "token-sem-nome-do-alvo-1234";
    const partnerId = "00000000-0000-4000-8000-000000000010";
    const grantId = "00000000-0000-4000-8000-000000000011";
    queueTableResult("accountability_partners", {
      data: {
        email: "atalia@example.com",
        id: partnerId,
        user_id: "user-1"
      },
      error: null
    });
    queueTableResult("accountability_grants", {
      data: {
        goal_id: "00000000-0000-4000-8000-000000000001",
        id: grantId,
        last_previewed_at: "2026-06-03T12:00:00.000Z",
        notification_frequency: "weekly",
        permissions: { status: true },
        tracking_level: "balanced"
      },
      error: null
    });
    serverSupabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { email: "atalia@example.com", id: "partner-user-1" } }
    });

    const { getAccountabilityInvitePreview } = await import("@/app/accountability/actions");
    const result = await getAccountabilityInvitePreview({ inviteToken: rawInviteToken });

    expect(result.ok).toBe(true);
    expect(result.grant?.goalTitle).toBe("Alvo autorizado");
    expect(adminSupabaseMock.from).not.toHaveBeenCalledWith("goals");
  });

  test("revocation cuts access before returning ok false when final audit persistence fails", async () => {
    const grantId = "00000000-0000-4000-8000-000000000011";
    const partnerId = "00000000-0000-4000-8000-000000000010";
    queueTableResult("accountability_grants", {
      data: {
        accountability_partner_id: partnerId,
        goal_id: "00000000-0000-4000-8000-000000000001",
        id: grantId
      },
      error: null
    });
    queueTableResult("accountability_grants", { data: { id: grantId }, error: null });
    queueTableResult("accountability_partners", { data: { id: partnerId }, error: null });
    queueTableResult("accountability_notifications", { data: [], error: null });
    queueTableResult("consent_records", { data: [], error: null });
    queueTableResult("accountability_events", { data: null, error: { message: "RLS denied" } });
    const { revokeAccountabilityGrant } = await import("@/app/accountability/actions");

    const result = await revokeAccountabilityGrant({ grantId, reason: "Encerrar acompanhamento." });

    expect(result.ok).toBe(false);
    expect(result.mode).toBe("supabase");
    expect(result.message).toContain("auditoria");
    expect(adminSupabaseMock.from).toHaveBeenCalledWith("accountability_notifications");
    const grantQueries = createdQueryMocksByTable.get("accountability_grants") ?? [];
    const partnerQueries = createdQueryMocksByTable.get("accountability_partners") ?? [];
    expect(grantQueries[1]?.update).toHaveBeenCalledWith(
      expect.objectContaining({ invite_token_hash: null, revoked_at: expect.any(String), status: "revoked" })
    );
    expect(partnerQueries[0]?.update).toHaveBeenCalledWith(
      expect.objectContaining({ revoked_at: expect.any(String), status: "revoked" })
    );
  });
});
