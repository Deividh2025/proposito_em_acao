import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

const migrationPath = join(process.cwd(), "supabase", "migrations", "202605310002_rls_policies.sql");

describe("RLS policy safety", () => {
  const sql = readFileSync(migrationPath, "utf8");

  test("binds Atalaia access to the specific partner and grant rows", () => {
    expect(sql).toContain("partners.id = accountability_grants.accountability_partner_id");
    expect(sql).toContain("grants.id = accountability_notifications.accountability_grant_id");
    expect(sql).toContain("partners.id = accountability_notifications.accountability_partner_id");
    expect(sql).not.toMatch(
      /accountability_grants_partner_select_active[\s\S]*app_private\.has_active_accountability_grant\(user_id, goal_id, null\)/
    );
  });
});
