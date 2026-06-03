"use server";

import {
  createCalendarBlockInputSchema,
  deleteCalendarBlockInputSchema,
  updateCalendarBlockInputSchema,
  type CalendarActionResult
} from "@/domain/calendar/persistence";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import {
  missingSessionResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult
} from "@/domain/execution/action-results";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function errorDraft(message: string): CalendarActionResult {
  return realServiceErrorResult(executionActionResultSchema, message);
}

const GENERIC_CALENDAR_ERROR = "Nao foi possivel concluir a acao no calendario agora. Tente novamente.";

export async function createCalendarBlock(input: unknown): Promise<CalendarActionResult> {
  const inputResult = safeParseActionInput(createCalendarBlockInputSchema, input, executionActionResultSchema);

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
        "Bloco criado nesta sessão local/dev. Entre para persistir com RLS owner-only."
      );
    }

    if (parsed.taskId) {
      const { data: task, error: taskError } = await supabase
        .from("tasks")
        .select("id")
        .eq("id", parsed.taskId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (taskError || !task?.id) {
        return errorDraft("A tarefa escolhida nao pertence ao usuario autenticado.");
      }
    }

    const { data, error } = await supabase
      .from("calendar_blocks")
      .insert({
        user_id: user.id,
        task_id: parsed.taskId ?? null,
        block_type: parsed.type,
        title: parsed.title,
        start_time: parsed.startTime,
        end_time: parsed.endTime,
        status: "scheduled",
        notes: parsed.notes ?? null
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft(GENERIC_CALENDAR_ERROR);
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Bloco salvo no Supabase com policy owner-only.",
      data.id
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Bloco criado nesta sessão local/dev. Nenhum dado foi enviado para servico externo.",
      undefined,
      {},
      GENERIC_CALENDAR_ERROR
    );
  }
}

export async function updateCalendarBlock(input: unknown): Promise<CalendarActionResult> {
  const inputResult = safeParseActionInput(updateCalendarBlockInputSchema, input, executionActionResultSchema);

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
      return missingSessionResult(executionActionResultSchema, "Bloco reagendado sem culpa.", parsed.blockId);
    }

    const { data, error } = await supabase
      .from("calendar_blocks")
      .update({
        title: parsed.title,
        block_type: parsed.type,
        start_time: parsed.startTime,
        end_time: parsed.endTime,
        status: parsed.status,
        notes: parsed.notes
      })
      .eq("id", parsed.blockId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return errorDraft(GENERIC_CALENDAR_ERROR);
    }

    if (!data?.id) {
      return errorDraft("Bloco nao encontrado para este usuario.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Bloco atualizado com filtro de dono.",
      parsed.blockId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Bloco reagendado sem culpa.",
      parsed.blockId,
      {},
      GENERIC_CALENDAR_ERROR
    );
  }
}

export async function deleteCalendarBlock(input: unknown): Promise<CalendarActionResult> {
  const inputResult = safeParseActionInput(deleteCalendarBlockInputSchema, input, executionActionResultSchema);

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
        "Cancelamento simulado nesta sessao local/dev.",
        parsed.blockId
      );
    }

    const { data, error } = await supabase
      .from("calendar_blocks")
      .delete()
      .eq("id", parsed.blockId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return errorDraft(GENERIC_CALENDAR_ERROR);
    }

    if (!data?.id) {
      return errorDraft("Bloco nao encontrado para este usuario.");
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Bloco cancelado no Supabase com policy owner-only.",
      parsed.blockId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Cancelamento simulado nesta sessao local/dev.",
      parsed.blockId,
      {},
      GENERIC_CALENDAR_ERROR
    );
  }
}
