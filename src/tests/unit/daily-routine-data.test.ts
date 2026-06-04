import { describe, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  mapCalendarBlockRow,
  mapHabitRow,
  mapInboxItemRow,
  mapScoreboardRows,
  resolveDailyRoutineDataFromContext,
  resolveFocusSetupDataFromContext
} from "@/lib/supabase/queries/daily";

describe("daily routine authenticated data", () => {
  test("returns empty routine surfaces instead of samples when auth is blocked", async () => {
    const data = await resolveDailyRoutineDataFromContext({
      canUseSampleData: false,
      kind: "blocked",
      reason: "auth-required",
      runtimeMode: "preview",
      userMessage: "Entre na sua conta para ver seus dados reais."
    });

    expect(data).toMatchObject({
      canUseSampleData: false,
      calendarBlocks: [],
      habits: [],
      recentInboxItems: [],
      restartCount: 0,
      scoreboard: null,
      source: "blocked"
    });
    expect(data.message).toBe("Entre na sua conta para ver seus dados reais.");
  });

  test("keeps labelled sample data only for local-demo", async () => {
    const data = await resolveDailyRoutineDataFromContext({
      canUseSampleData: true,
      kind: "local-demo",
      message: "Dados demonstrativos visiveis apenas no modo local-demo.",
      runtimeMode: "local-demo",
      supabase: null,
      user: null
    });

    expect(data.canUseSampleData).toBe(true);
    expect(data.source).toBe("local-demo");
    expect(data.calendarBlocks.length).toBeGreaterThan(0);
    expect(data.recentInboxItems.length).toBeGreaterThan(0);
    expect(data.habits.length).toBeGreaterThan(0);
    expect(data.scoreboard?.items.length).toBeGreaterThan(0);
    expect(data.message).toContain("local-demo");
  });

  test("maps calendar, inbox, habit and scoreboard rows into UI-safe domain models", () => {
    expect(
      mapCalendarBlockRow({
        id: "block-1",
        title: "Sessao de foco",
        block_type: "focus",
        status: "scheduled",
        start_time: "2026-06-04T12:00:00.000Z",
        end_time: "2026-06-04T12:25:00.000Z",
        energy_level: "high",
        task_id: "task-1",
        recurrence_rule: "weekly"
      })
    ).toEqual({
      id: "block-1",
      title: "Sessao de foco",
      type: "focus",
      status: "scheduled",
      startTime: "2026-06-04T12:00:00.000Z",
      endTime: "2026-06-04T12:25:00.000Z",
      energyLevel: "high",
      taskId: "task-1",
      recurrenceRule: "weekly"
    });

    expect(
      mapInboxItemRow({
        id: "inbox-1",
        content: "Agendar revisao",
        content_type: "text",
        status: "triaged",
        created_at: "2026-06-04T09:00:00.000Z",
        classification: "calendar_event",
        recommended_action: "schedule",
        confidence_level: "high",
        suggested_title: "Revisao",
        summary: "Criar bloco curto.",
        energy_level: "medium",
        estimated_minutes: 25,
        user_review_required: true
      })?.classification
    ).toMatchObject({
      classification: "calendar_event",
      recommended_action: "schedule",
      suggested_title: "Revisao",
      user_review_required: true
    });

    expect(
      mapHabitRow({
        id: "habit-1",
        title: "Ler",
        status: "active",
        identity_statement: "Sou constante em escala pequena.",
        why_it_matters: "Protege direcao.",
        life_area: "Espiritualidade",
        trigger: "Depois do cafe",
        minimum_version: "Ler 2 minutos",
        ideal_version: "Ler e anotar",
        frequency: { type: "daily" },
        schedule_suggestion: "Manha",
        reward: "Registrar minimo",
        likely_obstacle: "pressa",
        if_then_plan: "Se houver pressa, ler uma frase.",
        environment_design: "Livro visivel",
        metric: "minimo",
        restart_plan: "Voltar no proximo contexto."
      })
    ).toMatchObject({
      frequency: "daily",
      id: "habit-1",
      minimumVersion: "Ler 2 minutos",
      title: "Ler"
    });

    expect(
      mapScoreboardRows(
        [
          {
            id: "scoreboard-1",
            title: "Placar real",
            period: "weekly",
            visibility: "private"
          }
        ],
        [
          {
            id: "item-1",
            scoreboard_id: "scoreboard-1",
            item_type: "focus",
            title: "Foco honesto",
            target_frequency: "3 vezes",
            minimum_success: "5 minutos"
          },
          {
            id: "item-orphan",
            scoreboard_id: "other",
            item_type: "habit",
            title: "Nao deve aparecer"
          }
        ]
      )
    ).toEqual([
      {
        id: "scoreboard-1",
        items: [
          {
            id: "item-1",
            minimumSuccess: "5 minutos",
            targetFrequency: "3 vezes",
            title: "Foco honesto",
            type: "focus"
          }
        ],
        period: "weekly",
        title: "Placar real",
        visibility: "private"
      }
    ]);
  });

  test("focus setup is blank outside local-demo until a real task is loaded", async () => {
    const data = await resolveFocusSetupDataFromContext({
      canUseSampleData: false,
      kind: "blocked",
      reason: "auth-required",
      runtimeMode: "preview",
      userMessage: "Entre na sua conta para iniciar foco com dados reais."
    });

    expect(data.canUseSampleData).toBe(false);
    expect(data.source).toBe("blocked");
    expect(data.plan).toEqual({
      durationMinutes: 25,
      nextStep: "",
      reason: "",
      taskTitle: ""
    });
  });
});
