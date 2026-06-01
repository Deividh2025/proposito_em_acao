"use server";

import { inboxClassificationOutputSchema } from "@/ai/schemas";
import {
  buildInboxClassificationMock,
  processInboxItem as processInboxItemDomain,
  type InboxDestinationType
} from "@/domain/inbox";
import {
  captureInboxItemInputSchema,
  classifyInboxItemInputSchema,
  inboxActionResultSchema,
  processInboxItemInputSchema,
  type BasicInboxActionResult,
  type InboxActionResult
} from "@/domain/inbox/persistence";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): BasicInboxActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: true, message, id });
}

function errorDraft(message: string): BasicInboxActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

const GENERIC_INBOX_ERROR = "Nao foi possivel concluir a acao da inbox agora. Tente novamente.";

function isProcessableInboxStatus(status: string | null | undefined) {
  return status === "captured" || status === "triaged";
}

function passiveDestinationAcceptsNoExternalId(destinationType: InboxDestinationType) {
  return (
    destinationType === "reference" ||
    destinationType === "future_idea" ||
    destinationType === "discard" ||
    destinationType === "needs_clarification"
  );
}

async function destinationBelongsToUser(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  destinationType: InboxDestinationType,
  destinationId: string,
  userId: string
) {
  if (destinationType === "task") {
    const { data, error } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", destinationId)
      .eq("user_id", userId)
      .maybeSingle();
    return !error && Boolean(data?.id);
  }

  if (destinationType === "project") {
    const { data, error } = await supabase
      .from("projects")
      .select("id")
      .eq("id", destinationId)
      .eq("user_id", userId)
      .maybeSingle();
    return !error && Boolean(data?.id);
  }

  if (destinationType === "calendar_event") {
    const { data, error } = await supabase
      .from("calendar_blocks")
      .select("id")
      .eq("id", destinationId)
      .eq("user_id", userId)
      .maybeSingle();
    return !error && Boolean(data?.id);
  }

  if (destinationType === "habit") {
    const { data, error } = await supabase
      .from("habits")
      .select("id")
      .eq("id", destinationId)
      .eq("user_id", userId)
      .maybeSingle();
    return !error && Boolean(data?.id);
  }

  return passiveDestinationAcceptsNoExternalId(destinationType);
}

export async function captureInboxItem(input: unknown): Promise<BasicInboxActionResult> {
  const parsed = captureInboxItemInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Item capturado nesta sessão local/dev. Entre para persistir com RLS.");
    }

    const { data, error } = await supabase
      .from("inbox_items")
      .insert({
        user_id: user.id,
        content: parsed.content,
        content_type: parsed.contentType,
        status: "captured",
        ai_classification: {}
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft(GENERIC_INBOX_ERROR);
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Item capturado no Supabase com policy owner-only.",
      id: data?.id
    });
  } catch {
    return localDraft("Item capturado nesta sessão local/dev. Nenhum dado foi enviado para OpenAI.");
  }
}

export async function classifyInboxItem(input: unknown): Promise<InboxActionResult> {
  const parsed = classifyInboxItemInputSchema.parse(input);
  const classification = inboxClassificationOutputSchema.parse(buildInboxClassificationMock(parsed.content));

  return inboxActionResultSchema.parse({
    mode: "local-draft",
    ok: true,
    message: "Classificação mock gerada com revisão obrigatória.",
    id: parsed.itemId,
    classification
  });
}

export async function processInboxItem(input: unknown): Promise<BasicInboxActionResult> {
  const parsed = processInboxItemInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft(localProcessMessage(parsed.destinationType), parsed.itemId);
    }

    const { data: inboxItem, error: inboxError } = await supabase
      .from("inbox_items")
      .select("id, content, content_type, status")
      .eq("id", parsed.itemId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (inboxError) {
      return errorDraft(GENERIC_INBOX_ERROR);
    }

    if (!inboxItem?.id || typeof inboxItem.content !== "string") {
      return errorDraft("Item da inbox nao encontrado para este usuario.");
    }

    if (!isProcessableInboxStatus(String(inboxItem.status))) {
      return errorDraft("Este item da inbox ja foi processado ou nao pode ser alterado.");
    }

    if (parsed.destinationId && passiveDestinationAcceptsNoExternalId(parsed.destinationType)) {
      return errorDraft("Este destino da inbox nao aceita identificador externo.");
    }

    if (parsed.destinationId) {
      const ownsDestination = await destinationBelongsToUser(
        supabase,
        parsed.destinationType,
        parsed.destinationId,
        user.id
      );

      if (!ownsDestination) {
        return errorDraft("Destino nao encontrado para este usuario.");
      }
    }

    if ((parsed.destinationType === "project" || parsed.destinationType === "habit") && !parsed.destinationId) {
      return errorDraft("Escolha um destino existente para concluir este processamento nesta etapa.");
    }

    const classification = inboxClassificationOutputSchema.parse(buildInboxClassificationMock(inboxItem.content));
    let destinationId = parsed.destinationId;

    if (parsed.destinationType === "task" && !destinationId) {
      const { data: task, error: taskError } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: classification.suggested_title,
          description: classification.summary,
          task_type: "one_off",
          status: "pending",
          priority: "medium",
          energy_level: classification.energy_level ?? "medium",
          estimated_minutes: classification.estimated_minutes ?? 15,
          reason: "Criada a partir de item revisado da inbox.",
          next_action: classification.summary
        })
        .select("id")
        .single();

      if (taskError || !task?.id) {
        return errorDraft(GENERIC_INBOX_ERROR);
      }

      destinationId = String(task.id);
    }

    if (parsed.destinationType === "calendar_event" && !destinationId) {
      const now = new Date();
      const startTime = now.toISOString();
      const endTime = new Date(now.getTime() + (classification.estimated_minutes ?? 25) * 60000).toISOString();
      const { data: block, error: blockError } = await supabase
        .from("calendar_blocks")
        .insert({
          user_id: user.id,
          block_type: "task",
          title: classification.suggested_title,
          start_time: startTime,
          end_time: endTime,
          status: "scheduled",
          notes: "Criado a partir de item revisado da inbox."
        })
        .select("id")
        .single();

      if (blockError || !block?.id) {
        return errorDraft(GENERIC_INBOX_ERROR);
      }

      destinationId = String(block.id);
    }

    const processed = processInboxItemDomain(
      {
        id: parsed.itemId,
        content: inboxItem.content,
        contentType: inboxItem.content_type === "link" ? "link" : "text",
        status: inboxItem.status === "triaged" ? "triaged" : "captured",
        classification,
        createdAt: new Date().toISOString()
      },
      {
        destinationType: parsed.destinationType,
        destinationId,
        note: parsed.note
      }
    );

    const { data: updated, error } = await supabase
      .from("inbox_items")
      .update({
        status: processed.status,
        destination_type: processed.destinationType,
        destination_id: processed.destinationId ?? null,
        ai_classification: classification ?? {},
        classification: classification?.classification ?? null,
        recommended_action: classification?.recommended_action ?? null,
        confidence_level: classification?.confidence ?? null,
        suggested_title: classification?.suggested_title ?? null,
        summary: classification?.summary ?? null,
        life_area: classification?.life_area ?? null,
        estimated_minutes: classification?.estimated_minutes ?? null,
        energy_level: classification?.energy_level ?? null,
        due_date_suggestion: classification?.due_date_suggestion ?? null,
        clarifying_question: classification?.clarifying_question ?? null,
        safety_note: classification?.safety_note ?? null,
        processing_note: parsed.note ?? null,
        processed_at: new Date().toISOString()
      })
      .eq("id", parsed.itemId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error) {
      return errorDraft(GENERIC_INBOX_ERROR);
    }

    if (!updated?.id) {
      return errorDraft("Item da inbox nao encontrado para este usuario.");
    }

    return executionActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Item processado com filtro de dono e revisão humana.",
      id: destinationId ?? parsed.itemId
    });
  } catch {
    return localDraft(localProcessMessage(parsed.destinationType), parsed.itemId);
  }
}

function localProcessMessage(destinationType: string) {
  if (destinationType === "calendar_event") {
    return "Item convertido em bloco de calendário local/dev.";
  }

  if (destinationType === "task") {
    return "Item convertido em tarefa local/dev.";
  }

  if (destinationType === "discard") {
    return "Item descartado nesta sessão local/dev.";
  }

  return "Item processado nesta sessão local/dev.";
}
