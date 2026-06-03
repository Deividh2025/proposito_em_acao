"use server";

import {
  captureFocusDistractionInputSchema,
  completeFocusSessionInputSchema,
  focusActionResultSchema,
  interruptFocusSessionInputSchema,
  startFocusSessionInputSchema,
  type FocusActionResult
} from "@/domain/focus";
import {
  missingSessionResult,
  noAffectedRowResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult
} from "@/domain/execution/action-results";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function errorDraft(message: string): FocusActionResult {
  return realServiceErrorResult(focusActionResultSchema, message);
}

export async function startFocusSession(input: unknown): Promise<FocusActionResult> {
  const inputResult = safeParseActionInput(startFocusSessionInputSchema, input, focusActionResultSchema);

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
        focusActionResultSchema,
        "Sessao de foco iniciada nesta sessao local/dev. Entre para persistir com RLS."
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
      const { data: taskUpdate, error: taskUpdateError } = await supabase
        .from("tasks")
        .update({ status: "in_focus" })
        .eq("id", parsed.taskId)
        .eq("user_id", user.id)
        .select("id")
        .maybeSingle();

      if (taskUpdateError || !taskUpdate?.id) {
        return realServiceErrorResult(focusActionResultSchema, "Sessao criada, mas a tarefa nao entrou em foco.");
      }
    }

    return supabaseSuccessResult(
      focusActionResultSchema,
      "Sessao de foco salva no Supabase com policy owner-only.",
      data.id
    );
  } catch {
    return persistenceCatchResult(
      focusActionResultSchema,
      "Modo local seguro: foco iniciado sem enviar dados a servico externo.",
      undefined,
      {},
      "Nao foi possivel iniciar a sessao de foco agora."
    );
  }
}

export async function captureFocusDistraction(input: unknown): Promise<FocusActionResult> {
  const inputResult = safeParseActionInput(captureFocusDistractionInputSchema, input, focusActionResultSchema);

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
      return missingSessionResult(focusActionResultSchema, "Distracao capturada apenas nesta sessao local/dev.");
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
      const { data: inboxItem, error: inboxError } = await supabase
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

      if (inboxError || !inboxItem?.id) {
        return realServiceErrorResult(focusActionResultSchema, "Nao foi possivel encaminhar a distracao para a Inbox.");
      }

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

    return supabaseSuccessResult(
      focusActionResultSchema,
      parsed.routeToInbox
        ? "Distracao salva e encaminhada para a Inbox com RLS owner-only."
        : "Distracao salva na sessao de foco com RLS owner-only.",
      parsed.sessionId,
      { distractionId: data.id }
    );
  } catch {
    return persistenceCatchResult(
      focusActionResultSchema,
      "Modo local seguro: distracao registrada sem log externo.",
      undefined,
      {},
      "Nao foi possivel registrar a distracao agora."
    );
  }
}

export async function completeFocusSession(input: unknown): Promise<FocusActionResult> {
  const inputResult = safeParseActionInput(completeFocusSessionInputSchema, input, focusActionResultSchema);

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
        focusActionResultSchema,
        "Sessao concluida nesta sessao local/dev. Placar real exige Auth/Supabase."
      );
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
      const { data: taskUpdate, error: taskUpdateError } = await supabase
        .from("tasks")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", parsed.taskId)
        .eq("user_id", user.id)
        .select("id")
        .maybeSingle();

      if (taskUpdateError || !taskUpdate?.id) {
        return realServiceErrorResult(focusActionResultSchema, "Sessao concluida, mas a tarefa nao foi atualizada.");
      }
    }

    if (parsed.calendarBlockId) {
      const { data: blockUpdate, error: blockUpdateError } = await supabase
        .from("calendar_blocks")
        .update({ status: "completed" })
        .eq("id", parsed.calendarBlockId)
        .eq("user_id", user.id)
        .select("id")
        .maybeSingle();

      if (blockUpdateError || !blockUpdate?.id) {
        return realServiceErrorResult(
          focusActionResultSchema,
          "Sessao concluida, mas o bloco de calendario nao foi atualizado."
        );
      }
    }

    return supabaseSuccessResult(
      focusActionResultSchema,
      "Sessao de foco concluida com filtros de dono.",
      parsed.sessionId
    );
  } catch {
    return persistenceCatchResult(
      focusActionResultSchema,
      "Modo local seguro: conclusao de foco validada sem persistencia remota.",
      parsed.sessionId,
      {},
      "Nao foi possivel concluir a sessao de foco agora."
    );
  }
}

export async function interruptFocusSession(input: unknown): Promise<FocusActionResult> {
  const inputResult = safeParseActionInput(interruptFocusSessionInputSchema, input, focusActionResultSchema);

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
        focusActionResultSchema,
        "Sessao pausada/interrompida apenas nesta sessao local/dev.",
        parsed.sessionId
      );
    }

    const { data, error } = await supabase
      .from("focus_sessions")
      .update({
        status: parsed.status,
        ended_at: new Date().toISOString(),
        completion_note: parsed.completionNote ?? null
      })
      .eq("id", parsed.sessionId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return realServiceErrorResult(focusActionResultSchema, "Nao foi possivel atualizar a sessao de foco agora.");
    }

    if (!data?.id) {
      return noAffectedRowResult(focusActionResultSchema, "Sessao de foco nao encontrada para este usuario.");
    }

    return supabaseSuccessResult(focusActionResultSchema, "Sessao atualizada sem punir a retomada.", parsed.sessionId);
  } catch {
    return persistenceCatchResult(
      focusActionResultSchema,
      "Modo local seguro: pausa/interrupcao validada sem envio externo.",
      parsed.sessionId,
      {},
      "Nao foi possivel atualizar a sessao de foco agora."
    );
  }
}
