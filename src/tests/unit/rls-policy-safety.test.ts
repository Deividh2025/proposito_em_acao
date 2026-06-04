import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

const migrationsPath = join(process.cwd(), "supabase", "migrations");

describe("RLS policy safety", () => {
  const migrationFileNames = readdirSync(migrationsPath)
    .filter((fileName) => fileName.endsWith(".sql"))
    .sort();
  const sql = migrationFileNames
    .map((fileName) => readFileSync(join(migrationsPath, fileName), "utf8"))
    .join("\n");
  const policyBlocks = sql.match(/create policy[\s\S]*?;/gi) ?? [];
  const acceptanceHardeningSql = readFileSync(
    join(
      migrationsPath,
      migrationFileNames.find((fileName) => fileName.includes("accountability_acceptance_rls_hardening")) ?? ""
    ),
    "utf8"
  );
  const rlsBaselineSql = readFileSync(
    join(migrationsPath, migrationFileNames.find((fileName) => fileName.includes("rls_policies")) ?? ""),
    "utf8"
  );

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
    expect(acceptanceHardeningSql).toMatch(
      /accountability_partners_partner_select_active[\s\S]*exists \([\s\S]*from public\.accountability_grants grants[\s\S]*grants\.status = 'active'/
    );
  });

  test("prevents invited Atalaia from mutating reviewed grant scope during acceptance", () => {
    expect(sql).toContain("assert_accountability_grant_acceptance_scope_immutable");
    expect(sql).toContain("trg_accountability_grant_acceptance_scope_immutable");

    for (const immutableField of [
      "user_id",
      "goal_id",
      "accountability_partner_id",
      "permissions",
      "sharing_permissions",
      "tracking_level",
      "notification_frequency",
      "consent_version",
      "consent_recorded_at",
      "expires_at"
    ]) {
      expect(sql).toContain(`new.${immutableField} is distinct from old.${immutableField}`);
    }
  });

  test("keeps invited partner acceptance fields narrow and token-bound", () => {
    expect(sql).toContain("assert_accountability_partner_acceptance_scope_immutable");
    expect(sql).toContain("trg_accountability_partner_acceptance_scope_immutable");
    expect(sql).toContain("new.invite_token_hash is not null");
    expect(sql).toContain("lower(coalesce(new.email, '')) <> lower(coalesce(auth.jwt() ->> 'email', ''))");
    expect(sql).toContain("old.status = 'invited'");
    expect(sql).toContain("new.status = 'active'");
  });

  test("removes direct invited update policies from the hardening migration", () => {
    expect(acceptanceHardeningSql).toContain(
      "drop policy if exists accountability_partners_invitee_accept_pending"
    );
    expect(acceptanceHardeningSql).toContain(
      "drop policy if exists accountability_grants_invitee_accept_pending"
    );
    expect(acceptanceHardeningSql).not.toMatch(/create policy accountability_grants_invitee_accept_pending/i);
    expect(acceptanceHardeningSql).not.toMatch(/create policy accountability_partners_invitee_accept_pending/i);
  });

  test("does not add Atalaia policies to sensitive base tables", () => {
    for (const tableName of [
      "callings",
      "metacognition_sessions",
      "weekly_reviews",
      "inbox_items",
      "calendar_blocks",
      "focus_distractions",
      "audit_events",
      "ai_run_audits"
    ]) {
      const tablePolicyBlocks = policyBlocks.filter((block) =>
        new RegExp(`on\\s+public\\.${tableName}\\b`, "i").test(block)
      );
      const policyText = tablePolicyBlocks.join("\n");

      expect(policyText).not.toMatch(/partner|atalia|atalaia|accountability_/i);
    }
  });

  test("keeps sensitive tables owner-only in policy text when Atalaia exists elsewhere", () => {
    const ownerPolicyLoop =
      rlsBaselineSql.match(
        /foreach target_table in array array\[[\s\S]*?'garden_events'[\s\S]*?target_table \|\| '_owner_select'[\s\S]*?end loop;/i
      )?.[0] ?? "";

    expect(ownerPolicyLoop).toContain(
      "create policy %I on public.%I for select to authenticated using (user_id = (select auth.uid()))"
    );

    for (const tableName of ["metacognition_sessions", "inbox_items", "calendar_blocks"]) {
      const tablePolicyBlocks = policyBlocks.filter((block) =>
        new RegExp(`on\\s+public\\.${tableName}\\b`, "i").test(block)
      );
      const policyText = tablePolicyBlocks.join("\n");

      expect(ownerPolicyLoop).toContain(`'${tableName}'`);
      expect(policyText).not.toMatch(/has_active_accountability_grant|accountability_partner_id|partner_user_id/i);
    }

    expect(ownerPolicyLoop).not.toMatch(/has_active_accountability_grant|accountability_partner_id|partner_user_id/i);
  });
});
