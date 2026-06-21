import "server-only";

import type { User } from "@supabase/supabase-js";

import { gardenStateOutputSchema, type GardenAreaState, type GardenStateOutput } from "@/ai/schemas";
import { lifeGardenAreas } from "@/domain/garden";
import { getAppRuntimeMode, getPublicEnv, type AppRuntimeMode } from "@/lib/config";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

type AuthenticatedDataReason =
  | "authenticated"
  | "auth-required"
  | "config-missing"
  | "local-demo"
  | "query-error";

type AuthenticatedDataKind = "authenticated" | "blocked" | "local-demo";

export type AuthenticatedDataMode = {
  canUseSampleData: boolean;
  kind: AuthenticatedDataKind;
  reason: AuthenticatedDataReason;
};

export type SafeQueryError = {
  code: "query-error";
  message: string;
};

export type ReflectionLoadMode = "blocked" | "local-demo" | "supabase";

export type ReflectionDataResult<T> = {
  data: T | null;
  message: string;
  mode: ReflectionLoadMode;
};

export type ReflectionListResult<T> = {
  items: T[];
  message: string;
  mode: ReflectionLoadMode;
};

export type WeeklyReviewHistoryItem = {
  completedAt: string;
  id: string;
  nextWeekFocus: string;
  overloadWarning: boolean;
  stuckPoints: string[];
  summary: string;
  weekEnd: string;
  weekStart: string;
  wins: string[];
};

export type MetacognitionHistoryItem = {
  createdAt: string;
  crisis: boolean;
  id: string;
  nextAction: string;
  pattern: string;
  reframe: string;
  stateName: string;
};

type ReflectionAccess = {
  mode: AuthenticatedDataMode;
  supabase: TypedSupabaseClient | null;
  user: User | null;
};

const FORBIDDEN_REFLECTION_KEYS = new Set([
  "atalaia",
  "metacognition_text",
  "private_note",
  "prompt",
  "raw_response",
  "raw_thought"
]);

function hasSupabasePublicConfig() {
  try {
    const env = getPublicEnv();

    return Boolean(
      env.NEXT_PUBLIC_SUPABASE_URL &&
        (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    );
  } catch {
    return false;
  }
}

export function resolveAuthenticatedDataMode(input: {
  hasSupabaseConfig: boolean;
  hasUser: boolean;
  runtimeMode: AppRuntimeMode;
}): AuthenticatedDataMode {
  if (input.hasSupabaseConfig && input.hasUser) {
    return {
      canUseSampleData: false,
      kind: "authenticated",
      reason: "authenticated"
    };
  }

  if (input.runtimeMode === "local-demo") {
    return {
      canUseSampleData: true,
      kind: "local-demo",
      reason: "local-demo"
    };
  }

  if (!input.hasSupabaseConfig) {
    return {
      canUseSampleData: false,
      kind: "blocked",
      reason: "config-missing"
    };
  }

  return {
    canUseSampleData: false,
    kind: "blocked",
    reason: "auth-required"
  };
}

export function toSafeQueryError(_error: unknown, fallbackMessage = "Nao foi possivel carregar seus dados agora.") {
  return {
    code: "query-error",
    message: fallbackMessage
  } satisfies SafeQueryError;
}

function blockedMessage(reason: AuthenticatedDataReason) {
  if (reason === "auth-required") {
    return "Entre na sua conta para ver dados privados reais.";
  }

  if (reason === "config-missing") {
    return "Este ambiente ainda nao esta configurado para dados autenticados reais.";
  }

  return "Nao foi possivel carregar seus dados privados agora.";
}

async function getReflectionAccess(): Promise<ReflectionAccess> {
  const runtimeMode = getAppRuntimeMode();

  if (runtimeMode === "local-demo") {
    return {
      mode: {
        canUseSampleData: true,
        kind: "local-demo" as const,
        reason: "local-demo" as const
      },
      supabase: null,
      user: null
    };
  }

  const hasConfig = hasSupabasePublicConfig();

  if (!hasConfig) {
    return {
      mode: resolveAuthenticatedDataMode({
        hasSupabaseConfig: false,
        hasUser: false,
        runtimeMode
      }),
      supabase: null,
      user: null
    };
  }

  try {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error) {
      return {
        mode: {
          canUseSampleData: false,
          kind: "blocked",
          reason: "auth-required"
        },
        supabase: null,
        user: null
      };
    }

    const mode = resolveAuthenticatedDataMode({
      hasSupabaseConfig: true,
      hasUser: Boolean(user),
      runtimeMode
    });

    return {
      mode,
      supabase: mode.kind === "authenticated" ? supabase : null,
      user: mode.kind === "authenticated" ? user : null
    };
  } catch {
    return {
      mode: {
        canUseSampleData: false,
        kind: "blocked",
        reason: "query-error"
      },
      supabase: null,
      user: null
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringOrFallback(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function containsForbiddenReflectionKey(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(containsForbiddenReflectionKey);
  }

  if (!isRecord(value)) {
    return false;
  }

  return Object.entries(value).some(([key, nested]) => {
    const normalized = key.toLowerCase();

    return FORBIDDEN_REFLECTION_KEYS.has(normalized) || containsForbiddenReflectionKey(nested);
  });
}

function mapGardenAreaState(value: unknown): GardenAreaState | null {
  if (!isRecord(value) || containsForbiddenReflectionKey(value)) {
    return null;
  }

  const parsed = gardenStateOutputSchema.shape.garden_state.shape.life_areas.element.safeParse(value);

  return parsed.success ? parsed.data : null;
}

export function buildLocalDemoGardenState(): GardenStateOutput {
  return gardenStateOutputSchema.parse({
    garden_state: {
      life_areas: lifeGardenAreas.map((area, index) => ({
        area,
        care_message:
          index % 4 === 0
            ? `${area} pede cuidado simples nesta semana demonstrativa, sem culpa.`
            : `${area} aparece como exemplo local/dev de cuidado em passos pequenos.`,
        care_needed: index % 4 === 0,
        growth_level: index % 4 === 0 ? 1 : index % 3 === 0 ? 4 : 2,
        recent_events: index % 4 === 0 ? ["Exemplo local/dev de cuidado"] : ["Exemplo local/dev de passo pequeno"],
        visual_state: index % 4 === 0 ? "needs_care" : index % 3 === 0 ? "fruitful" : "sprout"
      })),
      unlocked_items: ["Exemplo local/dev", "Cuidado sem punicao"],
      weekly_growth_summary:
        "Jardim demonstrativo local/dev: use apenas como amostra visual. Dados reais aparecem apos login e revisao salva."
    },
    schema_version: "garden_state_output_v1"
  });
}

export function mapGardenStateRow(row: unknown): GardenStateOutput | null {
  if (!isRecord(row) || containsForbiddenReflectionKey(row)) {
    return null;
  }

  const rawAreas = Array.isArray(row.area_states) ? row.area_states : [];
  const lifeAreas = rawAreas.map(mapGardenAreaState).filter((area): area is GardenAreaState => Boolean(area));

  if (lifeAreas.length === 0) {
    return null;
  }

  const parsed = gardenStateOutputSchema.safeParse({
    garden_state: {
      life_areas: lifeAreas,
      unlocked_items: stringList(row.unlocked_items),
      weekly_growth_summary: stringOrFallback(
        row.weekly_growth_summary,
        "Jardim privado carregado a partir das suas revisoes salvas."
      )
    },
    schema_version: row.schema_version
  });

  return parsed.success ? parsed.data : null;
}

function mapWeeklyReviewRow(row: unknown): WeeklyReviewHistoryItem | null {
  if (!isRecord(row) || containsForbiddenReflectionKey(row)) {
    return null;
  }

  if (typeof row.id !== "string") {
    return null;
  }

  return {
    completedAt: stringOrFallback(row.completed_at ?? row.created_at, ""),
    id: row.id,
    nextWeekFocus: stringOrFallback(row.next_week_focus, "Foco da proxima semana ainda nao registrado."),
    overloadWarning: row.overload_warning === true,
    stuckPoints: stringList(row.stuck_points),
    summary: stringOrFallback(row.ai_summary, "Revisao privada salva sem resumo."),
    weekEnd: stringOrFallback(row.week_end, ""),
    weekStart: stringOrFallback(row.week_start, ""),
    wins: stringList(row.wins)
  };
}

function mapMetacognitionHistoryRow(row: unknown): MetacognitionHistoryItem | null {
  if (!isRecord(row) || containsForbiddenReflectionKey(row)) {
    return null;
  }

  if (typeof row.id !== "string") {
    return null;
  }

  return {
    createdAt: stringOrFallback(row.created_at, ""),
    crisis: row.crisis_flag === true,
    id: row.id,
    nextAction: stringOrFallback(row.next_action, "Proxima acao privada"),
    pattern: stringList(row.cognitive_patterns)[0] ?? "padrao provavel",
    reframe: stringOrFallback(row.ai_reframe, "Reformulacao privada"),
    stateName: stringOrFallback(row.emotional_state, "Estado interno")
  };
}

async function getGardenStateForAuthenticatedUser(supabase: TypedSupabaseClient, user: User) {
  const { data, error } = await supabase
    .from("garden_states")
    .select("schema_version, area_states, unlocked_items, weekly_growth_summary")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw toSafeQueryError(error);
  }

  return mapGardenStateRow(data);
}

async function listWeeklyReviewsForAuthenticatedUser(
  supabase: TypedSupabaseClient,
  user: User,
  limit: number
) {
  const { data, error } = await supabase
    .from("weekly_reviews")
    .select(
      "id, week_start, week_end, ai_summary, wins, stuck_points, next_week_focus, overload_warning, completed_at, created_at"
    )
    .eq("user_id", user.id)
    .order("week_start", { ascending: false })
    .limit(limit);

  if (error) {
    throw toSafeQueryError(error);
  }

  return (Array.isArray(data) ? data : []).map(mapWeeklyReviewRow).filter((item): item is WeeklyReviewHistoryItem =>
    Boolean(item)
  );
}

async function listMetacognitionHistoryForAuthenticatedUser(
  supabase: TypedSupabaseClient,
  user: User,
  limit: number
) {
  const { data, error } = await supabase
    .from("metacognition_sessions")
    .select("id, emotional_state, cognitive_patterns, ai_reframe, next_action, crisis_flag, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw toSafeQueryError(error);
  }

  return (Array.isArray(data) ? data : [])
    .map(mapMetacognitionHistoryRow)
    .filter((item): item is MetacognitionHistoryItem => Boolean(item));
}

export async function getGardenStateForCurrentUser(): Promise<ReflectionDataResult<GardenStateOutput>> {
  const access = await getReflectionAccess();

  if (access.mode.kind === "local-demo") {
    return {
      data: buildLocalDemoGardenState(),
      message: "Jardim demonstrativo local/dev carregado. Entre para ver snapshots privados reais.",
      mode: "local-demo"
    };
  }

  if (access.mode.kind === "blocked" || !access.supabase || !access.user) {
    return {
      data: null,
      message: blockedMessage(access.mode.reason),
      mode: "blocked"
    };
  }

  try {
    const data = await getGardenStateForAuthenticatedUser(access.supabase, access.user);

    return {
      data,
      message: data
        ? "Jardim privado carregado com filtro de dono."
        : "Nenhum snapshot privado do Jardim foi salvo ainda.",
      mode: "supabase"
    };
  } catch {
    return {
      data: null,
      message: "Nao foi possivel carregar o Jardim privado agora.",
      mode: "blocked"
    };
  }
}

export async function listWeeklyReviewHistoryForCurrentUser(
  limit = 8
): Promise<ReflectionListResult<WeeklyReviewHistoryItem>> {
  const access = await getReflectionAccess();

  if (access.mode.kind === "local-demo") {
    return {
      items: [],
      message: "Historico real de revisoes exige login; local-demo nao mistura amostras com dados privados.",
      mode: "local-demo"
    };
  }

  if (access.mode.kind === "blocked" || !access.supabase || !access.user) {
    return {
      items: [],
      message: blockedMessage(access.mode.reason),
      mode: "blocked"
    };
  }

  try {
    const items = await listWeeklyReviewsForAuthenticatedUser(access.supabase, access.user, limit);

    return {
      items,
      message: items.length
        ? "Historico privado carregado com filtro de dono."
        : "Nenhuma Revisao Semanal privada foi salva ainda.",
      mode: "supabase"
    };
  } catch {
    return {
      items: [],
      message: "Nao foi possivel carregar o historico de revisoes agora.",
      mode: "blocked"
    };
  }
}

export async function listMetacognitionHistoryForCurrentUser(
  limit = 8
): Promise<ReflectionListResult<MetacognitionHistoryItem>> {
  const access = await getReflectionAccess();

  if (access.mode.kind === "local-demo") {
    return {
      items: [
        {
          createdAt: "2026-06-01T09:00:00-03:00",
          crisis: false,
          id: "local-metacognition-1",
          nextAction: "Abrir a tarefa por 2 minutos.",
          pattern: "generalizacao excessiva",
          reframe: "Falhei neste ponto, mas ainda posso retomar com uma acao pequena.",
          stateName: "Exemplo local/dev: culpa diante da tarefa"
        }
      ],
      message: "Historico demonstrativo local/dev. Entre para ver sessoes privadas reais.",
      mode: "local-demo"
    };
  }

  if (access.mode.kind === "blocked" || !access.supabase || !access.user) {
    return {
      items: [],
      message: blockedMessage(access.mode.reason),
      mode: "blocked"
    };
  }

  try {
    const items = await listMetacognitionHistoryForAuthenticatedUser(access.supabase, access.user, limit);

    return {
      items,
      message: items.length
        ? "Historico privado carregado com filtro de dono."
        : "Nenhuma sessao privada de Metacognicao foi salva ainda.",
      mode: "supabase"
    };
  } catch {
    return {
      items: [],
      message: "Nao foi possivel carregar o historico privado agora.",
      mode: "blocked"
    };
  }
}
