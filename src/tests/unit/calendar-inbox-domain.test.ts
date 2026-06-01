import { describe, expect, test } from "vitest";

import {
  inboxClassificationOutputSchema,
  scheduleOverloadOutputSchema
} from "@/ai/schemas";
import {
  buildCalendarWeekModel,
  detectScheduleOverload,
  getNextCalendarAction,
  rescheduleCalendarBlock,
  sampleCalendarBlocks
} from "@/domain/calendar";
import {
  buildInboxClassificationMock,
  processInboxItem,
  sampleInboxItems
} from "@/domain/inbox";

describe("calendar execution domain", () => {
  test("builds weekly and daily views from execution blocks without losing protected rest", () => {
    const week = buildCalendarWeekModel(sampleCalendarBlocks, "2026-06-01");

    expect(week.days).toHaveLength(7);
    expect(week.days[0]?.blocks.map((block) => block.type)).toEqual(
      expect.arrayContaining(["spirituality", "task", "rest"])
    );
    expect(week.days[0]?.totalScheduledMinutes).toBeGreaterThan(100);
    expect(week.days[0]?.protectedBlockCount).toBeGreaterThanOrEqual(2);
  });

  test("detects overload with a caring structured alert", () => {
    const alert = detectScheduleOverload([
      ...sampleCalendarBlocks,
      {
        id: "block-extra-high",
        title: "Bloco intenso extra",
        type: "focus",
        status: "scheduled",
        startTime: "2026-06-01T16:00:00-03:00",
        endTime: "2026-06-01T18:00:00-03:00",
        energyLevel: "high"
      }
    ]);

    const parsed = scheduleOverloadOutputSchema.parse(alert);

    expect(parsed.overload_level).toBe("high");
    expect(parsed.message).toContain("agenda parece pesada");
    expect(parsed.recommended_adjustments).toEqual(
      expect.arrayContaining(["Proteger um bloco de descanso antes de adicionar outra entrega."])
    );
  });

  test("reschedules a block and keeps the next action clear", () => {
    const rescheduled = rescheduleCalendarBlock(sampleCalendarBlocks[1]!, {
      startTime: "2026-06-02T10:00:00-03:00",
      endTime: "2026-06-02T10:45:00-03:00"
    });

    expect(rescheduled.startTime).toBe("2026-06-02T10:00:00-03:00");
    expect(rescheduled.status).toBe("scheduled");
    expect(getNextCalendarAction([rescheduled])?.title).toContain("Organizar");
  });
});

describe("inbox GTD domain", () => {
  test("classifies a captured item with the Prompt 9 schema", () => {
    const output = buildInboxClassificationMock(
      "Agendar revisao financeira sexta as 9h e separar 25 minutos"
    );

    const parsed = inboxClassificationOutputSchema.parse(output);

    expect(parsed.classification).toBe("calendar_event");
    expect(parsed.recommended_action).toBe("schedule");
    expect(parsed.estimated_minutes).toBe(25);
    expect(parsed.user_review_required).toBe(true);
  });

  test("processes inbox items into task and archive destinations", () => {
    const taskResult = processInboxItem(sampleInboxItems[0]!, {
      destinationType: "task",
      destinationId: "task-from-inbox",
      note: "Virou tarefa revisada pelo usuario."
    });

    const archiveResult = processInboxItem(sampleInboxItems[1]!, {
      destinationType: "reference",
      note: "Guardar como referencia futura."
    });

    expect(taskResult.status).toBe("converted");
    expect(taskResult.destinationType).toBe("task");
    expect(archiveResult.status).toBe("archived");
    expect(archiveResult.processingNote).toContain("referencia");
  });
});
