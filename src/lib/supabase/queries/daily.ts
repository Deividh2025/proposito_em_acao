import "server-only";

import type { User } from "@supabase/supabase-js";

import { inboxClassificationOutputSchema } from "@/ai/schemas";
import type { FocusSessionPlan } from "@/domain/focus";
import { sampleCalendarBlocks, type CalendarBlock, type CalendarBlockStatus, type CalendarBlockType } from "@/domain/calendar";
import { sampleInboxItems, type InboxContentType, type InboxDestinationType, type InboxItem, type InboxItemStatus } from "@/domain/inbox";
import type { Habit, HabitFrequency, HabitStatus } from "@/domain/habits";
import type {
  DisciplineScoreboard,
  ScoreboardItem,
  ScoreboardItemType,
  ScoreboardPeriod,
  ScoreboardVisibility
} from "@/domain/scoreboard";
import {
  getAuthenticatedDataContext,
  type AuthenticatedDataContext,
  toSafeQueryError
} from "@/lib/supabase/queries/authenticated-data";
import {
  booleanFromRow,
  firstRowFromUnknown,
  numberFromRow,
  nullableStringFromRow,
  recordFromUnknown,
  stringFromRow
} from "@/lib/supabase/queries/mappers";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

type DailyRoutineDataSource = "authenticated" | "blocked" | "error" | "local-demo";

export type DailyRoutineData = {
  calendarBlocks: CalendarBlock[];
  canUseSampleData: boolean;
  habits: Habit[];
  message: string;
  recentInboxItems: InboxItem[];
  restartCount: number;
  scoreboard: DisciplineScoreboard | null;
  source: DailyRoutineDataSource;
  weekStart: string;
};

export type FocusSetupData = {
  canUseSampleData: boolean;
  message: string;
  plan: FocusSessionPlan;
  source: DailyRoutineDataSource;
};

type DailyRoutineOptions = {
  weekStart?: string;
};

type FocusSetupOptions = {
  durationMinutes?: number;
  taskId?: string;
};

const calendarBlockTypes = new Set<CalendarBlockType>([
  "task",
  "focus",
  "habit_placeholder",
  "recurring_work",
  "rest",
  "family",
  "spirituality",
  "health",
  "learning",
  "service",
  "appointment",
  "buffer"
]);

const calendarBlockStatuses = new Set<CalendarBlockStatus>(["scheduled", "completed", "missed", "cancelled"]);
const inboxContentTypes = new Set<InboxContentType>(["text", "voice_note", "image_placeholder", "file", "link"]);
const inboxStatuses = new Set<InboxItemStatus>(["captured", "triaged", "converted", "discarded", "archived"]);
const inboxDestinations = new Set<InboxDestinationType>([
  "task",
  "project",
  "calendar_event",
  "habit",
  "reference",
  "future_idea",
  "discard",
  "needs_clarification"
]);
const habitStatuses = new Set<HabitStatus>(["draft", "active", "paused", "archived"]);
const habitFrequencies = new Set<HabitFrequency>(["daily", "weekly", "custom"]);
const scoreboardPeriods = new Set<ScoreboardPeriod>(["daily", "weekly", "monthly", "custom"]);
const scoreboardVisibilities = new Set<ScoreboardVisibility>(["private", "atalaias_limited"]);
const scoreboardItemTypes = new Set<ScoreboardItemType>([
  "task",
  "habit",
  "focus",
  "restart",
  "behavior",
  "commitment",
  "manual"
]);

const sampleHabits: Habit[] = [
  {
    id: "local-demo-habit-prayer",
    title: "Leitura breve pela manha",
    status: "active",
    identityStatement: "Sou alguem que volta ao essencial antes da pressa.",
    whyItMatters: "Comecar pequeno protege direcao antes de agenda.",
    lifeArea: "Espiritualidade",
    trigger: "Depois de beber agua pela manha",
    minimumVersion: "Ler por 2 minutos",
    idealVersion: "Ler e anotar uma frase",
    frequency: "daily",
    scheduleSuggestion: "Antes do primeiro bloco de trabalho",
    reward: "Marcar minimo feito",
    likelyObstacle: "pressa",
    ifThenPlan: "Se houver pressa, ler uma frase e marcar minimo.",
    environmentDesign: "Livro ou nota aberta na mesa.",
    metric: "minimo/ideal/retomada",
    restartPlan: "Voltar no proximo contexto sem compensar com excesso."
  }
];

const sampleScoreboard: DisciplineScoreboard = {
  id: "local-demo-scoreboard-default",
  title: "Placar leve da semana",
  period: "weekly",
  visibility: "private",
  items: [
    {
      id: "local-demo-scoreboard-focus",
      title: "Sessao de foco honesta",
      type: "focus",
      targetFrequency: "3 vezes na semana",
      minimumSuccess: "5 minutos com distracoes capturadas"
    },
    {
      id: "local-demo-scoreboard-restart",
      title: "Retomada sem culpa",
      type: "restart",
      targetFrequency: "quando houver queda",
      minimumSuccess: "voltar com uma microacao"
    }
  ]
};

const localDemoFocusPlan: FocusSessionPlan = {
  taskTitle: "Organizar documentos da semana",
  nextStep: "Abrir a pasta e separar apenas o primeiro documento",
  reason: "Reduzir peso mental e liberar a proxima decisao financeira.",
  durationMinutes: 25
};

const EMPTY_FOCUS_PLAN: FocusSessionPlan = {
  taskTitle: "",
  nextStep: "",
  reason: "",
  durationMinutes: 25
};

function enumValue<T extends string>(value: unknown, allowed: Set<T>, fallback: T): T {
  return typeof value === "string" && allowed.has(value as T) ? (value as T) : fallback;
}

function weekStartFromDate(now = new Date()) {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = date.getUTCDay();
  const offset = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + offset);

  return date.toISOString().slice(0, 10);
}

function addDaysIsoDate(date: string, days: number) {
  const value = new Date(`${date.slice(0, 10)}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);

  return value.toISOString().slice(0, 10);
}

function safeNullableId(row: Record<string, unknown>, key: string) {
  return nullableStringFromRow(row, key) ?? undefined;
}

function localDemoDailyRoutineData(message: string): DailyRoutineData {
  return {
    calendarBlocks: sampleCalendarBlocks,
    canUseSampleData: true,
    habits: sampleHabits,
    message,
    recentInboxItems: sampleInboxItems,
    restartCount: 2,
    scoreboard: sampleScoreboard,
    source: "local-demo",
    weekStart: "2026-06-01"
  };
}

function emptyDailyRoutineData(source: Exclude<DailyRoutineDataSource, "authenticated" | "local-demo">, message: string, weekStart?: string): DailyRoutineData {
  return {
    calendarBlocks: [],
    canUseSampleData: false,
    habits: [],
    message,
    recentInboxItems: [],
    restartCount: 0,
    scoreboard: null,
    source,
    weekStart: weekStart ?? weekStartFromDate()
  };
}

function emptyFocusSetupData(source: Exclude<DailyRoutineDataSource, "authenticated" | "local-demo">, message: string, durationMinutes = 25): FocusSetupData {
  return {
    canUseSampleData: false,
    message,
    plan: {
      ...EMPTY_FOCUS_PLAN,
      durationMinutes
    },
    source
  };
}

export function mapCalendarBlockRow(value: unknown): CalendarBlock {
  const row = recordFromUnknown(value);

  return {
    id: stringFromRow(row, "id", "unknown-calendar-block"),
    title: stringFromRow(row, "title", "Bloco sem titulo"),
    type: enumValue(row.block_type, calendarBlockTypes, "task"),
    status: enumValue(row.status, calendarBlockStatuses, "scheduled"),
    startTime: stringFromRow(row, "start_time"),
    endTime: stringFromRow(row, "end_time"),
    energyLevel: row.energy_level ? enumValue(row.energy_level, new Set(["low", "medium", "high"] as const), "medium") : undefined,
    taskId: safeNullableId(row, "task_id"),
    projectId: safeNullableId(row, "project_id"),
    goalId: safeNullableId(row, "goal_id"),
    recurrenceRule: safeNullableId(row, "recurrence_rule"),
    notes: safeNullableId(row, "notes")
  };
}

export function mapInboxItemRow(value: unknown): InboxItem {
  const row = recordFromUnknown(value);
  const aiClassification = inboxClassificationOutputSchema.safeParse(row.ai_classification);
  const classification =
    aiClassification.success && aiClassification.data.schema_version === "inbox_classification_output_v1"
      ? aiClassification.data
      : inboxClassificationOutputSchema
          .safeParse({
            schema_version: "inbox_classification_output_v1",
            classification: row.classification,
            confidence: row.confidence_level ?? "medium",
            suggested_title: row.suggested_title ?? stringFromRow(row, "content", "Captura"),
            summary: row.summary ?? "Captura ainda sem resumo revisado.",
            recommended_action: row.recommended_action ?? "clarify",
            life_area: row.life_area ?? null,
            estimated_minutes: row.estimated_minutes ?? null,
            energy_level: row.energy_level ?? null,
            due_date_suggestion: row.due_date_suggestion ?? null,
            clarifying_question: row.clarifying_question ?? null,
            safety_note: row.safety_note ?? "Revisar antes de transformar em dado operacional.",
            user_review_required: booleanFromRow(row, "user_review_required", true)
          })
          .success
        ? inboxClassificationOutputSchema.parse({
            schema_version: "inbox_classification_output_v1",
            classification: row.classification,
            confidence: row.confidence_level ?? "medium",
            suggested_title: row.suggested_title ?? stringFromRow(row, "content", "Captura"),
            summary: row.summary ?? "Captura ainda sem resumo revisado.",
            recommended_action: row.recommended_action ?? "clarify",
            life_area: row.life_area ?? null,
            estimated_minutes: row.estimated_minutes ?? null,
            energy_level: row.energy_level ?? null,
            due_date_suggestion: row.due_date_suggestion ?? null,
            clarifying_question: row.clarifying_question ?? null,
            safety_note: row.safety_note ?? "Revisar antes de transformar em dado operacional.",
            user_review_required: booleanFromRow(row, "user_review_required", true)
          })
        : undefined;

  return {
    id: stringFromRow(row, "id", "unknown-inbox-item"),
    content: stringFromRow(row, "content", "Captura sem conteudo carregado"),
    contentType: enumValue(row.content_type, inboxContentTypes, "text"),
    status: enumValue(row.status, inboxStatuses, "captured"),
    classification,
    destinationType: row.destination_type
      ? enumValue(row.destination_type, inboxDestinations, "needs_clarification")
      : undefined,
    destinationId: safeNullableId(row, "destination_id"),
    processingNote: safeNullableId(row, "processing_note"),
    createdAt: stringFromRow(row, "created_at")
  };
}

export function mapHabitRow(value: unknown): Habit {
  const row = recordFromUnknown(value);
  const frequency = recordFromUnknown(row.frequency);

  return {
    id: stringFromRow(row, "id", "unknown-habit"),
    title: stringFromRow(row, "title", "Habito sem titulo"),
    status: enumValue(row.status, habitStatuses, "active"),
    identityStatement: stringFromRow(row, "identity_statement", stringFromRow(row, "identity", "")),
    whyItMatters: stringFromRow(row, "why_it_matters", "Motivo ainda nao registrado."),
    lifeArea: stringFromRow(row, "life_area", "Rotina"),
    trigger: stringFromRow(row, "trigger", "Escolher um gatilho simples."),
    minimumVersion: stringFromRow(row, "minimum_version", "Fazer a versao minima."),
    idealVersion: stringFromRow(row, "ideal_version", "Fazer a versao ideal quando houver energia."),
    frequency: enumValue(frequency.type, habitFrequencies, "daily"),
    scheduleSuggestion: stringFromRow(row, "schedule_suggestion", "Ancorar em um contexto previsivel."),
    reward: stringFromRow(row, "reward", "Registrar a pequena vitoria."),
    likelyObstacle: stringFromRow(row, "likely_obstacle", "Atrito nao informado."),
    ifThenPlan: stringFromRow(row, "if_then_plan", "Se travar, reduzir para a versao minima."),
    environmentDesign: stringFromRow(row, "environment_design", "Deixar o primeiro passo visivel."),
    metric: stringFromRow(row, "metric", "minimo/ideal/retomada"),
    restartPlan: stringFromRow(row, "restart_plan", "Voltar no proximo contexto sem compensar com excesso."),
    linkedGoalId: safeNullableId(row, "goal_id")
  };
}

export function mapScoreboardRows(scoreboardValues: unknown[], itemValues: unknown[]): DisciplineScoreboard[] {
  const itemsByScoreboard = new Map<string, ScoreboardItem[]>();

  itemValues.forEach((value) => {
    const row = recordFromUnknown(value);
    const scoreboardId = nullableStringFromRow(row, "scoreboard_id");

    if (!scoreboardId) {
      return;
    }

    const item: ScoreboardItem = {
      id: stringFromRow(row, "id", "unknown-scoreboard-item"),
      title: stringFromRow(row, "title", "Item sem titulo"),
      type: enumValue(row.item_type, scoreboardItemTypes, "manual"),
      targetFrequency: stringFromRow(row, "target_frequency", "Frequencia a revisar"),
      minimumSuccess: stringFromRow(row, "minimum_success", "Sucesso minimo a revisar"),
      linkedGoalId: safeNullableId(row, "linked_goal_id"),
      linkedHabitId: safeNullableId(row, "linked_habit_id"),
      linkedTaskId: safeNullableId(row, "linked_task_id")
    };

    itemsByScoreboard.set(scoreboardId, [...(itemsByScoreboard.get(scoreboardId) ?? []), item]);
  });

  return scoreboardValues.map((value) => {
    const row = recordFromUnknown(value);
    const id = stringFromRow(row, "id", "unknown-scoreboard");

    return {
      id,
      title: stringFromRow(row, "title", "Placar sem titulo"),
      period: enumValue(row.period, scoreboardPeriods, "weekly"),
      visibility: enumValue(row.visibility, scoreboardVisibilities, "private"),
      items: itemsByScoreboard.get(id) ?? []
    };
  });
}

async function loadAuthenticatedDailyRoutineData(
  supabase: TypedSupabaseClient,
  user: User,
  options: DailyRoutineOptions
): Promise<DailyRoutineData> {
  const weekStart = options.weekStart ?? weekStartFromDate();
  const weekEnd = addDaysIsoDate(weekStart, 7);

  const [calendarResult, inboxResult, habitsResult, scoreboardsResult] = await Promise.all([
    supabase
      .from("calendar_blocks")
      .select("id,title,block_type,status,start_time,end_time,energy_level,task_id,recurrence_rule,notes")
      .eq("user_id", user.id)
      .gte("start_time", `${weekStart}T00:00:00.000Z`)
      .lt("start_time", `${weekEnd}T00:00:00.000Z`)
      .order("start_time", { ascending: true }),
    supabase
      .from("inbox_items")
      .select(
        "id,content,content_type,status,created_at,ai_classification,classification,recommended_action,confidence_level,suggested_title,summary,life_area,estimated_minutes,energy_level,due_date_suggestion,clarifying_question,safety_note,destination_type,destination_id,processing_note"
      )
      .eq("user_id", user.id)
      .in("status", ["captured", "triaged"])
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("habits")
      .select(
        "id,title,status,identity,identity_statement,why_it_matters,life_area,trigger,minimum_version,ideal_version,frequency,schedule_suggestion,reward,likely_obstacle,if_then_plan,environment_design,metric,restart_plan,goal_id"
      )
      .eq("user_id", user.id)
      .in("status", ["active", "draft"])
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("discipline_scoreboards")
      .select("id,title,period,visibility")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
  ]);

  if (calendarResult.error || inboxResult.error || habitsResult.error || scoreboardsResult.error) {
    throw new Error(toSafeQueryError(null).message);
  }

  const scoreboardRows = scoreboardsResult.data ?? [];
  const scoreboardIds = scoreboardRows.map((row) => stringFromRow(recordFromUnknown(row), "id")).filter(Boolean);

  const itemResult =
    scoreboardIds.length > 0
      ? await supabase
          .from("scoreboard_items")
          .select(
            "id,scoreboard_id,item_type,title,target_frequency,minimum_success,linked_goal_id,linked_habit_id,linked_task_id"
          )
          .eq("user_id", user.id)
          .in("scoreboard_id", scoreboardIds)
          .order("position", { ascending: true })
      : { data: [], error: null };

  if (itemResult.error) {
    throw new Error(toSafeQueryError(null, "Nao foi possivel carregar o Placar.").message);
  }

  const restartResult =
    scoreboardIds[0]
      ? await supabase
          .from("scoreboard_entries")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("scoreboard_id", scoreboardIds[0])
          .eq("status", "restarted")
      : { count: 0, error: null };

  if (restartResult.error) {
    throw new Error(toSafeQueryError(null, "Nao foi possivel carregar retomadas do Placar.").message);
  }

  const scoreboards = mapScoreboardRows(scoreboardRows, itemResult.data ?? []);

  return {
    calendarBlocks: (calendarResult.data ?? []).map(mapCalendarBlockRow),
    canUseSampleData: false,
    habits: (habitsResult.data ?? []).map(mapHabitRow),
    message: "Dados reais carregados com Supabase/RLS owner-only.",
    recentInboxItems: (inboxResult.data ?? []).map(mapInboxItemRow),
    restartCount: restartResult.count ?? 0,
    scoreboard: scoreboards[0] ?? null,
    source: "authenticated",
    weekStart
  };
}

async function loadAuthenticatedFocusSetupData(
  supabase: TypedSupabaseClient,
  user: User,
  options: FocusSetupOptions
): Promise<FocusSetupData> {
  const durationMinutes = options.durationMinutes ?? 25;

  if (!options.taskId) {
    return {
      canUseSampleData: false,
      message: "Escolha uma tarefa real ou descreva manualmente a proxima acao de foco.",
      plan: {
        ...EMPTY_FOCUS_PLAN,
        durationMinutes
      },
      source: "authenticated"
    };
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("id,title,next_action,reason,estimated_minutes")
    .eq("id", options.taskId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(toSafeQueryError(null, "Nao foi possivel carregar a tarefa de foco.").message);
  }

  const row = firstRowFromUnknown(data ? [data] : []);

  if (!row.id) {
    return {
      canUseSampleData: false,
      message: "Tarefa nao encontrada para este usuario. Voce ainda pode preencher o foco manualmente.",
      plan: {
        ...EMPTY_FOCUS_PLAN,
        durationMinutes
      },
      source: "authenticated"
    };
  }

  return {
    canUseSampleData: false,
    message: "Tarefa real carregada para foco.",
    plan: {
      taskId: stringFromRow(row, "id"),
      taskTitle: stringFromRow(row, "title", ""),
      nextStep: stringFromRow(row, "next_action", "Definir o primeiro passo pequeno."),
      reason: stringFromRow(row, "reason", "Executar com baixa friccao."),
      durationMinutes: numberFromRow(row, "estimated_minutes", durationMinutes)
    },
    source: "authenticated"
  };
}

export async function resolveDailyRoutineDataFromContext(
  context: AuthenticatedDataContext,
  options: DailyRoutineOptions = {}
): Promise<DailyRoutineData> {
  if (context.kind === "local-demo") {
    return localDemoDailyRoutineData(context.message);
  }

  if (context.kind === "blocked") {
    return emptyDailyRoutineData("blocked", context.userMessage, options.weekStart);
  }

  try {
    return await loadAuthenticatedDailyRoutineData(context.supabase, context.user, options);
  } catch (error) {
    return emptyDailyRoutineData("error", toSafeQueryError(error).message, options.weekStart);
  }
}

export async function resolveFocusSetupDataFromContext(
  context: AuthenticatedDataContext,
  options: FocusSetupOptions = {}
): Promise<FocusSetupData> {
  if (context.kind === "local-demo") {
    return {
      canUseSampleData: true,
      message: context.message,
      plan: {
        ...localDemoFocusPlan,
        durationMinutes: options.durationMinutes ?? localDemoFocusPlan.durationMinutes
      },
      source: "local-demo"
    };
  }

  if (context.kind === "blocked") {
    return emptyFocusSetupData("blocked", context.userMessage, options.durationMinutes);
  }

  try {
    return await loadAuthenticatedFocusSetupData(context.supabase, context.user, options);
  } catch (error) {
    return emptyFocusSetupData("error", toSafeQueryError(error).message, options.durationMinutes);
  }
}

export async function getDailyRoutineData(options: DailyRoutineOptions = {}) {
  return resolveDailyRoutineDataFromContext(await getAuthenticatedDataContext(), options);
}

export async function getFocusSetupData(options: FocusSetupOptions = {}) {
  return resolveFocusSetupDataFromContext(await getAuthenticatedDataContext(), options);
}
