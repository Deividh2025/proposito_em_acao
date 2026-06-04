import { describe, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  booleanFromRow,
  jsonArrayFromRow,
  numberFromRow,
  recordFromUnknown,
  stringArrayFromRow,
  stringFromRow
} from "@/lib/supabase/queries/mappers";

describe("Supabase query mappers", () => {
  test("normalizes primitive fields from generic database rows", () => {
    const row = recordFromUnknown({
      active: true,
      minutes: 25,
      status: "pending",
      title: "Preparar revisao"
    });

    expect(stringFromRow(row, "title", "Sem titulo")).toBe("Preparar revisao");
    expect(stringFromRow(row, "missing", "Sem titulo")).toBe("Sem titulo");
    expect(numberFromRow(row, "minutes", 5)).toBe(25);
    expect(numberFromRow(row, "status", 5)).toBe(5);
    expect(booleanFromRow(row, "active", false)).toBe(true);
  });

  test("normalizes arrays without leaking nested objects by default", () => {
    const row = recordFromUnknown({
      areas: ["saude", "familia", 123, null],
      metadata: [{ id: "safe" }, "ok"]
    });

    expect(stringArrayFromRow(row, "areas")).toEqual(["saude", "familia"]);
    expect(jsonArrayFromRow(row, "metadata")).toEqual([{ id: "safe" }, "ok"]);
    expect(recordFromUnknown("not-a-row")).toEqual({});
  });
});
