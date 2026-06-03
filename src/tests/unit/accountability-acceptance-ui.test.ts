import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

describe("accountability invite acceptance UI", () => {
  const invitePage = readFileSync(
    join(process.cwd(), "src", "app", "accountability", "partner", "[inviteToken]", "page.tsx"),
    "utf8"
  );
  const actionsSource = readFileSync(join(process.cwd(), "src", "app", "accountability", "actions.ts"), "utf8");

  test("uses real invite preview instead of a demonstrative grant", () => {
    expect(invitePage).toContain("getAccountabilityInvitePreview");
    expect(invitePage).toContain("preview.canAccept ? <AcceptInviteButton");
    expect(invitePage).toContain("preview.grant ? <PartnerLimitedPanel");
    expect(invitePage).not.toContain("buildAccountabilityInviteDraft");
    expect(invitePage).not.toContain("goal-exemplo");
    expect(invitePage).not.toContain("atalia@example.com");
  });

  test("sanitizes invite preview without returning the raw invite token", () => {
    expect(actionsSource).toContain("type AccountabilityGrantPreview");
    expect(actionsSource).not.toContain("inviteToken: parsedInput.data.inviteToken");
  });
});
