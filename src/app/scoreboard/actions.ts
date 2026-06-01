"use server";

import { scoreboardPlanOutputSchema } from "@/ai/schemas";
import {
  buildScoreboardPlanMock,
  createScoreboardInputSchema,
  createScoreboardItemInputSchema,
  generateScoreboardPlanInputSchema,
  markScoreboardItemInputSchema,
  persistScoreboardPlanInputSchema,
  scoreboardActionResultSchema,
  scoreboardStatusValue,
  type BasicScoreboardActionResult,
  type ScoreboardActionResult
} from "@/domain/scoreboard";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): BasicScoreboardActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: true, message, id });
}

function errorDraft(message: string): BasicScoreboardActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

export async function generateScoreboardPlanDraft(input: unknown): Promise<ScoreboardActionResult> {
  const parsed = generateScoreboardPlanInputSchema.parse(input);
  const output = scoreboardPlanOutputSchema.parse(buildScoreboardPlanMock(parsed));

  return scoreboardActionResultSchema.parse({
    mode: "local-draft",
    ok: true,
    message: "Mock seguro sugeriu um Placar revisavel. Nenhuma chamada OpenAI real foi feita.",
    output
  });
}

export async function createScoreboard(input: unknown): Promise<BasicScoreboardActionResult> {
  const parsed = createScoreboardInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Placar criado apenas nesta sessao local/dev.");
    }

    const { data, error } = await supabase
      .from("discipline_scoreboards")
      .insert({
        user_id: user.id,
        title: parsed.title,
        period: parsed.period,
        visibility: "private",
        restart_tracking: true,
        visual_guidance: "Constancia sem vergonha; retomada conta como progresso.",
        user_review_required: true
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft("Nao foi possivel criar o Placar agora.");
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Placar salvo no Supabase como privado por padrao.",
      id: data.id
    });
  } catch {
    return localDraft("Modo local seguro: Placar validado sem persistencia remota.");
  }
}

export async function persistScoreboardPlan(input: unknown): Promise<BasicScoreboardActionResult> {
  const parsed = persistScoreboardPlanInputSchema.parse(input);
  const plan = parsed.output;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Plano de Placar mantido local/dev. Entre para persistir com RLS.");
    }

    const { data: scoreboard, error: scoreboardError } = await supabase
      .from("discipline_scoreboards")
      .insert({
        user_id: user.id,
        title: plan.scoreboard_title,
        period: plan.period,
        visibility: "private",
        restart_tracking: plan.restart_tracking,
        visual_guidance: plan.visual_guidance,
        risk_notes: plan.risk_notes,
        user_review_required: plan.user_review_required
      })
      .select("id")
      .single();

    if (scoreboardError || !scoreboard?.id) {
      return errorDraft("Nao foi possivel salvar o Placar agora.");
    }

    const rows = plan.items.map((item, index) => ({
      user_id: user.id,
      scoreboard_id: scoreboard.id,
      item_type: item.type,
      title: item.title,
      position: index,
      target_frequency: item.target_frequency,
      minimum_success: item.minimum_success,
      linked_goal_id: item.linked_goal_id,
      linked_habit_id: item.linked_habit_id,
      linked_task_id: item.linked_task_id
    }));

    const { error: itemError } = await supabase.from("scoreboard_items").insert(rows);

    if (itemError) {
      return errorDraft("Placar criado, mas os itens nao foram salvos agora.");
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Placar e itens salvos como privados e revisaveis.",
      id: scoreboard.id
    });
  } catch {
    return localDraft("Modo local seguro: plano de Placar validado sem envio externo.");
  }
}

export async function createScoreboardItem(input: unknown): Promise<BasicScoreboardActionResult> {
  const parsed = createScoreboardItemInputSchema.parse(input);

  if (!parsed.scoreboardId) {
    return localDraft("Item de Placar criado local/dev ate existir um Placar salvo.");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Item de Placar criado apenas nesta sessao local/dev.");
    }

    const { data: scoreboard, error: scoreboardError } = await supabase
      .from("discipline_scoreboards")
      .select("id")
      .eq("id", parsed.scoreboardId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (scoreboardError || !scoreboard?.id) {
      return errorDraft("Placar nao encontrado para este usuario.");
    }

    const { data, error } = await supabase
      .from("scoreboard_items")
      .insert({
        user_id: user.id,
        scoreboard_id: parsed.scoreboardId,
        item_type: parsed.type,
        title: parsed.title,
        target_frequency: parsed.targetFrequency,
        minimum_success: parsed.minimumSuccess,
        linked_goal_id: parsed.linkedGoalId ?? null,
        linked_habit_id: parsed.linkedHabitId ?? null,
        linked_task_id: parsed.linkedTaskId ?? null
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft("Nao foi possivel criar o item do Placar agora.");
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Item do Placar salvo com validacao owner-only.",
      id: data.id
    });
  } catch {
    return localDraft("Modo local seguro: item de Placar validado sem persistencia remota.");
  }
}

export async function markScoreboardItem(input: unknown): Promise<BasicScoreboardActionResult> {
  const parsed = markScoreboardItemInputSchema.parse(input);
  const entryDate = parsed.entryDate ?? new Date().toISOString().slice(0, 10);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Marcacao do Placar registrada apenas nesta sessao local/dev.", parsed.itemId);
    }

    const { data: item, error: itemError } = await supabase
      .from("scoreboard_items")
      .select("id, scoreboard_id")
      .eq("id", parsed.itemId)
      .eq("scoreboard_id", parsed.scoreboardId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (itemError || !item?.id) {
      return errorDraft("Item do Placar nao encontrado para este usuario.");
    }

    const { data, error } = await supabase
      .from("scoreboard_entries")
      .upsert(
        {
          user_id: user.id,
          scoreboard_id: parsed.scoreboardId,
          scoreboard_item_id: parsed.itemId,
          entry_date: entryDate,
          status: parsed.status,
          value: scoreboardStatusValue(parsed.status),
          note: parsed.note ?? null
        },
        { onConflict: "user_id,scoreboard_item_id,entry_date" }
      )
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft("Nao foi possivel marcar o Placar agora.");
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Placar marcado com idempotencia por item e data.",
      id: data.id
    });
  } catch {
    return localDraft("Modo local seguro: marcacao do Placar validada sem envio externo.", parsed.itemId);
  }
}
