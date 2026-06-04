import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("accountability and commitment real-data UI contracts", () => {
  test("owner accountability page renders real grants or an empty state without demo drafts", () => {
    const page = readFileSync(
      join(process.cwd(), "src", "app", "accountability", "page.tsx"),
      "utf8"
    );

    expect(page).toContain("getAccountabilityOverview");
    expect(page).toContain("Nenhum Atalaia");
    expect(page).not.toContain("buildAccountabilityInviteDraft");
    expect(page).not.toContain("sampleGrant");
    expect(page).not.toContain("goal-exemplo");
    expect(page).not.toContain("atalia@example.com");
  });

  test("grant detail page uses the authenticated grant query and hides revoked or missing access", () => {
    const page = readFileSync(
      join(process.cwd(), "src", "app", "accountability", "[grantId]", "page.tsx"),
      "utf8"
    );

    expect(page).toContain("getAccountabilityGrantDetail");
    expect(page).toContain("Acesso indisponivel");
    expect(page).not.toContain("buildAccountabilityInviteDraft");
    expect(page).not.toContain("goal-exemplo");
    expect(page).not.toContain("atalia@example.com");
  });

  test("commitment detail page renders a persisted document or empty state without local examples", () => {
    const page = readFileSync(
      join(process.cwd(), "src", "app", "commitments", "[documentId]", "page.tsx"),
      "utf8"
    );

    expect(page).toContain("getCommitmentDocumentDetail");
    expect(page).toContain("Documento indisponivel");
    expect(page).not.toContain("buildCommitmentDocumentDraft");
    expect(page).not.toContain("goal-exemplo");
    expect(page).not.toContain("atalia@example.com");
  });
});
