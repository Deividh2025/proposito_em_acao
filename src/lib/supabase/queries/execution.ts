import "server-only";

import type { User } from "@supabase/supabase-js";

import { sampleExecutionLinks, sampleProjectPlan, sampleSmartGoal, sampleTaskBreakdown } from "@/domain/execution/sample-data";
import type { GoalStatus } from "@/domain/goals";
import type { ProjectStatus } from "@/domain/projects";
import type { EnergyLevel, MicrotaskStatus, TaskStatus, TaskType } from "@/domain/tasks";
import { getAppRuntimeMode } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TypedSupabaseClient } from "@/lib/supabase/types";
import { hasEssentialSupabaseConfig } from "@/lib/supabase/guards";

type Row = Record<string, unknown>;

export type ExecutionDataMode = "supabase" | "local-demo" | "auth-required" | "blocked";

export type ExecutionDataState = {
  mode: ExecutionDataMode;
  isSample: boolean;
  message: string;
};

export type ExecutionGoalSummary = {
  id: string;
  title: string;
  status: GoalStatus;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timebound: string;
  lifeArea: string;
  alignmentLevel: "low" | "medium" | "high";
  callingAlignment: string;
  protectedAreas: string[];
  ecologicalAdjustments: string[];
  ecologicalRisks: string[];
  isEcologicallySafe: boolean;
  progressPercent: number;
  firstAction: string;
  description: string;
  createdAt: string | null;
  isSample: boolean;
};

export type ExecutionProjectSummary = {
  id: string;
  goalId: string;
  title: string;
  description: string;
  phase: string;
  status: ProjectStatus;
  risks: string[];
  resources: string[];
  nextAction: string;
  initialTasks: ExecutionTaskSummary[];
  createdAt: string | null;
  isSample: boolean;
};

export type ExecutionTaskSummary = {
  id: string;
  goalId: string | null;
  projectId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  taskType: TaskType;
  priority: "low" | "medium" | "high";
  energyLevel: EnergyLevel;
  estimatedMinutes: number;
  dueDate: string | null;
  reason: string;
  nextAction: string;
  microtasks: ExecutionMicrotaskSummary[];
  createdAt: string | null;
  isSample: boolean;
};

export type ExecutionMicrotaskSummary = {
  id: string;
  taskId: string;
  title: string;
  position: number;
  estimatedMinutes: number;
  status: MicrotaskStatus;
  isSample: boolean;
};

export type ExecutionOverviewData = ExecutionDataState & {
  goals: ExecutionGoalSummary[];
  projects: ExecutionProjectSummary[];
  tasks: ExecutionTaskSummary[];
  counts: {
    goals: number;
    projects: number;
    tasks: number;
  };
};

export type ExecutionListData<T> = ExecutionDataState & {
  items: T[];
};

export type ExecutionDetailData<T> = ExecutionDataState & {
  item: T | null;
};

const AUTH_REQUIRED_MESSAGE = "Entre na sua conta para carregar seus dados reais com Supabase/RLS.";
const BLOCKED_MESSAGE = "Nao foi possivel carregar dados reais autenticados agora.";
const LOCAL_DEMO_MESSAGE = "Amostras locais exibidas apenas em local-demo; elas nao representam dados persistidos.";
const SUPABASE_MESSAGE = "Dados reais carregados para o usuario autenticado.";

function getRuntimeMode() {
  try {
    return getAppRuntimeMode();
  } catch {
    return "production";
  }
}

function isLocalDemoRuntime() {
  return getRuntimeMode() === "local-demo";
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function asStringArray(value: unknown) {
  return asArray(value).filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asObject(value: unknown): Row {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as Row) : {};
}

function asGoalStatus(value: unknown): GoalStatus {
  const status = asString(value, "draft");

  return ["draft", "active", "paused", "completed", "abandoned", "needs_review"].includes(status)
    ? (status as GoalStatus)
    : "draft";
}

function asProjectStatus(value: unknown): ProjectStatus {
  const status = asString(value, "active");

  return ["draft", "active", "paused", "completed", "archived", "needs_review"].includes(status)
    ? (status as ProjectStatus)
    : "active";
}

function asTaskStatus(value: unknown): TaskStatus {
  const status = asString(value, "pending");

  return ["pending", "scheduled", "in_focus", "completed", "deferred", "stuck", "cancelled"].includes(status)
    ? (status as TaskStatus)
    : "pending";
}

function asEnergyLevel(value: unknown): EnergyLevel {
  const level = asString(value, "medium");

  return ["low", "medium", "high"].includes(level) ? (level as EnergyLevel) : "medium";
}

function asTaskType(value: unknown): TaskType {
  const type = asString(value, "one_off");

  return ["one_off", "project_task", "recurring_work", "microtask", "restart_task"].includes(type)
    ? (type as TaskType)
    : "one_off";
}

function asPriority(value: unknown): "low" | "medium" | "high" {
  const priority = asString(value, "medium");

  return ["low", "medium", "high"].includes(priority) ? (priority as "low" | "medium" | "high") : "medium";
}

function asMicrotaskStatus(value: unknown): MicrotaskStatus {
  const status = asString(value, "pending");

  return ["pending", "completed", "skipped"].includes(status) ? (status as MicrotaskStatus) : "pending";
}

function asAlignmentLevel(value: unknown): "low" | "medium" | "high" {
  const level = asString(value, "medium");

  return ["low", "medium", "high"].includes(level) ? (level as "low" | "medium" | "high") : "medium";
}

function mapGoalRow(row: Row, isSample = false): ExecutionGoalSummary {
  const ecologicalAnalysis = asObject(row.ecological_analysis);
  const callingAlignment = asObject(row.calling_alignment);

  return {
    achievable: asString(row.achievable, "Definir uma versao possivel antes de executar."),
    alignmentLevel: asAlignmentLevel(callingAlignment.alignment_level),
    callingAlignment: asString(callingAlignment.explanation, "Alinhamento com Chamado a revisar pelo usuario."),
    createdAt: asNullableString(row.created_at),
    description: asString(row.description),
    ecologicalAdjustments: asStringArray(ecologicalAnalysis.adjustments),
    ecologicalRisks: asStringArray(ecologicalAnalysis.risks),
    firstAction: asString(row.next_action, "Escolher a proxima microacao revisavel."),
    id: asString(row.id, "goal-local-demo"),
    isEcologicallySafe: ecologicalAnalysis.is_ecologically_safe === true,
    isSample,
    lifeArea: asString(row.life_area, "execucao"),
    measurable: asString(row.measurable, "Definir metrica simples de progresso."),
    progressPercent: asNumber(row.progress_percent, 0),
    protectedAreas: asStringArray(ecologicalAnalysis.protected_areas),
    relevant: asString(row.relevant, "Comparar com a direcao pessoal antes de aprofundar."),
    specific: asString(row.specific, asString(row.description, "Alvo salvo sem descricao detalhada.")),
    status: asGoalStatus(row.status),
    timebound: asString(row.time_bound, "Sem prazo definido"),
    title: asString(row.title, "Alvo sem titulo")
  };
}

function mapProjectRow(
  row: Row,
  initialTasks: ExecutionTaskSummary[] = [],
  isSample = false
): ExecutionProjectSummary {
  return {
    createdAt: asNullableString(row.created_at),
    description: asString(row.description, "Projeto salvo sem descricao detalhada."),
    goalId: asString(row.goal_id),
    id: asString(row.id, "project-local-demo"),
    initialTasks,
    isSample,
    nextAction: asString(row.next_action, initialTasks[0]?.nextAction ?? "Escolher a primeira tarefa pequena."),
    phase: asString(row.phase, "inicio"),
    resources: asStringArray(row.resources),
    risks: asStringArray(row.risks),
    status: asProjectStatus(row.status),
    title: asString(row.title, "Projeto sem titulo")
  };
}

function mapTaskRow(row: Row, microtasks: ExecutionMicrotaskSummary[] = [], isSample = false): ExecutionTaskSummary {
  return {
    createdAt: asNullableString(row.created_at),
    description: asString(row.description),
    dueDate: asNullableString(row.due_date),
    energyLevel: asEnergyLevel(row.energy_level),
    estimatedMinutes: asNumber(row.estimated_minutes, 25),
    goalId: asNullableString(row.goal_id),
    id: asString(row.id, "task-local-demo"),
    isSample,
    microtasks,
    nextAction: asString(row.next_action, "Abrir a tarefa por cinco minutos."),
    priority: asPriority(row.priority),
    projectId: asNullableString(row.project_id),
    reason: asString(row.reason, asString(row.description, "Motivo a revisar antes da execucao.")),
    status: asTaskStatus(row.status),
    taskType: asTaskType(row.task_type),
    title: asString(row.title, "Tarefa sem titulo")
  };
}

function mapMicrotaskRow(row: Row, isSample = false): ExecutionMicrotaskSummary {
  return {
    estimatedMinutes: asNumber(row.estimated_minutes, 5),
    id: asString(row.id, "microtask-local-demo"),
    isSample,
    position: asNumber(row.position, 0),
    status: asMicrotaskStatus(row.status),
    taskId: asString(row.task_id),
    title: asString(row.title, "Microtarefa sem titulo")
  };
}

function sampleGoal(): ExecutionGoalSummary {
  return {
    ...mapGoalRow(
      {
        achievable: sampleSmartGoal.achievable,
        calling_alignment: sampleSmartGoal.calling_alignment,
        description: sampleSmartGoal.specific,
        ecological_analysis: sampleSmartGoal.ecological_analysis,
        id: sampleExecutionLinks.goalId,
        life_area: sampleSmartGoal.life_area,
        measurable: sampleSmartGoal.measurable,
        next_action: sampleSmartGoal.first_action,
        progress_percent: 15,
        relevant: sampleSmartGoal.relevant,
        specific: sampleSmartGoal.specific,
        status: sampleSmartGoal.status,
        time_bound: sampleSmartGoal.timebound,
        title: sampleSmartGoal.title
      },
      true
    ),
    isSample: true
  };
}

function sampleProject(): ExecutionProjectSummary {
  const project = sampleProjectPlan.projects[0];
  const task = project?.tasks[0];
  const initialTasks = task
    ? [
        mapTaskRow(
          {
            description: task.description,
            energy_level: task.energy_level,
            estimated_minutes: task.estimated_minutes,
            goal_id: sampleExecutionLinks.goalId,
            id: `${sampleExecutionLinks.projectId}-task-1`,
            next_action: task.microtasks[0],
            project_id: sampleExecutionLinks.projectId,
            reason: task.description,
            status: "pending",
            task_type: "project_task",
            title: task.title
          },
          [],
          true
        )
      ]
    : [];

  return mapProjectRow(
    {
      description: project?.description,
      goal_id: sampleExecutionLinks.goalId,
      id: sampleExecutionLinks.projectId,
      next_action: task?.microtasks[0],
      phase: project?.phase,
      resources: project?.resources_needed,
      risks: project?.risks,
      status: "needs_review",
      title: project?.title
    },
    initialTasks,
    true
  );
}

function sampleTask(): ExecutionTaskSummary {
  const microtasks = sampleTaskBreakdown.microtasks.map((microtask) =>
    mapMicrotaskRow(
      {
        estimated_minutes: microtask.estimated_minutes,
        id: `${sampleExecutionLinks.taskId}-sample-${microtask.order}`,
        position: microtask.order,
        status: "pending",
        task_id: sampleExecutionLinks.taskId,
        title: microtask.title
      },
      true
    )
  );

  return mapTaskRow(
    {
      energy_level: sampleTaskBreakdown.energy_level,
      estimated_minutes: sampleTaskBreakdown.estimated_minutes,
      id: sampleExecutionLinks.taskId,
      next_action: sampleTaskBreakdown.first_micro_action,
      reason: sampleTaskBreakdown.reason,
      status: "pending",
      task_type: "project_task",
      title: sampleTaskBreakdown.task_title
    },
    microtasks,
    true
  );
}

function localDemoOverview(): ExecutionOverviewData {
  const goals = [sampleGoal()];
  const projects = [sampleProject()];
  const tasks = [sampleTask()];

  return {
    counts: {
      goals: goals.length,
      projects: projects.length,
      tasks: tasks.length
    },
    goals,
    isSample: true,
    message: LOCAL_DEMO_MESSAGE,
    mode: "local-demo",
    projects,
    tasks
  };
}

function emptyOverview(mode: Exclude<ExecutionDataMode, "supabase" | "local-demo">, message: string): ExecutionOverviewData {
  return {
    counts: {
      goals: 0,
      projects: 0,
      tasks: 0
    },
    goals: [],
    isSample: false,
    message,
    mode,
    projects: [],
    tasks: []
  };
}

function listResult<T>(state: ExecutionDataState, items: T[]): ExecutionListData<T> {
  return {
    ...state,
    items
  };
}

function detailResult<T>(state: ExecutionDataState, item: T | null): ExecutionDetailData<T> {
  return {
    ...state,
    item
  };
}

type AccessResult =
  | {
      ok: true;
      supabase: TypedSupabaseClient;
      user: User;
    }
  | {
      ok: false;
      state: ExecutionDataState;
    };

async function getExecutionAccess(): Promise<AccessResult> {
  if (isLocalDemoRuntime()) {
    return {
      ok: false,
      state: { isSample: true, message: LOCAL_DEMO_MESSAGE, mode: "local-demo" }
    };
  }

  if (!hasEssentialSupabaseConfig()) {
    return {
      ok: false,
      state: { isSample: false, message: BLOCKED_MESSAGE, mode: "blocked" }
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        ok: false,
        state: isLocalDemoRuntime()
          ? { isSample: true, message: LOCAL_DEMO_MESSAGE, mode: "local-demo" }
          : { isSample: false, message: AUTH_REQUIRED_MESSAGE, mode: "auth-required" }
      };
    }

    return { ok: true, supabase, user };
  } catch {
    return {
      ok: false,
      state: { isSample: false, message: BLOCKED_MESSAGE, mode: "blocked" }
    };
  }
}

async function loadRows(query: unknown): Promise<Row[]> {
  const { data, error } = (await query) as { data?: unknown; error?: unknown };

  if (error) {
    throw new Error("Execution query failed.");
  }

  return Array.isArray(data) ? (data as Row[]) : [];
}

async function loadMaybeRow(query: unknown): Promise<Row | null> {
  const { data, error } = (await query) as { data?: unknown; error?: unknown };

  if (error) {
    throw new Error("Execution detail query failed.");
  }

  return data && typeof data === "object" && !Array.isArray(data) ? (data as Row) : null;
}

async function queryGoals(supabase: TypedSupabaseClient, user: User, limit = 12) {
  const query = supabase
    .from("goals")
    .select(
      "id,title,status,specific,measurable,achievable,relevant,time_bound,ecological_analysis,progress_percent,next_action,description,created_at"
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return (await loadRows(query)).map((row) => mapGoalRow(row));
}

async function queryProjects(supabase: TypedSupabaseClient, user: User, limit = 12) {
  const query = supabase
    .from("projects")
    .select("id,goal_id,title,description,phase,status,risks,resources,next_action,created_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return (await loadRows(query)).map((row) => mapProjectRow(row));
}

async function queryTasks(supabase: TypedSupabaseClient, user: User, limit = 12) {
  const query = supabase
    .from("tasks")
    .select(
      "id,goal_id,project_id,title,description,status,task_type,priority,energy_level,estimated_minutes,due_date,reason,next_action,created_at"
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return (await loadRows(query)).map((row) => mapTaskRow(row));
}

async function queryMicrotasksForTask(supabase: TypedSupabaseClient, user: User, taskId: string) {
  const query = supabase
    .from("microtasks")
    .select("id,task_id,title,position,estimated_minutes,status")
    .eq("user_id", user.id)
    .eq("task_id", taskId)
    .order("position", { ascending: true });

  return (await loadRows(query)).map((row) => mapMicrotaskRow(row));
}

async function queryTasksForProject(supabase: TypedSupabaseClient, user: User, projectId: string) {
  const query = supabase
    .from("tasks")
    .select(
      "id,goal_id,project_id,title,description,status,task_type,priority,energy_level,estimated_minutes,due_date,reason,next_action,created_at"
    )
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .order("created_at", { ascending: true })
    .limit(8);

  return (await loadRows(query)).map((row) => mapTaskRow(row));
}

export async function loadExecutionOverview(): Promise<ExecutionOverviewData> {
  const access = await getExecutionAccess();

  if (!access.ok) {
    return access.state.mode === "local-demo"
      ? localDemoOverview()
      : emptyOverview(access.state.mode === "auth-required" ? "auth-required" : "blocked", access.state.message);
  }

  try {
    const [goals, projects, tasks] = await Promise.all([
      queryGoals(access.supabase, access.user, 5),
      queryProjects(access.supabase, access.user, 5),
      queryTasks(access.supabase, access.user, 5)
    ]);

    return {
      counts: {
        goals: goals.length,
        projects: projects.length,
        tasks: tasks.length
      },
      goals,
      isSample: false,
      message: SUPABASE_MESSAGE,
      mode: "supabase",
      projects,
      tasks
    };
  } catch {
    return emptyOverview("blocked", BLOCKED_MESSAGE);
  }
}

export async function loadGoalList(): Promise<ExecutionListData<ExecutionGoalSummary>> {
  const access = await getExecutionAccess();

  if (!access.ok) {
    return listResult(access.state, access.state.mode === "local-demo" ? [sampleGoal()] : []);
  }

  try {
    return listResult({ isSample: false, message: SUPABASE_MESSAGE, mode: "supabase" }, await queryGoals(access.supabase, access.user));
  } catch {
    return listResult({ isSample: false, message: BLOCKED_MESSAGE, mode: "blocked" }, []);
  }
}

export async function loadProjectList(): Promise<ExecutionListData<ExecutionProjectSummary>> {
  const access = await getExecutionAccess();

  if (!access.ok) {
    return listResult(access.state, access.state.mode === "local-demo" ? [sampleProject()] : []);
  }

  try {
    return listResult(
      { isSample: false, message: SUPABASE_MESSAGE, mode: "supabase" },
      await queryProjects(access.supabase, access.user)
    );
  } catch {
    return listResult({ isSample: false, message: BLOCKED_MESSAGE, mode: "blocked" }, []);
  }
}

export async function loadTaskList(): Promise<ExecutionListData<ExecutionTaskSummary>> {
  const access = await getExecutionAccess();

  if (!access.ok) {
    return listResult(access.state, access.state.mode === "local-demo" ? [sampleTask()] : []);
  }

  try {
    return listResult({ isSample: false, message: SUPABASE_MESSAGE, mode: "supabase" }, await queryTasks(access.supabase, access.user));
  } catch {
    return listResult({ isSample: false, message: BLOCKED_MESSAGE, mode: "blocked" }, []);
  }
}

export async function loadGoalDetail(goalId: string): Promise<ExecutionDetailData<ExecutionGoalSummary>> {
  const access = await getExecutionAccess();

  if (!access.ok) {
    const item = access.state.mode === "local-demo" && goalId === sampleExecutionLinks.goalId ? sampleGoal() : null;
    return detailResult(access.state, item);
  }

  try {
    const query = access.supabase
      .from("goals")
      .select(
        "id,title,status,specific,measurable,achievable,relevant,time_bound,ecological_analysis,progress_percent,next_action,description,created_at"
      )
      .eq("id", goalId)
      .eq("user_id", access.user.id)
      .maybeSingle();
    const row = await loadMaybeRow(query);

    return detailResult(
      { isSample: false, message: row ? SUPABASE_MESSAGE : "Alvo nao encontrado para este usuario.", mode: "supabase" },
      row ? mapGoalRow(row) : null
    );
  } catch {
    return detailResult({ isSample: false, message: BLOCKED_MESSAGE, mode: "blocked" }, null);
  }
}

export async function loadProjectDetail(projectId: string): Promise<ExecutionDetailData<ExecutionProjectSummary>> {
  const access = await getExecutionAccess();

  if (!access.ok) {
    const item = access.state.mode === "local-demo" && projectId === sampleExecutionLinks.projectId ? sampleProject() : null;
    return detailResult(access.state, item);
  }

  try {
    const query = access.supabase
      .from("projects")
      .select("id,goal_id,title,description,phase,status,risks,resources,next_action,created_at")
      .eq("id", projectId)
      .eq("user_id", access.user.id)
      .maybeSingle();
    const row = await loadMaybeRow(query);

    if (!row) {
      return detailResult(
        { isSample: false, message: "Projeto nao encontrado para este usuario.", mode: "supabase" },
        null
      );
    }

    const initialTasks = await queryTasksForProject(access.supabase, access.user, projectId);

    return detailResult(
      { isSample: false, message: SUPABASE_MESSAGE, mode: "supabase" },
      mapProjectRow(row, initialTasks)
    );
  } catch {
    return detailResult({ isSample: false, message: BLOCKED_MESSAGE, mode: "blocked" }, null);
  }
}

export async function loadTaskDetail(taskId: string): Promise<ExecutionDetailData<ExecutionTaskSummary>> {
  const access = await getExecutionAccess();

  if (!access.ok) {
    const item = access.state.mode === "local-demo" && taskId === sampleExecutionLinks.taskId ? sampleTask() : null;
    return detailResult(access.state, item);
  }

  try {
    const query = access.supabase
      .from("tasks")
      .select(
        "id,goal_id,project_id,title,description,status,task_type,priority,energy_level,estimated_minutes,due_date,reason,next_action,created_at"
      )
      .eq("id", taskId)
      .eq("user_id", access.user.id)
      .maybeSingle();
    const row = await loadMaybeRow(query);

    if (!row) {
      return detailResult(
        { isSample: false, message: "Tarefa nao encontrada para este usuario.", mode: "supabase" },
        null
      );
    }

    const microtasks = await queryMicrotasksForTask(access.supabase, access.user, taskId);

    return detailResult(
      { isSample: false, message: SUPABASE_MESSAGE, mode: "supabase" },
      mapTaskRow(row, microtasks)
    );
  } catch {
    return detailResult({ isSample: false, message: BLOCKED_MESSAGE, mode: "blocked" }, null);
  }
}
