import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { mapMobileTodaySummary } from "@/lib/supabase/queries/mobile";

describe("mobile real-data privacy contract", () => {
  test("maps the latest energy check-in without carrying the sensitive note", () => {
    const summary = mapMobileTodaySummary([
      {
        captured_at: "2026-06-03T10:00:00.000Z",
        energy_level: "low",
        note: "Dormi mal e preciso reduzir o escopo."
      }
    ]);

    expect(summary.latestEnergy).toEqual({
      capturedAt: "2026-06-03T10:00:00.000Z",
      label: "Baixa",
      level: "low"
    });
    expect(JSON.stringify(summary)).not.toContain("Dormi mal");
  });

  test("mobile today page loads a sanitized real summary instead of only static shortcuts", () => {
    const page = readFileSync(
      join(process.cwd(), "src", "app", "mobile", "today", "page.tsx"),
      "utf8"
    );

    expect(page).toContain("getMobileTodaySummary");
    expect(page).not.toContain("localStorage");
    expect(page).not.toContain("sessionStorage");
    expect(page).not.toContain("indexedDB");
  });
});
