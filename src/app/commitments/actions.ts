"use server";

import {
  buildCommitmentDocumentDraft,
  commitmentDocumentActionResultSchema,
  createCommitmentDocumentInputSchema,
  persistCommitmentDocumentInputSchema,
  type BasicCommitmentDocumentActionResult,
  type CommitmentDocumentActionResult
} from "@/domain/commitments";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function localDraft(message: string, id?: string): BasicCommitmentDocumentActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: true, message, id });
}

function errorDraft(message: string): BasicCommitmentDocumentActionResult {
  return executionActionResultSchema.parse({ mode: "local-draft", ok: false, message });
}

export async function generateCommitmentDocumentDraft(input: unknown): Promise<CommitmentDocumentActionResult> {
  const parsed = createCommitmentDocumentInputSchema.parse(input);
  const draft = buildCommitmentDocumentDraft(parsed);

  return commitmentDocumentActionResultSchema.parse({
    draft,
    message: "Mock seguro gerou Documento de Compromisso revisavel. Nenhuma chamada OpenAI real foi feita.",
    mode: "local-draft",
    ok: true
  });
}

export async function persistCommitmentDocument(input: unknown): Promise<BasicCommitmentDocumentActionResult> {
  const parsed = persistCommitmentDocumentInputSchema.parse(input);
  const draft = buildCommitmentDocumentDraft(parsed);
  const blockedLever = draft.levers.find((lever) => lever.safety === "blocked");

  if (blockedLever) {
    return errorDraft("Alavanca bloqueada: revise a consequencia antes de salvar o compromisso.");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return localDraft("Documento mantido como rascunho local/dev. Entre para persistir com RLS.");
    }

    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("id")
      .eq("id", parsed.goalId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (goalError || !goal?.id) {
      return errorDraft("O alvo do compromisso nao pertence ao usuario autenticado.");
    }

    const { data, error } = await supabase
      .from("commitment_documents")
      .insert({
        user_id: user.id,
        goal_id: parsed.goalId,
        title: draft.document.title,
        content: draft.document.commitment_statement,
        status: "draft",
        shared_with_atalaias: false,
        schema_version: draft.document.schema_version,
        structured_content: draft.document,
        sharing_permissions: draft.document.sharing_permissions,
        privacy_check: {
          contains_private_metacognition: false,
          contains_full_calling: false,
          safe_to_share: false
        },
        reviewed_at: null
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft("Nao foi possivel salvar o Documento de Compromisso agora.");
    }

    const leverRows = draft.levers.map((lever) => ({
      user_id: user.id,
      commitment_document_id: data.id,
      goal_id: parsed.goalId,
      lever_type: lever.type === "restorative_consequence" ? "healthy_repair" : lever.type,
      lever_subtype: lever.type,
      description: lever.description,
      safety_status: lever.safety,
      safety_notes: lever.notes
    }));

    if (leverRows.length > 0) {
      await supabase.from("commitment_levers").insert(leverRows);
    }

    return executionActionResultSchema.parse({
      id: data.id,
      message: "Documento salvo como rascunho privado. Compartilhamento ainda exige revisao e grant ativo.",
      mode: "supabase",
      ok: true
    });
  } catch {
    return localDraft("Modo local seguro: Documento de Compromisso validado sem persistencia remota.");
  }
}
