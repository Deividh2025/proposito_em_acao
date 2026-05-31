"use server";

import { callingDraftSchema, reviewCallingDraftSafety } from "@/ai/schemas/calling";
import { lifeMapAreas } from "@/domain/life-map";
import type { LifeMapAreaInput, ProfileEssentialInput } from "@/domain/onboarding";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SaveOnboardingInput = {
  profile: ProfileEssentialInput;
  lifeMap: LifeMapAreaInput[];
  callingAnswers: Record<string, string>;
  callingDraft: unknown;
  acceptedCallingDraft: boolean;
};

export type SaveOnboardingResult = {
  mode: "supabase" | "local-draft";
  ok: boolean;
  message: string;
};

function mapAiTone(value: ProfileEssentialInput["aiSupportTone"]) {
  const map = {
    light: "gentle",
    balanced: "structured",
    firm: "direct"
  } as const;

  return map[value];
}

function mapChristianLayer(value: ProfileEssentialInput["christianLayerPreference"]) {
  const map = {
    discreet: "light",
    balanced: "balanced",
    intense: "strong"
  } as const;

  return map[value];
}

function lifeAreaName(slug: string) {
  return lifeMapAreas.find((area) => area.slug === slug)?.name ?? slug;
}

type SupabaseErrorLike = {
  message: string;
};

function throwIfSupabaseError(error: SupabaseErrorLike | null | undefined, operation: string) {
  if (error) {
    throw new Error(`Supabase ${operation} failed.`);
  }
}

function isMissingSupabaseConfigurationError(error: unknown) {
  return error instanceof Error && error.message.includes("environment variables are not configured");
}

export async function saveOnboarding(input: SaveOnboardingInput): Promise<SaveOnboardingResult> {
  const parsedDraft = callingDraftSchema.parse(input.callingDraft);
  const safetyReview = reviewCallingDraftSafety(parsedDraft);

  if (!safetyReview.allowed) {
    return {
      mode: "local-draft",
      ok: false,
      message: safetyReview.nextSafeStep
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        mode: "local-draft",
        ok: true,
        message:
          "Rascunho mantido nesta sessao. Entre com uma conta para persistir no Supabase com RLS."
      };
    }

    const userId = user.id;

    const profileUpdate = await supabase
      .from("profiles")
      .update({
        display_name: input.profile.name,
        onboarding_status: input.acceptedCallingDraft ? "completed" : "in_progress",
        ai_tone: mapAiTone(input.profile.aiSupportTone),
        christian_layer_intensity: mapChristianLayer(input.profile.christianLayerPreference)
      })
      .eq("id", userId);
    throwIfSupabaseError(profileUpdate.error, "profile update");

    const preferencesUpsert = await supabase.from("user_preferences").upsert({
      user_id: userId,
      low_energy_mode: input.profile.habitualEnergy === "low",
      next_action_style: "micro"
    });
    throwIfSupabaseError(preferencesUpsert.error, "preferences upsert");

    const lifeAreaIds = new Map<string, string>();

    for (const area of input.lifeMap) {
      const { data: lifeArea, error: lifeAreaError } = await supabase
        .from("life_areas")
        .upsert({
          user_id: userId,
          slug: area.areaSlug,
          name: lifeAreaName(area.areaSlug),
          current_score: area.score
        })
        .select("id")
        .single();
      throwIfSupabaseError(lifeAreaError, "life area upsert");

      if (typeof lifeArea?.id === "string") {
        lifeAreaIds.set(area.areaSlug, lifeArea.id);
      }
    }

    const { data: assessment, error: assessmentError } = await supabase
      .from("life_map_assessments")
      .insert({
        user_id: userId,
        status: "completed",
        answers: { areas: input.lifeMap }
      })
      .select("id")
      .single();
    throwIfSupabaseError(assessmentError, "life map assessment insert");

    if (typeof assessment?.id === "string") {
      const scoreRows = input.lifeMap
        .map((area) => {
          const lifeAreaId = lifeAreaIds.get(area.areaSlug);

          if (!lifeAreaId) {
            return null;
          }

          return {
            user_id: userId,
            assessment_id: assessment.id,
            life_area_id: lifeAreaId,
            score: area.score,
            note: area.note ?? null
          };
        })
        .filter((row) => row !== null);

      if (scoreRows.length > 0) {
        const scoreInsert = await supabase.from("life_map_area_scores").insert(scoreRows);
        throwIfSupabaseError(scoreInsert.error, "life map area scores insert");
      }
    }

    const { data: calling, error: callingError } = await supabase
      .from("callings")
      .insert({
        user_id: userId,
        status: input.acceptedCallingDraft ? "in_discernment" : "draft",
        statement: parsedDraft.direction_statement,
        hypothesis: parsedDraft.calling_hypothesis,
        values: parsedDraft.core_values,
        burdens: parsedDraft.recurring_burdens,
        gifts: parsedDraft.gifts_and_inclinations,
        people_to_serve: parsedDraft.people_to_serve.join(", "),
        contribution: parsedDraft.direction_statement,
        confidence_level: parsedDraft.confidence_level,
        guardrail_status: "passed",
        pastoral_safety_note: parsedDraft.pastoral_safety_note,
        schema_version: parsedDraft.schema_version,
        reviewed_at: input.acceptedCallingDraft ? new Date().toISOString() : null,
        accepted_at: input.acceptedCallingDraft ? new Date().toISOString() : null
      })
      .select("id")
      .single();
    throwIfSupabaseError(callingError, "calling insert");

    if (calling?.id) {
      const entries = Object.entries(input.callingAnswers).map(([promptKey, answer], index) => ({
        user_id: userId,
        calling_id: calling.id,
        prompt_key: promptKey,
        answer,
        position: index + 1,
        prompt_version: "calling_onboarding_v1"
      }));

      if (entries.length > 0) {
        const entriesInsert = await supabase.from("calling_session_entries").insert(entries);
        throwIfSupabaseError(entriesInsert.error, "calling session entries insert");
      }
    }

    if (assessment?.id) {
      return {
        mode: "supabase",
        ok: true,
        message: "Onboarding salvo no Supabase com policies de dono autenticado."
      };
    }

    return {
      mode: "supabase",
      ok: true,
      message: "Onboarding salvo parcialmente. Revise Mapa da Vida quando Supabase estiver ativo."
    };
  } catch (error) {
    if (!isMissingSupabaseConfigurationError(error)) {
      return {
        mode: "local-draft",
        ok: false,
        message:
          "Nao foi possivel confirmar o salvamento no Supabase. Mantenha o rascunho local e tente novamente antes de tratar estes dados como persistidos."
      };
    }

    return {
      mode: "local-draft",
      ok: true,
      message:
        "Modo local seguro: Supabase/Auth nao esta configurado nesta sessao. Nada foi enviado a servico externo."
    };
  }
}
