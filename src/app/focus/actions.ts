"use server";

import {
  captureFocusDistractionInputSchema,
  completeFocusSessionInputSchema,
  focusActionResultSchema,
  interruptFocusSessionInputSchema,
  startFocusSessionInputSchema,
  type FocusActionResult
} from "@/domain/focus";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): FocusActionResult {
  return focusActionResultSchema.parse({ mode: "local-draft", ok: true, message, id });
}

function errorDraft(message: string): FocusActionResult {
  return focusActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

export async function startFocusSession(input: unknown): Promise<FocusActionResult> {
  const parsed = startFocusSessionInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Sessao de foco iniciada nesta sessao local/dev. Entre para persistir com RLS.");
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

    if (parsed.calendarBlockId) {
      const { data: block, error: blockError } = await supabase
        .from("calendar_blocks")
        .select("id")
        .eq("id", parsed.calendarBlockId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (blockError || !block?.id) {
        return errorDraft("O bloco de calendario escolhido nao pertence ao usuario autenticado.");
      }
    }

    const { data, error } = await supabase
      .from("focus_sessions")
      .insert({
        user_id: user.id,
        task_id: parsed.taskId ?? null,
        calendar_block_id: parsed.calendarBlockId ?? null,
        action_unblock_session_id: parsed.actionUnblockerSessionId ?? null,
        duration_minutes: parsed.durationMinutes,
        status: "active"
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft("Nao foi possivel iniciar a sessao de foco agora.");
    }

    if (parsed.taskId) {
      await supabase.from("tasks").update({ status: "in_focus" }).eq("id", parsed.taskId).eq("user_id", user.id);
    }

    return focusActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Sessao de foco salva no Supabase com policy owner-only.",
      id: data.id
    });
  } catch {
    return localDraft("Modo local seguro: foco iniciado sem enviar dados a servico externo.");
  }
}

export async function captureFocusDistraction(input: unknown): Promise<FocusActionResult> {
  const parsed = captureFocusDistractionInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Distracao capturada apenas nesta sessao local/dev.");
    }

    const { data: session, error: sessionError } = await supabase
      .from("focus_sessions")
      .select("id")
      .eq("id", parsed.sessionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (sessionError || !session?.id) {
      return errorDraft("Sessao de foco nao encontrada para este usuario.");
    }

    let inboxItemId: string | null = null;

    if (parsed.routeToInbox) {
      const { data: inboxItem } = await supabase
        .from("inbox_items")
        .insert({
          user_id: user.id,
          content: parsed.content,
          content_type: parsed.type === "link" ? "link" : "text",
          status: "captured",
          classification: parsed.type === "parallel_task" ? "task" : "future_idea"
        })
        .select("id")
        .maybeSingle();

      inboxItemId = typeof inboxItem?.id === "string" ? inboxItem.id : null;
    }

    const { data, error } = await supabase
      .from("focus_distractions")
      .insert({
        user_id: user.id,
        focus_session_id: parsed.sessionId,
        distraction_type: parsed.type,
        content: parsed.content,
        routed_to_inbox: parsed.routeToInbox,
        routed_to_inbox_item_id: inboxItemId
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft("Nao foi possivel registrar a distracao agora.");
    }

    return focusActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: parsed.routeToInbox
        ? "Distracao salva e encaminhada para a Inbox com RLS owner-only."
        : "Distracao salva na sessao de foco com RLS owner-only.",
      id: parsed.sessionId,
      distractionId: data.id
    });
  } catch {
    return localDraft("Modo local seguro: distracao registrada sem log externo.");
  }
}

export async function completeFocusSession(input: unknown): Promise<FocusActionResult> {
  const parsed = completeFocusSessionInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Sessao concluida nesta sessao local/dev. Placar real exige Auth/Supabase.");
    }

    const { data, error } = await supabase
      .from("focus_sessions")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
        completion_note: parsed.completionNote ?? null,
        post_energy_level: parsed.postEnergyLevel ?? null
      })
      .eq("id", parsed.sessionId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error || !data?.id) {
      return errorDraft("Sessao de foco nao encontrada para este usuario.");
    }

    if (parsed.completeTask && parsed.taskId) {
      await supabase
        .from("tasks")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", parsed.taskId)
        .eq("user_id", user.id);
    }

    if (parsed.calendarBlockId) {
      await supabase
        .from("calendar_blocks")
        .update({ status: "completed" })
        .eq("id", parsed.calendarBlockId)
        .eq("user_id", user.id);
    }

    return focusActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Sessao de foco concluida com filtros de dono.",
      id: parsed.sessionId
    });
  } catch {
    return localDraft("Modo local seguro: conclusao de foco validada sem persistencia remota.", parsed.sessionId);
  }
}

export async function interruptFocusSession(input: unknown): Promise<FocusActionResult> {
  const parsed = interruptFocusSessionInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Sessao pausada/interrompida apenas nesta sessao local/dev.", parsed.sessionId);
    }

    const { error } = await supabase
      .from("focus_sessions")
      .update({
        status: parsed.status,
        ended_at: new Date().toISOString(),
        completion_note: parsed.completionNote ?? null
      })
      .eq("id", parsed.sessionId)
      .eq("user_id", user.id);

    if (error) {
      return errorDraft("Nao foi possivel atualizar a sessao de foco agora.");
    }

    return focusActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Sessao atualizada sem punir a retomada.",
      id: parsed.sessionId
    });
  } catch {
    return localDraft("Modo local seguro: pausa/interrupcao validada sem envio externo.", parsed.sessionId);
  }
}
