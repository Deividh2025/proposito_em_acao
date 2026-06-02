"use server";

import {
  buildGardenStateFromWeeklyReview,
  buildWeeklyReviewMock,
  createWeeklyReviewInputSchema,
  persistWeeklyReviewInputSchema,
  sanitizeWeeklyReviewAnswersForPersistence,
  weeklyReviewActionResultSchema,
  type BasicWeeklyReviewActionResult,
  type WeeklyReviewActionResult
} from "@/domain/review";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import { gardenEventInputSchema } from "@/domain/garden";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): BasicWeeklyReviewActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: true, message, id });
}

function errorDraft(message: string): BasicWeeklyReviewActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

export async function generateWeeklyReviewDraft(input: unknown): Promise<WeeklyReviewActionResult> {
  const parsed = createWeeklyReviewInputSchema.parse(input);
  const output = buildWeeklyReviewMock(parsed);
  const garden = buildGardenStateFromWeeklyReview(output);

  return weeklyReviewActionResultSchema.parse({
    mode: "local-draft",
    ok: true,
    message: "Mock seguro gerou uma revisao estruturada. Nenhuma chamada OpenAI real foi feita.",
    output,
    garden
  });
}

export async function persistWeeklyReview(input: unknown): Promise<BasicWeeklyReviewActionResult> {
  const parsed = persistWeeklyReviewInputSchema.parse(input);
  const safeAnswers = sanitizeWeeklyReviewAnswersForPersistence(parsed.answers);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Revisao mantida local/dev. Entre para persistir com RLS.");
    }

    const { data: review, error: reviewError } = await supabase
      .from("weekly_reviews")
      .upsert(
        {
          user_id: user.id,
          week_start: parsed.weekStart,
          week_end: parsed.weekEnd,
          answers: safeAnswers,
          ai_summary: parsed.output.week_summary,
          patterns: parsed.output.patterns,
          next_week_focus: parsed.output.next_week_focus,
          privacy_level: "private",
          schema_version: parsed.output.schema_version,
          wins: parsed.output.wins,
          stuck_points: parsed.output.stuck_points,
          adjustments: parsed.output.recommended_actions,
          overload_warning: parsed.output.overload_alerts.length > 0,
          user_review_required: parsed.output.user_review_required,
          completed_at: new Date().toISOString()
        },
        { onConflict: "user_id,week_start" }
      )
      .select("id")
      .single();

    if (reviewError || !review?.id) {
      return errorDraft("Nao foi possivel salvar a Revisao Semanal agora.");
    }

    const { data: garden, error: gardenError } = await supabase
      .from("garden_states")
      .upsert(
        {
          user_id: user.id,
          schema_version: parsed.garden.schema_version,
          area_states: parsed.garden.garden_state.life_areas,
          unlocked_items: parsed.garden.garden_state.unlocked_items,
          weekly_growth_summary: parsed.garden.garden_state.weekly_growth_summary,
          derived_from_weekly_review_id: review.id,
          derived_at: new Date().toISOString(),
          privacy_level: "private"
        },
        { onConflict: "user_id" }
      )
      .select("id")
      .single();

    if (gardenError || !garden?.id) {
      return errorDraft("Revisao salva, mas o Jardim nao foi atualizado agora.");
    }

    const gardenEvent = gardenEventInputSchema.parse({
      area: "Revisao semanal",
      eventType: "weekly_review_completed",
      impact: 4,
      metadataMinimal: {
        label: "revisao semanal concluida",
        areas: parsed.garden.garden_state.life_areas.length
      },
      sourceId: review.id,
      sourceType: "weekly_review"
    });

    await supabase.from("garden_events").insert({
      user_id: user.id,
      garden_state_id: garden.id,
      weekly_review_id: review.id,
      event_type: gardenEvent.eventType,
      source_type: gardenEvent.sourceType,
      source_id: gardenEvent.sourceId,
      impact: gardenEvent.impact,
      metadata_minimal: gardenEvent.metadataMinimal
    });

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Revisao e Jardim salvos como privados por padrao.",
      id: review.id
    });
  } catch {
    return localDraft("Modo local seguro: revisao validada sem persistencia remota.");
  }
}
