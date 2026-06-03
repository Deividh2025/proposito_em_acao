import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

describe("Supabase preview harness coverage", () => {
  const script = readFileSync(join(process.cwd(), "scripts", "validate-supabase-preview.mjs"), "utf8");

  test("covers invited Atalaia escalation and revocation scenarios", () => {
    expect(script).toContain('createPersona("atalia_invited")');
    expect(script).toContain("atalia_invited sees only pending invite preview");
    expect(script).toContain("atalia_invited cannot alter grant permissions");
    expect(script).toContain("atalia_invited cannot alter goal_id");
    expect(script).toContain("atalia_invited cannot alter user_id");
    expect(script).toContain("atalia_invited cannot alter tracking level or frequency");
    expect(script).toContain("atalia_invited cannot alter expires_at");
    expect(script).toContain("controlled acceptance activates only the invite-specific grant");
    expect(script).toContain("revocation cuts future reads for formerly active Atalaia");
    expect(script).toContain("SUPABASE_PREVIEW_PROJECT_REF");
    expect(script).toContain("SUPABASE_ALLOW_MAIN_PROJECT_PREVIEW_HARNESS");
  });
});
