import "server-only";

import type { User } from "@supabase/supabase-js";

import { energyLevelSchema, type EnergyLevel } from "@/domain/energy";
import { assertAuthenticatedUser } from "@/lib/supabase/guards";
import { firstRowFromUnknown, nullableStringFromRow, recordFromUnknown } from "@/lib/supabase/queries/mappers";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

export type MobileTodaySummary = {
  latestEnergy: {
    capturedAt: string | null;
    label: string;
    level: EnergyLevel;
  } | null;
};

const energyLabels: Record<EnergyLevel, string> = {
  high: "Alta",
  low: "Baixa",
  medium: "Media"
};

export function mapMobileTodaySummary(rowsValue: unknown): MobileTodaySummary {
  const row = recordFromUnknown(firstRowFromUnknown(rowsValue));
  const levelResult = energyLevelSchema.safeParse(row.energy_level);

  if (!levelResult.success) {
    return {
      latestEnergy: null
    };
  }

  return {
    latestEnergy: {
      capturedAt: nullableStringFromRow(row, "captured_at"),
      label: energyLabels[levelResult.data],
      level: levelResult.data
    }
  };
}

export async function getMobileTodaySummary(supabase: TypedSupabaseClient, user: User): Promise<MobileTodaySummary> {
  assertAuthenticatedUser(user);

  const { data, error } = await supabase
    .from("energy_checkins")
    .select("energy_level,captured_at")
    .eq("user_id", user.id)
    .order("captured_at", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error("Could not load mobile summary.");
  }

  return mapMobileTodaySummary(data);
}
