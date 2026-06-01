"use server";

import {
  createCalendarBlockInputSchema,
  deleteCalendarBlockInputSchema,
  updateCalendarBlockInputSchema,
  type CalendarActionResult
} from "@/domain/calendar/persistence";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): CalendarActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: true, message, id });
}

function errorDraft(message: string): CalendarActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

const GENERIC_CALENDAR_ERROR = "Nao foi possivel concluir a acao no calendario agora. Tente novamente.";

export async function createCalendarBlock(input: unknown): Promise<CalendarActionResult> {
  const parsed = createCalendarBlockInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Bloco criado nesta sessão local/dev. Entre para persistir com RLS owner-only.");
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

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Bloco salvo no Supabase com policy owner-only.",
      id: data?.id
    });
  } catch {
    return localDraft("Bloco criado nesta sessão local/dev. Nenhum dado foi enviado para servico externo.");
  }
}

export async function updateCalendarBlock(input: unknown): Promise<CalendarActionResult> {
  const parsed = updateCalendarBlockInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Bloco reagendado sem culpa.", parsed.blockId);
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

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Bloco atualizado com filtro de dono.",
      id: parsed.blockId
    });
  } catch {
    return localDraft("Bloco reagendado sem culpa.", parsed.blockId);
  }
}

export async function deleteCalendarBlock(input: unknown): Promise<CalendarActionResult> {
  const parsed = deleteCalendarBlockInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Cancelamento simulado nesta sessao local/dev.", parsed.blockId);
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

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Bloco cancelado no Supabase com policy owner-only.",
      id: parsed.blockId
    });
  } catch {
    return localDraft("Cancelamento simulado nesta sessao local/dev.", parsed.blockId);
  }
}
