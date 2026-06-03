"use server";

import { breakTaskIntoMicrotasks } from "@/domain/tasks";
import {
  createTaskInputSchema,
  executionActionResultSchema,
  persistTaskBreakdownInputSchema,
  updateMicrotaskStatusInputSchema,
  type ExecutionActionResult
} from "@/domain/execution/persistence";
import {
  localOnlyDraftResult,
  missingSessionResult,
  noAffectedRowResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult
} from "@/domain/execution/action-results";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  const inputResult = safeParseActionInput(createTaskInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Tarefa mantida como rascunho local/dev. Entre para persistir com RLS."
      );
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
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel salvar a tarefa agora.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Tarefa salva no Supabase com policy owner-only.",
      data?.id
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: tarefa validada sem persistencia remota.",
      undefined,
      {},
      "Nao foi possivel salvar a tarefa agora."
    );
  }
}

export async function persistTaskBreakdown(input: unknown): Promise<ExecutionActionResult> {
  const inputResult = safeParseActionInput(persistTaskBreakdownInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;

  if (!parsed.taskId) {
    return localOnlyDraftResult(
      executionActionResultSchema,
      "Microtarefas geradas por mock mantidas localmente ate a tarefa existir no Supabase.",
      undefined,
      {},
      "Salve a tarefa antes de persistir microtarefas."
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Microtarefas mantidas como rascunho local/dev. Entre para persistir com RLS."
      );
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
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel salvar as microtarefas agora.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Microtarefas salvas no Supabase com FK composta e RLS owner-only.",
      parsed.taskId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: microtarefas validadas sem persistencia remota.",
      undefined,
      {},
      "Nao foi possivel salvar as microtarefas agora."
    );
  }
}

export async function updateMicrotaskStatus(input: unknown): Promise<ExecutionActionResult> {
  const inputResult = safeParseActionInput(updateMicrotaskStatusInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Status de microtarefa atualizado somente nesta sessao local/dev."
      );
    }

    const { data, error } = await supabase
      .from("microtasks")
      .update({
        status: parsed.status,
        completed_at: parsed.status === "completed" ? new Date().toISOString() : null
      })
      .eq("id", parsed.microtaskId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel atualizar a microtarefa agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(executionActionResultSchema, "Microtarefa nao encontrada para este usuario.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Microtarefa atualizada no Supabase com filtro de dono.",
      parsed.microtaskId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: status de microtarefa validado sem envio externo.",
      parsed.microtaskId,
      {},
      "Nao foi possivel atualizar a microtarefa agora."
    );
  }
}

export async function updateTaskStatus(taskId: string, status: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Status da tarefa atualizado apenas no rascunho local/dev.",
        taskId
      );
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({
        status,
        completed_at: status === "completed" ? new Date().toISOString() : null
      })
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel atualizar a tarefa agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(executionActionResultSchema, "Tarefa nao encontrada para este usuario.");
    }

    return supabaseSuccessResult(executionActionResultSchema, "Status da tarefa atualizado com filtro de dono.", taskId);
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: status da tarefa validado sem envio externo.",
      taskId,
      {},
      "Nao foi possivel atualizar a tarefa agora."
    );
  }
}

export async function deleteTask(taskId: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Exclusao simulada no rascunho local/dev. Nada foi removido remotamente.",
        taskId
      );
    }

    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel excluir a tarefa agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(executionActionResultSchema, "Tarefa nao encontrada para este usuario.");
    }

    return supabaseSuccessResult(executionActionResultSchema, "Tarefa excluida no Supabase com policy owner-only.", taskId);
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: exclusao de tarefa nao foi enviada a servico externo.",
      taskId,
      {},
      "Nao foi possivel excluir a tarefa agora."
    );
  }
}
