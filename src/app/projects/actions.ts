"use server";

import { buildProjectPlanMock } from "@/domain/projects";
import {
  createProjectFromGoalInputSchema,
  executionActionResultSchema,
  persistProjectPlanInputSchema,
  type ExecutionActionResult
} from "@/domain/execution/persistence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): ExecutionActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: true, message, id });
}

function errorDraft(message: string): ExecutionActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

export async function generateProjectPlanDraft(input: unknown) {
  const parsed = createProjectFromGoalInputSchema.parse(input);
  return buildProjectPlanMock(parsed);
}

export async function persistProjectPlan(input: unknown): Promise<ExecutionActionResult> {
  const parsed = persistProjectPlanInputSchema.parse(input);
  const project = parsed.output.projects[0];

  if (!project) {
    return errorDraft("O plano de projeto nao trouxe nenhum projeto revisavel.");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Plano de projeto mantido como rascunho local/dev. Entre para persistir com RLS.");
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
      return errorDraft(`Nao foi possivel salvar o projeto: ${projectError?.message ?? "id ausente"}`);
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
        return errorDraft(`Projeto salvo, mas tarefas iniciais falharam: ${taskError.message}`);
      }
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Projeto e tarefas iniciais salvos no Supabase com RLS owner-only.",
      id: projectRow.id
    });
  } catch {
    return localDraft("Modo local seguro: plano de projeto validado sem persistencia remota.");
  }
}

export async function updateProjectStatus(projectId: string, status: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Status do projeto atualizado apenas no rascunho local/dev.", projectId);
    }

    const { error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", projectId)
      .eq("user_id", user.id);

    if (error) {
      return errorDraft(`Nao foi possivel atualizar o projeto: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Status do projeto atualizado com filtro de dono.",
      id: projectId
    });
  } catch {
    return localDraft("Modo local seguro: status do projeto validado sem envio externo.", projectId);
  }
}

export async function deleteProject(projectId: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Exclusao simulada no rascunho local/dev. Nada foi removido remotamente.", projectId);
    }

    const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", user.id);

    if (error) {
      return errorDraft(`Nao foi possivel excluir o projeto: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Projeto excluido no Supabase com policy owner-only.",
      id: projectId
    });
  } catch {
    return localDraft("Modo local seguro: exclusao de projeto nao foi enviada a servico externo.", projectId);
  }
}
