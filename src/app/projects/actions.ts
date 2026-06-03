"use server";

import { buildProjectPlanMock } from "@/domain/projects";
import {
  createProjectFromGoalInputSchema,
  executionActionResultSchema,
  persistProjectPlanInputSchema,
  type ExecutionActionResult
} from "@/domain/execution/persistence";
import {
  missingSessionResult,
  noAffectedRowResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult,
  validationErrorResult
} from "@/domain/execution/action-results";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function generateProjectPlanDraft(input: unknown) {
  const parsed = createProjectFromGoalInputSchema.parse(input);
  return buildProjectPlanMock(parsed);
}

export async function persistProjectPlan(input: unknown): Promise<ExecutionActionResult> {
  const inputResult = safeParseActionInput(persistProjectPlanInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;
  const project = parsed.output.projects[0];

  if (!project) {
    return validationErrorResult(executionActionResultSchema, "O plano de projeto nao trouxe nenhum projeto revisavel.");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Plano de projeto mantido como rascunho local/dev. Entre para persistir com RLS."
      );
    }

    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        goal_id: parsed.output.goal_id,
        title: project.title,
        description: project.description,
        phase: project.phase,
        status: "needs_review",
        risks: project.risks,
        resources: project.resources_needed,
        next_action: project.tasks[0]?.title ?? "Escolher a primeira tarefa"
      })
      .select("id")
      .single();

    if (projectError || !projectRow?.id) {
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel salvar o projeto agora.");
    }

    const taskRows = project.tasks.map((task) => ({
      user_id: user.id,
      project_id: projectRow.id,
      goal_id: parsed.output.goal_id,
      title: task.title,
      description: task.description,
      task_type: "project_task",
      status: "pending",
      priority: "medium",
      energy_level: task.energy_level,
      estimated_minutes: task.estimated_minutes,
      reason: "Tarefa sugerida pelo planejador mock do Prompt 8.",
      next_action: task.microtasks[0] ?? task.title
    }));

    if (taskRows.length > 0) {
      const { error: taskError } = await supabase.from("tasks").insert(taskRows);

      if (taskError) {
        return realServiceErrorResult(
          executionActionResultSchema,
          "Projeto salvo, mas as tarefas iniciais nao foram persistidas agora."
        );
      }
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Projeto e tarefas iniciais salvos no Supabase com RLS owner-only.",
      projectRow.id
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: plano de projeto validado sem persistencia remota.",
      undefined,
      {},
      "Nao foi possivel salvar o projeto agora."
    );
  }
}

export async function updateProjectStatus(projectId: string, status: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Status do projeto atualizado apenas no rascunho local/dev.",
        projectId
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", projectId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel atualizar o projeto agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(executionActionResultSchema, "Projeto nao encontrado para este usuario.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Status do projeto atualizado com filtro de dono.",
      projectId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: status do projeto validado sem envio externo.",
      projectId,
      {},
      "Nao foi possivel atualizar o projeto agora."
    );
  }
}

export async function deleteProject(projectId: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Exclusao simulada no rascunho local/dev. Nada foi removido remotamente.",
        projectId
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel excluir o projeto agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(executionActionResultSchema, "Projeto nao encontrado para este usuario.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Projeto excluido no Supabase com policy owner-only.",
      projectId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: exclusao de projeto nao foi enviada a servico externo.",
      projectId,
      {},
      "Nao foi possivel excluir o projeto agora."
    );
  }
}
