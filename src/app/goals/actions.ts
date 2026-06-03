"use server";

import { buildSmartGoalMockDraft } from "@/domain/goals";
import {
  createManualGoalInputSchema,
  createSmartGoalDraftInputSchema,
  executionActionResultSchema,
  persistSmartGoalInputSchema,
  type ExecutionActionResult
} from "@/domain/execution/persistence";
import {
  missingSessionResult,
  noAffectedRowResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult
} from "@/domain/execution/action-results";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function generateSmartGoalDraft(input: unknown) {
  const parsed = createSmartGoalDraftInputSchema.parse(input);
  return buildSmartGoalMockDraft(parsed);
}

export async function createManualGoal(input: unknown): Promise<ExecutionActionResult> {
  const inputResult = safeParseActionInput(createManualGoalInputSchema, input, executionActionResultSchema);

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
        "Alvo mantido como rascunho local/dev. Entre para persistir com RLS owner-only."
      );
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
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel salvar o alvo agora.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Alvo salvo no Supabase com policy owner-only.",
      data?.id
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: Supabase/Auth nao esta configurado. Nenhum dado saiu desta sessao.",
      undefined,
      {},
      "Nao foi possivel salvar o alvo agora."
    );
  }
}

export async function persistSmartGoalDraft(input: unknown): Promise<ExecutionActionResult> {
  const inputResult = safeParseActionInput(persistSmartGoalInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;
  const goal = parsed.output;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Alvo SMART-E gerado por mock mantido como rascunho local/dev."
      );
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
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel salvar o alvo SMART-E agora.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Alvo SMART-E salvo no Supabase apos revisao do usuario.",
      data?.id
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: mock SMART-E validado, sem chamada OpenAI e sem envio externo.",
      undefined,
      {},
      "Nao foi possivel salvar o alvo SMART-E agora."
    );
  }
}

export async function updateGoalStatus(goalId: string, status: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(executionActionResultSchema, "Status do alvo atualizado apenas no rascunho local/dev.");
    }

    const { data, error } = await supabase
      .from("goals")
      .update({ status })
      .eq("id", goalId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel atualizar o alvo agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(executionActionResultSchema, "Alvo nao encontrado para este usuario.");
    }

    return supabaseSuccessResult(executionActionResultSchema, "Status do alvo atualizado com filtro de dono.", goalId);
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: status do alvo validado sem envio externo.",
      goalId,
      {},
      "Nao foi possivel atualizar o alvo agora."
    );
  }
}

export async function deleteGoal(goalId: string): Promise<ExecutionActionResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Exclusao simulada no rascunho local/dev. Nada foi removido remotamente.",
        goalId
      );
    }

    const { data, error } = await supabase
      .from("goals")
      .delete()
      .eq("id", goalId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel excluir o alvo agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(executionActionResultSchema, "Alvo nao encontrado para este usuario.");
    }

    return supabaseSuccessResult(executionActionResultSchema, "Alvo excluido no Supabase com policy owner-only.", goalId);
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: exclusao de alvo nao foi enviada a servico externo.",
      goalId,
      {},
      "Nao foi possivel excluir o alvo agora."
    );
  }
}
