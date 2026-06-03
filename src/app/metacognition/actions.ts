"use server";

import { z } from "zod";

import { reviewOwnerPersistenceSafety } from "@/ai/guardrails";
import { metacognitionOutputSchema } from "@/ai/schemas";
import { buildMetacognitionMock } from "@/domain/metacognition";
import {
  createMetacognitionSessionInputSchema,
  metacognitionActionResultSchema,
  persistMetacognitionSessionInputSchema,
  type MetacognitionActionResult
} from "@/domain/metacognition/persistence";
import { executionActionResultSchema } from "@/domain/execution/persistence";
import {
  localDraftResult,
  missingSessionResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult
} from "@/domain/execution/action-results";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const GENERIC_METACOGNITION_ERROR =
  "Nao foi possivel salvar a sessao de Metacognicao agora. Tente novamente.";

function localDraft(message: string, output?: unknown, id?: string): MetacognitionActionResult {
  return localDraftResult(metacognitionActionResultSchema, message, id, { output });
}

function errorDraft(message: string): MetacognitionActionResult {
  return realServiceErrorResult(metacognitionActionResultSchema, message);
}

async function belongsToUser(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: "tasks" | "projects" | "goals",
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

export async function generateMetacognitionReflection(input: unknown): Promise<MetacognitionActionResult> {
  const parsed = createMetacognitionSessionInputSchema.parse(input);
  const output = metacognitionOutputSchema.parse(buildMetacognitionMock(parsed));

  return localDraft("Reflexao mock segura gerada com revisao obrigatoria.", output);
}

export async function persistMetacognitionSession(input: unknown): Promise<MetacognitionActionResult> {
  const inputResult = safeParseActionInput(
    persistMetacognitionSessionInputSchema,
    input,
    metacognitionActionResultSchema
  );

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;
  const safetyReview = reviewOwnerPersistenceSafety({
    reviewedSchemaVersion: parsed.output.schema_version,
    value: parsed.output
  });

  if (!safetyReview.safe_to_persist) {
    return errorDraft("A resposta de Metacognicao foi bloqueada pelos guardrails antes de salvar.");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        metacognitionActionResultSchema,
        "Sessao de Metacognicao mantida como rascunho local/dev. Entre para persistir com RLS owner-only.",
        undefined,
        { output: parsed.output }
      );
    }

    const ownershipChecks = [
      parsed.input.relatedTaskId ? belongsToUser(supabase, "tasks", parsed.input.relatedTaskId, user.id) : true,
      parsed.input.relatedProjectId
        ? belongsToUser(supabase, "projects", parsed.input.relatedProjectId, user.id)
        : true,
      parsed.input.relatedGoalId ? belongsToUser(supabase, "goals", parsed.input.relatedGoalId, user.id) : true
    ];

    const ownershipResults = await Promise.all(ownershipChecks);

    if (ownershipResults.some((result) => result !== true)) {
      return errorDraft("Um dos vinculos informados nao pertence ao usuario autenticado.");
    }

    const { data, error } = await supabase
      .from("metacognition_sessions")
      .insert({
        user_id: user.id,
        related_task_id: parsed.input.relatedTaskId ?? null,
        related_goal_id: parsed.input.relatedGoalId ?? null,
        related_project_id: parsed.input.relatedProjectId ?? null,
        emotional_state: parsed.output.state_name,
        intensity: parsed.input.intensity,
        raw_thought: parsed.input.automaticThought,
        schema_version: parsed.output.schema_version,
        category: parsed.output.category,
        intensity_observed: parsed.output.intensity_observed,
        dominant_automatic_thought: parsed.output.dominant_automatic_thought,
        fact: parsed.output.fact,
        interpretation: parsed.output.interpretation,
        feeling: parsed.output.feeling,
        impulse: parsed.output.impulse,
        cognitive_patterns: parsed.output.cognitive_patterns,
        logical_deconstruction: parsed.output.logical_deconstruction,
        ai_reframe: parsed.output.reframe,
        confrontation_question: parsed.output.confrontation_question,
        next_action: parsed.output.next_action,
        recommended_route: parsed.output.recommended_route,
        christian_anchor: parsed.output.christian_anchor,
        safety_flags: parsed.output.safety_flags,
        privacy_note: parsed.output.privacy_note,
        user_review_required: parsed.output.user_review_required,
        share_with_accountability_allowed: parsed.output.share_with_accountability_allowed,
        privacy_level: "private",
        crisis_flag: parsed.output.recommended_route === "emergency_support"
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return errorDraft(GENERIC_METACOGNITION_ERROR);
    }

    return supabaseSuccessResult(
      metacognitionActionResultSchema,
      "Sessao de Metacognicao salva no Supabase com policy owner-only.",
      data.id,
      { output: parsed.output }
    );
  } catch {
    return persistenceCatchResult(
      metacognitionActionResultSchema,
      "Sessao de Metacognicao mantida como rascunho local/dev. Nenhum dado foi enviado para OpenAI.",
      undefined,
      { output: parsed.output },
      GENERIC_METACOGNITION_ERROR
    );
  }
}

const listMetacognitionHistoryInputSchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(20).default(8)
  })
  .strict();

export async function listMetacognitionHistory(input: unknown = {}) {
  const parsed = listMetacognitionHistoryInputSchema.parse(input);

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        mode: "local-draft" as const,
        items: sampleMetacognitionHistory,
        message: "Historico demonstrativo local/dev. Entre para ver sessoes privadas reais."
      };
    }

    const { data, error } = await supabase
      .from("metacognition_sessions")
      .select("id, emotional_state, cognitive_patterns, ai_reframe, next_action, crisis_flag, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(parsed.limit);

    if (error) {
      return {
        mode: "local-draft" as const,
        items: sampleMetacognitionHistory,
        message: "Nao foi possivel carregar o historico privado agora."
      };
    }

    return {
      mode: "supabase" as const,
      items: (data ?? []).map((item) => ({
        id: String(item.id),
        stateName: String(item.emotional_state ?? "Estado interno"),
        pattern: Array.isArray(item.cognitive_patterns) ? String(item.cognitive_patterns[0] ?? "padrao provavel") : "padrao provavel",
        reframe: String(item.ai_reframe ?? "Reformulacao privada"),
        nextAction: String(item.next_action ?? "Proxima acao privada"),
        crisis: Boolean(item.crisis_flag),
        createdAt: String(item.created_at ?? "")
      })),
      message: "Historico privado carregado com filtro de dono."
    };
  } catch {
    return {
      mode: "local-draft" as const,
      items: sampleMetacognitionHistory,
      message: "Historico demonstrativo local/dev. Nenhum dado sensivel saiu do app."
    };
  }
}

export async function deleteMetacognitionSession(input: unknown) {
  const inputResult = safeParseActionInput(
    z.object({ sessionId: z.string().trim().min(1) }).strict(),
    input,
    executionActionResultSchema
  );

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
        "Exclusao simulada nesta sessao local/dev.",
        parsed.sessionId
      );
    }

    const { data, error } = await supabase
      .from("metacognition_sessions")
      .delete()
      .eq("id", parsed.sessionId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (error || !data?.id) {
      return realServiceErrorResult(executionActionResultSchema, GENERIC_METACOGNITION_ERROR);
    }

    return supabaseSuccessResult(
      executionActionResultSchema,
      "Sessao privada excluida com filtro de dono.",
      parsed.sessionId
    );
  } catch {
    return persistenceCatchResult(
      executionActionResultSchema,
      "Exclusao simulada nesta sessao local/dev.",
      parsed.sessionId,
      {},
      GENERIC_METACOGNITION_ERROR
    );
  }
}

const sampleMetacognitionHistory = [
  {
    id: "local-metacognition-1",
    stateName: "Culpa diante da tarefa",
    pattern: "generalizacao excessiva",
    reframe: "Falhei neste ponto, mas ainda posso retomar com uma acao pequena.",
    nextAction: "Abrir a tarefa por 2 minutos.",
    crisis: false,
    createdAt: "2026-06-01T09:00:00-03:00"
  }
];
