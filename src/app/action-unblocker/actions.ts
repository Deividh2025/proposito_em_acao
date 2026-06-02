"use server";

import { z } from "zod";

import { reviewOwnerPersistenceSafety } from "@/ai/guardrails";
import { actionUnblockerOutputSchema } from "@/ai/schemas";
import { buildActionUnblockerMock } from "@/domain/action-unblocker";
import {
  actionUnblockerActionResultSchema,
  createActionUnblockerSessionInputSchema,
  persistActionUnblockerSessionInputSchema,
  type ActionUnblockerActionResult
} from "@/domain/action-unblocker/persistence";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GENERIC_ACTION_UNBLOCKER_ERROR =
  "Nao foi possivel salvar a sessao do Desbloqueador agora. Tente novamente.";

function localDraft(message: string, output?: unknown, id?: string): ActionUnblockerActionResult {
  return actionUnblockerActionResultSchema.parse({ mode: "local-draft", ok: true, message, id, output });
}

function errorDraft(message: string): ActionUnblockerActionResult {
  return actionUnblockerActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

async function belongsToUser(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: "tasks" | "projects" | "goals" | "calendar_blocks" | "inbox_items",
  id: string,
  userId: string
) {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  return !error && Boolean(data?.id);
}

export async function generateActionUnblockerPlan(input: unknown): Promise<ActionUnblockerActionResult> {
  const parsed = createActionUnblockerSessionInputSchema.parse(input);
  const output = actionUnblockerOutputSchema.parse(buildActionUnblockerMock(parsed));

  return localDraft("Plano mock seguro gerado com revisao obrigatoria.", output);
}

export async function persistActionUnblockerSession(input: unknown): Promise<ActionUnblockerActionResult> {
  const parsed = persistActionUnblockerSessionInputSchema.parse(input);
  const safetyReview = reviewOwnerPersistenceSafety({
    reviewedSchemaVersion: parsed.output.schema_version,
    value: parsed.output
  });

  if (!safetyReview.safe_to_persist) {
    return errorDraft("A resposta do Desbloqueador foi bloqueada pelos guardrails antes de salvar.");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft(
        "Sessao do Desbloqueador mantida como rascunho local/dev. Entre para persistir com RLS owner-only.",
        parsed.output
      );
    }

    const ownershipChecks = [
      parsed.input.taskId ? belongsToUser(supabase, "tasks", parsed.input.taskId, user.id) : true,
      parsed.input.projectId ? belongsToUser(supabase, "projects", parsed.input.projectId, user.id) : true,
      parsed.input.goalId ? belongsToUser(supabase, "goals", parsed.input.goalId, user.id) : true,
      parsed.input.calendarBlockId
        ? belongsToUser(supabase, "calendar_blocks", parsed.input.calendarBlockId, user.id)
        : true,
      parsed.input.inboxItemId ? belongsToUser(supabase, "inbox_items", parsed.input.inboxItemId, user.id) : true
    ];

    const ownershipResults = await Promise.all(ownershipChecks);

    if (ownershipResults.some((result) => result !== true)) {
      return errorDraft("Um dos vinculos informados nao pertence ao usuario autenticado.");
    }

    const { data, error } = await supabase
      .from("action_unblock_sessions")
      .insert({
        user_id: user.id,
        task_id: parsed.input.taskId ?? null,
        related_project_id: parsed.input.projectId ?? null,
        related_goal_id: parsed.input.goalId ?? null,
        calendar_block_id: parsed.input.calendarBlockId ?? null,
        inbox_item_id: parsed.input.inboxItemId ?? null,
        state: parsed.input.taskTitle,
        energy: parsed.input.energyLevel,
        time_available_minutes: parsed.input.availableMinutes,
        obstacle: parsed.input.obstacle ?? null,
        schema_version: parsed.output.schema_version,
        obstacle_type: parsed.output.obstacle_type,
        obstacle_key: parsed.output.obstacle_key,
        first_step: parsed.output.first_step,
        minimum_viable_action: parsed.output.minimum_viable_action,
        recommended_focus_minutes: parsed.output.recommended_focus_minutes,
        next_route: parsed.output.next_route,
        suggest_metacognition: parsed.output.suggest_metacognition,
        reason_to_suggest_metacognition: parsed.output.reason_to_suggest_metacognition,
        crisis_flag: parsed.output.crisis_detected,
        human_help_recommended: parsed.output.human_help_recommended,
        safety_note: parsed.output.safety_note,
        confidence_level: parsed.output.confidence_level,
        user_review_required: parsed.output.user_review_required,
        ai_plan: parsed.output,
        started_focus: false
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft(GENERIC_ACTION_UNBLOCKER_ERROR);
    }

    return actionUnblockerActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Sessao do Desbloqueador salva no Supabase com policy owner-only.",
      id: data.id,
      output: parsed.output
    });
  } catch {
    return localDraft(
      "Sessao do Desbloqueador mantida como rascunho local/dev. Nenhum dado foi enviado para OpenAI.",
      parsed.output
    );
  }
}

export async function markActionUnblockerFocusStarted(input: unknown) {
  const parsed = zActionFocusStartedInput.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return executionActionResultSchema.parse({
        mode: "local-draft",
        ok: true,
        message: "Inicio de foco marcado apenas nesta sessao local/dev.",
        id: parsed.sessionId
      });
    }

    const { data, error } = await supabase
      .from("action_unblock_sessions")
      .update({ started_focus: true })
      .eq("id", parsed.sessionId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error || !data?.id) {
      return executionActionResultSchema.parse({
        mode: "local-draft",
        ok: false,
        message: GENERIC_ACTION_UNBLOCKER_ERROR
      });
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Inicio de foco registrado com filtro de dono.",
      id: parsed.sessionId
    });
  } catch {
    return executionActionResultSchema.parse({
      mode: "local-draft",
      ok: true,
      message: "Inicio de foco marcado apenas nesta sessao local/dev.",
      id: parsed.sessionId
    });
  }
}

const zActionFocusStartedInput = z
  .object({
    sessionId: z.string().trim().min(1)
  })
  .strict();
