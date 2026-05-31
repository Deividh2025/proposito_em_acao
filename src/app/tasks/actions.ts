"use server";

import { breakTaskIntoMicrotasks } from "@/domain/tasks";
import {
  createTaskInputSchema,
  executionActionResultSchema,
  persistTaskBreakdownInputSchema,
  updateMicrotaskStatusInputSchema,
  type ExecutionActionResult
} from "@/domain/execution/persistence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): ExecutionActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: true, message, id });
}

function errorDraft(message: string): ExecutionActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

function mapTaskType(type: string) {
  const map: Record<string, string> = {
    one_off: "one_off",
    project_task: "project_task",
    recurring_work: "recurring_work",
    microtask: "microtask",
    restart_task: "restart_task"
  };

  return map[type] ?? "one_off";
}

export async function generateTaskBreakdownDraft(input: unknown) {
  const parsed = createTaskInputSchema.parse(input);

  return breakTaskIntoMicrotasks({
    title: parsed.title,
    reason: parsed.reason ?? parsed.nextAction,
    estimatedMinutes: parsed.estimatedMinutes,
    energyLevel: parsed.energyLevel
  });
}

export async function createTask(input: unknown): Promise<ExecutionActionResult> {
  const parsed = createTaskInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Tarefa mantida como rascunho local/dev. Entre para persistir com RLS.");
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        project_id: parsed.projectId || null,
        goal_id: parsed.goalId || null,
        title: parsed.title,
        description: parsed.description || null,
        task_type: mapTaskType(parsed.taskType),
        status: parsed.status,
        priority: parsed.priority,
        energy_level: parsed.energyLevel,
        estimated_minutes: parsed.estimatedMinutes,
        due_date: parsed.dueDate || null,
        reason: parsed.reason || null,
        next_action: parsed.nextAction
      })
      .select("id")
      .single();

    if (error) {
      return errorDraft(`Nao foi possivel salvar a tarefa: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Tarefa salva no Supabase com policy owner-only.",
      id: data?.id
    });
  } catch {
    return localDraft("Modo local seguro: tarefa validada sem persistencia remota.");
  }
}

export async function persistTaskBreakdown(input: unknown): Promise<ExecutionActionResult> {
  const parsed = persistTaskBreakdownInputSchema.parse(input);

  if (!parsed.taskId) {
    return localDraft("Microtarefas geradas por mock mantidas localmente ate a tarefa existir no Supabase.");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Microtarefas mantidas como rascunho local/dev. Entre para persistir com RLS.");
    }

    const rows = parsed.output.microtasks.map((microtask) => ({
      user_id: user.id,
      task_id: parsed.taskId,
      title: microtask.title,
      position: microtask.order,
      estimated_minutes: microtask.estimated_minutes,
      status: "pending"
    }));

    const { error } = await supabase.from("microtasks").insert(rows);

    if (error) {
      return errorDraft(`Nao foi possivel salvar as microtarefas: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Microtarefas salvas no Supabase com FK composta e RLS owner-only.",
      id: parsed.taskId
    });
  } catch {
    return localDraft("Modo local seguro: microtarefas validadas sem persistencia remota.");
  }
}

export async function updateMicrotaskStatus(input: unknown): Promise<ExecutionActionResult> {
  const parsed = updateMicrotaskStatusInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Status de microtarefa atualizado somente nesta sessao local/dev.");
    }

    const { error } = await supabase
      .from("microtasks")
      .update({
        status: parsed.status,
        completed_at: parsed.status === "completed" ? new Date().toISOString() : null
      })
      .eq("id", parsed.microtaskId)
      .eq("user_id", user.id);

    if (error) {
      return errorDraft(`Nao foi possivel atualizar a microtarefa: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Microtarefa atualizada no Supabase com filtro de dono.",
      id: parsed.microtaskId
    });
  } catch {
    return localDraft("Modo local seguro: status de microtarefa validado sem envio externo.");
  }
}

export async function updateTaskStatus(taskId: string, status: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Status da tarefa atualizado apenas no rascunho local/dev.", taskId);
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        status,
        completed_at: status === "completed" ? new Date().toISOString() : null
      })
      .eq("id", taskId)
      .eq("user_id", user.id);

    if (error) {
      return errorDraft(`Nao foi possivel atualizar a tarefa: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Status da tarefa atualizado com filtro de dono.",
      id: taskId
    });
  } catch {
    return localDraft("Modo local seguro: status da tarefa validado sem envio externo.", taskId);
  }
}

export async function deleteTask(taskId: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Exclusao simulada no rascunho local/dev. Nada foi removido remotamente.", taskId);
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId).eq("user_id", user.id);

    if (error) {
      return errorDraft(`Nao foi possivel excluir a tarefa: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Tarefa excluida no Supabase com policy owner-only.",
      id: taskId
    });
  } catch {
    return localDraft("Modo local seguro: exclusao de tarefa nao foi enviada a servico externo.", taskId);
  }
}
