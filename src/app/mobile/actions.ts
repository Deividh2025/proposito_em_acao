"use server";

import { buildEnergyAdjustment, energyCheckInInputSchema, mobileActionResultSchema } from "@/domain/energy";
import {
  missingSessionResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult
} from "@/domain/execution/action-results";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function recordEnergyCheckIn(input: unknown) {
  const inputResult = safeParseActionInput(energyCheckInInputSchema, input, mobileActionResultSchema);

  if (!inputResult.ok) {
    return inputResult.result;
  }

  const parsed = inputResult.data;
  const adjustment = buildEnergyAdjustment(parsed);
  const capturedAt = parsed.clientCreatedAt ?? new Date().toISOString();

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return missingSessionResult(
        mobileActionResultSchema,
        "Check-in de energia registrado nesta sessão local/dev.",
        undefined,
        { suggestion: adjustment.suggestion }
      );
    }

    const { data, error } = await supabase
      .from("energy_checkins")
      .insert({
        user_id: user.id,
        energy_level: parsed.energyLevel,
        note: parsed.note ?? null,
        source: parsed.source,
        captured_at: capturedAt,
        client_created_at: parsed.clientCreatedAt ?? null,
        client_mutation_id: parsed.clientMutationId ?? null
      })
      .select("id")
      .single();

    if (error || !data?.id) {
      return realServiceErrorResult(mobileActionResultSchema, "Nao foi possivel registrar energia agora.", {
        suggestion: adjustment.suggestion
      });
    }

    return supabaseSuccessResult(
      mobileActionResultSchema,
      "Check-in de energia registrado com RLS owner-only.",
      data.id,
      { suggestion: adjustment.suggestion }
    );
  } catch {
    return persistenceCatchResult(
      mobileActionResultSchema,
      "Check-in de energia registrado nesta sessão local/dev.",
      undefined,
      { suggestion: adjustment.suggestion },
      "Nao foi possivel registrar energia agora."
    );
  }
}
