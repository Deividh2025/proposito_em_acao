"use server";

import { buildEnergyAdjustment, energyCheckInInputSchema, mobileActionResultSchema } from "@/domain/energy";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function recordEnergyCheckIn(input: unknown) {
  const parsed = energyCheckInInputSchema.parse(input);
  const adjustment = buildEnergyAdjustment(parsed);
  const capturedAt = parsed.clientCreatedAt ?? new Date().toISOString();

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return mobileActionResultSchema.parse({
        mode: "local-draft",
        ok: true,
        message: "Check-in de energia registrado nesta sessão local/dev.",
        suggestion: adjustment.suggestion
      });
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
      return mobileActionResultSchema.parse({
        mode: "local-draft",
        ok: false,
        message: "Não foi possível registrar energia agora.",
        suggestion: adjustment.suggestion
      });
    }

    return mobileActionResultSchema.parse({
      mode: "supabase",
      ok: true,
      message: "Check-in de energia registrado com RLS owner-only.",
      id: data.id,
      suggestion: adjustment.suggestion
    });
  } catch {
    return mobileActionResultSchema.parse({
      mode: "local-draft",
      ok: true,
      message: "Check-in de energia registrado nesta sessão local/dev.",
      suggestion: adjustment.suggestion
    });
  }
}
