"use server";

import { buildSmartGoalMockDraft } from "@/domain/goals";
import {
  createManualGoalInputSchema,
  createSmartGoalDraftInputSchema,
  executionActionResultSchema,
  persistSmartGoalInputSchema,
  type ExecutionActionResult
} from "@/domain/execution/persistence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): ExecutionActionResult {
  return executionActionResultSchema.parse({
    mode: "local-draft",
    ok: true,
    message,
    id
  });
}

function errorDraft(message: string): ExecutionActionResult {
  return executionActionResultSchema.parse({
    mode: "local-draft",
    ok: false,
    message
  });
}

export async function generateSmartGoalDraft(input: unknown) {
  const parsed = createSmartGoalDraftInputSchema.parse(input);
  return buildSmartGoalMockDraft(parsed);
}

export async function createManualGoal(input: unknown): Promise<ExecutionActionResult> {
  const parsed = createManualGoalInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Alvo mantido como rascunho local/dev. Entre para persistir com RLS owner-only.");
    }

    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        title: parsed.title,
        status: parsed.status,
        specific: parsed.specific,
        measurable: parsed.measurable,
        achievable: parsed.achievable,
        relevant: parsed.relevant,
        ecological_analysis: {
          risks: [],
          protected_areas: ["fe", "saude", "familia", "descanso", "financas"],
          adjustments: [],
          is_ecologically_safe: true
        },
        next_action: parsed.firstAction,
        description: `Area da vida: ${parsed.lifeArea}. Prazo: ${parsed.timebound}.`
      })
      .select("id")
      .single();

    if (error) {
      return errorDraft(`Nao foi possivel salvar o alvo no Supabase: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Alvo salvo no Supabase com policy owner-only.",
      id: data?.id
    });
  } catch {
    return localDraft("Modo local seguro: Supabase/Auth nao esta configurado. Nenhum dado saiu desta sessao.");
  }
}

export async function persistSmartGoalDraft(input: unknown): Promise<ExecutionActionResult> {
  const parsed = persistSmartGoalInputSchema.parse(input);
  const goal = parsed.output;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Alvo SMART-E gerado por mock mantido como rascunho local/dev.");
    }

    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        title: goal.title,
        status: goal.status,
        specific: goal.specific,
        measurable: goal.measurable,
        achievable: goal.achievable,
        relevant: goal.relevant,
        ecological_analysis: goal.ecological_analysis,
        next_action: goal.first_action,
        description: `Area da vida: ${goal.life_area}. ${goal.calling_alignment.explanation}`
      })
      .select("id")
      .single();

    if (error) {
      return errorDraft(`Nao foi possivel salvar o alvo SMART-E: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Alvo SMART-E salvo no Supabase apos revisao do usuario.",
      id: data?.id
    });
  } catch {
    return localDraft("Modo local seguro: mock SMART-E validado, sem chamada OpenAI e sem envio externo.");
  }
}

export async function updateGoalStatus(goalId: string, status: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Status do alvo atualizado apenas no rascunho local/dev.");
    }

    const { error } = await supabase
      .from("goals")
      .update({ status })
      .eq("id", goalId)
      .eq("user_id", user.id);

    if (error) {
      return errorDraft(`Nao foi possivel atualizar o alvo: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Status do alvo atualizado com filtro de dono.",
      id: goalId
    });
  } catch {
    return localDraft("Modo local seguro: status do alvo validado sem envio externo.", goalId);
  }
}

export async function deleteGoal(goalId: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Exclusao simulada no rascunho local/dev. Nada foi removido remotamente.", goalId);
    }

    const { error } = await supabase.from("goals").delete().eq("id", goalId).eq("user_id", user.id);

    if (error) {
      return errorDraft(`Nao foi possivel excluir o alvo: ${error.message}`);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Alvo excluido no Supabase com policy owner-only.",
      id: goalId
    });
  } catch {
    return localDraft("Modo local seguro: exclusao de alvo nao foi enviada a servico externo.", goalId);
  }
}
