import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

const migrationsPath = join(process.cwd(), "supabase", "migrations");

describe("RLS policy safety", () => {
  const sql = readdirSync(migrationsPath)
    .filter((fileName) => fileName.endsWith(".sql"))
    .map((fileName) => readFileSync(join(migrationsPath, fileName), "utf8"))
    .join("\n");

  test("binds Atalaia access to the specific partner and grant rows", () => {
    expect(sql).toContain("partners.id = accountability_grants.accountability_partner_id");
    expect(sql).toContain("grants.id = accountability_notifications.accountability_grant_id");
    expect(sql).toContain("partners.id = accountability_notifications.accountability_partner_id");
    expect(sql).not.toMatch(
      /accountability_grants_partner_select_active[\s\S]*app_private\.has_active_accountability_grant\(user_id, goal_id, null\)/
    );
  });

  test("allows Atalaia to read only their active partner relationship", () => {
    expect(sql).toContain("accountability_partners_partner_select_active");
    expect(sql).toMatch(
      /accountability_partners_partner_select_active[\s\S]*on public\.accountability_partners for select/
    );
    expect(sql).toMatch(
      /accountability_partners_partner_select_active[\s\S]*partner_user_id = \(select auth\.uid\(\)\)/
    );
    expect(sql).toMatch(/accountability_partners_partner_select_active[\s\S]*status = 'active'/);
    expect(sql).toMatch(/accountability_partners_partner_select_active[\s\S]*revoked_at is null/);
    expect(sql).toMatch(/accountability_partners_partner_select_active[\s\S]*accepted_at is not null/);
  });
});
