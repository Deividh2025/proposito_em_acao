import { describe, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  buildLocalDemoGardenState,
  mapGardenStateRow,
  resolveAuthenticatedDataMode,
  toSafeQueryError
} from "@/lib/supabase/queries/reflection";

describe("authenticated data runtime contract", () => {
  test("allows sample data only in local-demo", () => {
    expect(
      resolveAuthenticatedDataMode({
        hasSupabaseConfig: false,
        hasUser: false,
        runtimeMode: "local-demo"
      })
    ).toEqual({
      canUseSampleData: true,
      kind: "local-demo",
      reason: "local-demo"
    });

    expect(
      resolveAuthenticatedDataMode({
        hasSupabaseConfig: true,
        hasUser: false,
        runtimeMode: "preview"
      })
    ).toEqual({
      canUseSampleData: false,
      kind: "blocked",
      reason: "auth-required"
    });
  });

  test("fails closed without Supabase config outside local-demo", () => {
    expect(
      resolveAuthenticatedDataMode({
        hasSupabaseConfig: false,
        hasUser: false,
        runtimeMode: "beta"
      })
    ).toEqual({
      canUseSampleData: false,
      kind: "blocked",
      reason: "config-missing"
    });
  });

  test("marks authenticated runtime as real data only", () => {
    expect(
      resolveAuthenticatedDataMode({
        hasSupabaseConfig: true,
        hasUser: true,
        runtimeMode: "production"
      })
    ).toEqual({
      canUseSampleData: false,
      kind: "authenticated",
      reason: "authenticated"
    });
  });

  test("sanitizes query errors for UI boundaries", () => {
    expect(toSafeQueryError(new Error("permission denied for table metacognition_sessions"))).toEqual({
      code: "query-error",
      message: "Nao foi possivel carregar seus dados agora."
    });

    expect(toSafeQueryError(null, "Nao foi possivel carregar o Placar.")).toEqual({
      code: "query-error",
      message: "Nao foi possivel carregar o Placar."
    });
  });

  test("labels local-demo garden samples and keeps them non-shareable", () => {
    const sample = buildLocalDemoGardenState();

    expect(sample.garden_state.weekly_growth_summary).toContain("demonstrativo local/dev");
    expect(JSON.stringify(sample)).not.toMatch(/Atalaia|raw_thought|prompt|raw_response/i);
  });

  test("maps private garden rows without accepting malformed demo state", () => {
    const mapped = mapGardenStateRow({
      area_states: [
        {
          area: "Descanso",
          care_message: "Descanso pede cuidado simples nesta semana.",
          care_needed: true,
          growth_level: 2,
          recent_events: ["Revisao semanal concluida"],
          visual_state: "needs_care"
        }
      ],
      schema_version: "garden_state_output_v1",
      unlocked_items: ["Retomada visivel"],
      weekly_growth_summary: "Resumo privado derivado da revisao."
    });

    expect(mapped?.schema_version).toBe("garden_state_output_v1");
    expect(mapped?.garden_state.life_areas[0]?.area).toBe("Descanso");
    expect(mapGardenStateRow({ area_states: [{ raw_thought: "privado" }] })).toBeNull();
  });
});
