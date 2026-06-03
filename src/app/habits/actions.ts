"use server";

import { habitPlanOutputSchema } from "@/ai/schemas";
import {
  buildHabitPlanMock,
  createHabitPlanInputSchema,
  habitActionResultSchema,
  logHabitInputSchema,
  persistHabitPlanInputSchema,
  updateHabitStatusInputSchema,
  type BasicHabitActionResult,
  type HabitActionResult
} from "@/domain/habits";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import {
  missingSessionResult,
  noAffectedRowResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult
} from "@/domain/execution/action-results";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function errorDraft(message: string): BasicHabitActionResult {
  return realServiceErrorResult(executionActionResultSchema, message);
}

export async function generateHabitPlanDraft(input: unknown): Promise<HabitActionResult> {
  const parsed = createHabitPlanInputSchema.parse(input);
  const output = habitPlanOutputSchema.parse(buildHabitPlanMock(parsed));

  return habitActionResultSchema.parse({
    mode: "local-draft",
    ok: true,
    message: "Mock seguro gerou um plano de habito revisavel. Nenhuma chamada OpenAI real foi feita.",
    output
  });
}

export async function persistHabitPlan(input: unknown): Promise<BasicHabitActionResult> {
  const inputResult = safeParseActionInput(persistHabitPlanInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;
  const habit = parsed.output;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Habito mantido como rascunho local/dev. Entre para persistir com RLS."
      );
    }

    if (parsed.linkedGoalId) {
      const { data: goal, error: goalError } = await supabase
        .from("goals")
        .select("id")
        .eq("id", parsed.linkedGoalId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (goalError || !goal?.id) {
        return errorDraft("O alvo vinculado nao pertence ao usuario autenticado.");
      }
    }

    const { data, error } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        goal_id: parsed.linkedGoalId ?? null,
        schema_version: habit.schema_version,
        title: habit.habit_title,
        identity: habit.identity_statement,
        identity_statement: habit.identity_statement,
        why_it_matters: habit.why_it_matters,
        life_area: habit.life_area,
        trigger: habit.trigger,
        minimum_version: habit.minimum_version,
        ideal_version: habit.ideal_version,
        frequency: { type: habit.frequency, suggestion: habit.schedule_suggestion },
        schedule_suggestion: habit.schedule_suggestion,
        reward: habit.reward,
        likely_obstacle: habit.likely_obstacle,
        if_then_plan: habit.if_then_plan,
        environment_design: habit.environment_design,
        metric: habit.metric,
        restart_plan: habit.restart_plan,
        risk_of_overload: habit.risk_of_overload,
        adjustments: habit.adjustments,
        scoreboard_items: habit.scoreboard_items,
        user_review_required: habit.user_review_required,
        status: "active"
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft("Nao foi possivel salvar o habito no Supabase agora.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Habito salvo no Supabase apos revisao do usuario.",
      data.id
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: plano de habito validado sem envio externo.",
      undefined,
      {},
      "Nao foi possivel salvar o habito no Supabase agora."
    );
  }
}

export async function logHabit(input: unknown): Promise<BasicHabitActionResult> {
  const inputResult = safeParseActionInput(logHabitInputSchema, input, executionActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;
  const logDate = parsed.logDate ?? new Date().toISOString().slice(0, 10);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        executionActionResultSchema,
        "Marcacao de habito registrada apenas nesta sessao local/dev.",
        parsed.habitId
      );
    }

    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .select("id")
      .eq("id", parsed.habitId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (habitError || !habit?.id) {
      return errorDraft("Habito nao encontrado para este usuario.");
    }

    const { data, error } = await supabase
      .from("habit_logs")
      .upsert(
        {
          user_id: user.id,
          habit_id: parsed.habitId,
          log_date: logDate,
          status: parsed.status,
          notes: parsed.notes ?? null
        },
        { onConflict: "habit_id,log_date" }
      )
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft("Nao foi possivel marcar o habito agora.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Habito marcado com RLS owner-only. Retomada conta como progresso.",
      data.id
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: marcacao de habito validada sem persistencia remota.",
      parsed.habitId,
      {},
      "Nao foi possivel marcar o habito agora."
    );
  }
}

export async function updateHabitStatus(input: unknown): Promise<BasicHabitActionResult> {
  const inputResult = safeParseActionInput(updateHabitStatusInputSchema, input, executionActionResultSchema);

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
        "Status do habito atualizado apenas nesta sessao local/dev.",
        parsed.habitId
      );
    }

    const { data, error } = await supabase
      .from("habits")
      .update({ status: parsed.status })
      .eq("id", parsed.habitId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return realServiceErrorResult(executionActionResultSchema, "Nao foi possivel atualizar o habito agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(executionActionResultSchema, "Habito nao encontrado para este usuario.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Status do habito atualizado com filtro de dono.",
      parsed.habitId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Modo local seguro: pausa/retomada de habito validada localmente.",
      parsed.habitId,
      {},
      "Nao foi possivel atualizar o habito agora."
    );
  }
}
