import { createHash, randomUUID } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const confirmation = process.env.SUPABASE_PREVIEW_CONFIRM;
const runId = (process.env.SUPABASE_PREVIEW_RUN_ID || randomUUID().slice(0, 8)).toLowerCase();
const emailDomain = process.env.SUPABASE_PREVIEW_TEST_EMAIL_DOMAIN || "example.test";
const fixturePrefix = `preview-cutover-${runId}`;
const keepFixtures = process.env.SUPABASE_PREVIEW_KEEP_FIXTURES === "1";
const skipStorage = process.env.SUPABASE_SKIP_STORAGE_RLS === "1";
const expectedPreviewProjectRef = process.env.SUPABASE_PREVIEW_PROJECT_REF;
const allowMainProjectHarness = process.env.SUPABASE_ALLOW_MAIN_PROJECT_PREVIEW_HARNESS === "1";
const blockedProjectRefs = new Set(
  (process.env.SUPABASE_PREVIEW_BLOCKED_PROJECT_REFS || "bceumcfmjftoukzrfthe")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
);

if (confirmation !== "preview") {
  console.error("Set SUPABASE_PREVIEW_CONFIRM=preview to confirm this harness is not pointed at production.");
  process.exit(1);
}

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY for the preview branch."
  );
  process.exit(1);
}

function projectRefFromSupabaseUrl(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.endsWith(".supabase.co") ? hostname.split(".")[0] : "";
  } catch {
    return "";
  }
}

const urlProjectRef = projectRefFromSupabaseUrl(supabaseUrl);

if (expectedPreviewProjectRef && urlProjectRef !== expectedPreviewProjectRef) {
  console.error(
    `SUPABASE_PREVIEW_PROJECT_REF does not match NEXT_PUBLIC_SUPABASE_URL (${urlProjectRef || "unknown"}).`
  );
  process.exit(1);
}

if (!allowMainProjectHarness && urlProjectRef && blockedProjectRefs.has(urlProjectRef)) {
  console.error(
    "Preview harness refused to run against a blocked Supabase project ref. Use a branch preview URL/ref or set SUPABASE_ALLOW_MAIN_PROJECT_PREVIEW_HARNESS=1 only for an explicitly approved non-production dry run."
  );
  process.exit(1);
}

function makeClient(key) {
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false
    }
  });
}

const admin = makeClient(serviceRoleKey);
const personas = [];
const storageObjects = [];

function formatError(error) {
  return error?.message || String(error);
}

function hashInviteToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

async function step(label, callback) {
  await callback();
  console.log(`ok - ${label}`);
}

async function createPersona(role) {
  const email = `${fixturePrefix}-${role}@${emailDomain}`;
  const password = `Preview-${runId}-${role}-Aa1!`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      preview_cutover: true,
      preview_role: role,
      run_id: runId
    }
  });

  if (error || !data.user) {
    throw new Error(`create ${role}: ${formatError(error)}`);
  }

  const persona = {
    client: makeClient(anonKey),
    email,
    id: data.user.id,
    password,
    role
  };

  personas.push(persona);
  return persona;
}

async function signIn(persona) {
  const { data, error } = await persona.client.auth.signInWithPassword({
    email: persona.email,
    password: persona.password
  });

  if (error || data.user?.id !== persona.id) {
    throw new Error(`sign in ${persona.role}: ${formatError(error)}`);
  }
}

async function insertOne(client, table, payload, select = "*") {
  const { data, error } = await client.from(table).insert(payload).select(select).single();

  if (error || !data) {
    throw new Error(`insert ${table}: ${formatError(error)}`);
  }

  return data;
}

async function expectRows(label, query, expectedCount) {
  const { data, error } = await query;

  if (error) {
    throw new Error(`${label}: ${formatError(error)}`);
  }

  if (!Array.isArray(data) || data.length !== expectedCount) {
    throw new Error(`${label}: expected ${expectedCount} row(s), got ${Array.isArray(data) ? data.length : "null"}`);
  }
}

async function expectDeniedOrNoRows(label, query) {
  const { data, error } = await query;

  if (error) {
    return;
  }

  if (Array.isArray(data) && data.length === 0) {
    return;
  }

  throw new Error(`${label}: expected denial or zero rows.`);
}

async function expectWriteDenied(label, query) {
  const { data, error } = await query;

  if (error) {
    return;
  }

  if (Array.isArray(data) && data.length === 0) {
    return;
  }

  throw new Error(`${label}: write unexpectedly succeeded.`);
}

async function validateStorage(userA, userB, atalaiaActive) {
  if (skipStorage) {
    console.log("skip - storage RLS skipped by SUPABASE_SKIP_STORAGE_RLS=1");
    return;
  }

  const bucket = process.env.SUPABASE_PREVIEW_STORAGE_BUCKET || "user-uploads";
  const path = `${userA.id}/${fixturePrefix}.txt`;
  const body = Buffer.from(`Preview cutover fixture ${runId}`, "utf8");

  const { error: uploadError } = await userA.client.storage.from(bucket).upload(path, body, {
    contentType: "text/plain",
    upsert: false
  });

  if (uploadError) {
    throw new Error(`storage upload: ${formatError(uploadError)}`);
  }

  storageObjects.push({ bucket, path });

  const { error: userBDownloadError } = await userB.client.storage.from(bucket).download(path);
  if (!userBDownloadError) {
    throw new Error("storage user_b download unexpectedly succeeded.");
  }

  const { error: atalaiaDownloadError } = await atalaiaActive.client.storage.from(bucket).download(path);
  if (!atalaiaDownloadError) {
    throw new Error("storage Atalaia download unexpectedly succeeded.");
  }

  const { error: removeError } = await userA.client.storage.from(bucket).remove([path]);
  if (removeError) {
    throw new Error(`storage cleanup: ${formatError(removeError)}`);
  }

  storageObjects.pop();
}

async function cleanupFixtures() {
  if (keepFixtures) {
    console.log(`skip cleanup - fixtures kept for run ${runId}`);
    return;
  }

  for (const object of storageObjects.splice(0)) {
    const { error } = await admin.storage.from(object.bucket).remove([object.path]);
    if (error) {
      console.warn(`warn - could not remove storage fixture ${object.bucket}/${object.path}: ${formatError(error)}`);
    }
  }

  for (const persona of personas) {
    const { error } = await admin.auth.admin.deleteUser(persona.id);
    if (error) {
      console.warn(`warn - could not delete ${persona.role} fixture: ${formatError(error)}`);
    }
  }
}

async function run() {
  let userA;
  let userB;
  let atalaiaInvited;
  let atalaiaActive;
  let atalaiaRevoked;

  await step("create preview Auth personas", async () => {
    userA = await createPersona("user-a");
    userB = await createPersona("user-b");
    atalaiaInvited = await createPersona("atalia_invited");
    atalaiaActive = await createPersona("atalia_active");
    atalaiaRevoked = await createPersona("atalia_revoked");
  });

  await step("sign in preview personas with anon key", async () => {
    await Promise.all([userA, userB, atalaiaInvited, atalaiaActive, atalaiaRevoked].map((persona) => signIn(persona)));
  });

  let calling;
  let goal;
  let metacognition;
  let energy;
  let analyticsEvent;
  let betaFeedback;
  let deletionRequest;
  let partnerInvited;
  let partnerActive;
  let partnerRevoked;
  let grantInvited;
  let siblingInvitedGrant;
  let grantActive;
  let grantRevoked;
  let event;
  let eventRevoked;
  let notification;
  let notificationRevoked;
  let commitment;

  const now = new Date().toISOString();
  const retentionExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString();
  const inviteExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  const invitedToken = `${fixturePrefix}-atalia-invited`;
  const siblingToken = `${fixturePrefix}-atalia-sibling`;
  const invitedTokenHash = hashInviteToken(invitedToken);
  const siblingTokenHash = hashInviteToken(siblingToken);

  await step("create owner fixtures through RLS", async () => {
    calling = await insertOne(userA.client, "callings", {
      hypothesis: "Fixture privada de Chamado para cutover preview.",
      privacy_level: "private",
      status: "active",
      statement: "Chamado privado do usuario A.",
      user_id: userA.id
    });

    goal = await insertOne(userA.client, "goals", {
      calling_id: calling.id,
      description: "Fixture segura para validar RLS no preview.",
      next_action: "Validar isolamento.",
      status: "active",
      title: `Cutover preview ${runId}`,
      user_id: userA.id
    });

    metacognition = await insertOne(userA.client, "metacognition_sessions", {
      category: "overload",
      dominant_automatic_thought: "Posso pular a validacao para ganhar tempo.",
      emotional_state: "alerta",
      fact: "Estou validando um ambiente preview.",
      feeling: "cuidado",
      impulse: "pular verificacao",
      intensity_observed: "medium",
      interpretation: "A pressa pode esconder risco.",
      logical_deconstruction: "O ganho de tempo nao compensa o risco de vazamento de dados.",
      next_action: "Rodar a matriz RLS completa.",
      privacy_level: "private",
      privacy_note: "Fixture privada, nao compartilhar com Atalaia.",
      raw_thought: "fixture privada de metacognicao",
      recommended_route: "action_unblocker",
      related_goal_id: goal.id,
      share_with_accountability_allowed: false,
      user_id: userA.id
    });

    energy = await insertOne(userA.client, "energy_checkins", {
      client_mutation_id: `${fixturePrefix}-energy`,
      energy_level: "medium",
      note: "Fixture de energia do cutover.",
      source: "mobile",
      user_id: userA.id
    });

    await insertOne(admin, "consent_records", {
      accepted_at: now,
      consent_type: "product_analytics",
      metadata: {
        fixture: "preview_cutover",
        retention_days: 90
      },
      scope: "product",
      user_id: userA.id,
      version: "product_analytics_v1"
    });

    await insertOne(admin, "consent_records", {
      accepted_at: now,
      consent_type: "beta_feedback",
      metadata: {
        fixture: "preview_cutover",
        retention_days: 90
      },
      scope: "product",
      user_id: userA.id,
      version: "beta_feedback_v1"
    });

    analyticsEvent = await insertOne(admin, "product_analytics_events", {
      consent_version: "product_analytics_v1",
      event_name: "module_navigation",
      expires_at: retentionExpiresAt,
      metadata: {
        consentVersion: "product_analytics_v1",
        module: "dashboard",
        schemaVersion: "product_analytics_event_v1",
        source: "desktop",
        status: "success",
        surface: "app_shell"
      },
      occurred_at: now,
      schema_version: "product_analytics_event_v1",
      user_id: userA.id
    });

    betaFeedback = await insertOne(admin, "beta_feedback_items", {
      blocked: "Nao travei no fluxo de preview.",
      clarity_score: 4,
      comment: "Fixture segura para validar feedback beta.",
      confused: "Nada sensivel no formulario.",
      consent_version: "beta_feedback_v1",
      expires_at: retentionExpiresAt,
      friction_score: 2,
      has_sensitive_hint: false,
      module: "dashboard",
      status: "submitted",
      submitted_at: now,
      usefulness_score: 4,
      user_id: userA.id,
      worked: "A validacao ficou clara."
    });

    deletionRequest = await insertOne(userA.client, "account_deletion_requests", {
      confirmation_phrase_matched: true,
      requested_at: now,
      status: "pending_manual_review",
      user_id: userA.id
    });

    partnerInvited = await insertOne(userA.client, "accountability_partners", {
      email: atalaiaInvited.email,
      invite_expires_at: inviteExpiresAt,
      invite_token_hash: invitedTokenHash,
      name: "Atalaia Preview Convidado",
      relationship_label: "fixture-preview",
      status: "invited",
      user_id: userA.id
    });

    partnerActive = await insertOne(userA.client, "accountability_partners", {
      accepted_at: now,
      email: atalaiaActive.email,
      name: "Atalaia Preview Ativo",
      partner_user_id: atalaiaActive.id,
      relationship_label: "fixture-preview",
      status: "active",
      user_id: userA.id
    });

    partnerRevoked = await insertOne(userA.client, "accountability_partners", {
      accepted_at: now,
      email: atalaiaRevoked.email,
      name: "Atalaia Preview Revogado",
      partner_user_id: atalaiaRevoked.id,
      relationship_label: "fixture-preview",
      revoked_at: now,
      status: "revoked",
      user_id: userA.id
    });

    grantInvited = await insertOne(userA.client, "accountability_grants", {
      accountability_partner_id: partnerInvited.id,
      consent_recorded_at: now,
      consent_version: "preview_cutover_v2",
      goal_id: goal.id,
      invite_token_hash: invitedTokenHash,
      notification_frequency: "weekly",
      permissions: {
        goal_name: true,
        status: true
      },
      sharing_permissions: ["goal_name", "status"],
      status: "invited",
      tracking_level: "balanced",
      user_id: userA.id
    });

    siblingInvitedGrant = await insertOne(userA.client, "accountability_grants", {
      accountability_partner_id: partnerInvited.id,
      consent_recorded_at: now,
      consent_version: "preview_cutover_v2",
      goal_id: goal.id,
      invite_token_hash: siblingTokenHash,
      notification_frequency: "milestones_only",
      permissions: {
        goal_name: true
      },
      sharing_permissions: ["goal_name"],
      status: "invited",
      tracking_level: "light",
      user_id: userA.id
    });

    grantActive = await insertOne(userA.client, "accountability_grants", {
      accepted_at: now,
      accountability_partner_id: partnerActive.id,
      consent_recorded_at: now,
      consent_version: "preview_cutover_v1",
      goal_id: goal.id,
      notification_frequency: "weekly",
      permissions: {
        commitment_document: true,
        milestones: true,
        progress: true,
        status: true
      },
      sharing_permissions: ["status", "progress", "commitment_document"],
      status: "active",
      tracking_level: "balanced",
      user_id: userA.id
    });

    grantRevoked = await insertOne(userA.client, "accountability_grants", {
      accepted_at: now,
      accountability_partner_id: partnerRevoked.id,
      consent_recorded_at: now,
      consent_version: "preview_cutover_v1",
      goal_id: goal.id,
      permissions: {
        commitment_document: true,
        status: true
      },
      revoked_at: now,
      revoked_reason: "preview validation",
      sharing_permissions: ["status"],
      status: "revoked",
      user_id: userA.id
    });

    eventRevoked = await insertOne(admin, "accountability_events", {
      accountability_grant_id: grantRevoked.id,
      accountability_partner_id: partnerRevoked.id,
      actor_id: userA.id,
      actor_type: "owner",
      event_type: "preview_cutover_revoked_check",
      goal_id: goal.id,
      metadata_minimal: {
        kind: "preview_cutover_revoked",
        run_id: runId
      },
      user_id: userA.id
    });

    event = await insertOne(admin, "accountability_events", {
      accountability_grant_id: grantActive.id,
      accountability_partner_id: partnerActive.id,
      actor_id: userA.id,
      actor_type: "owner",
      event_type: "preview_cutover_check",
      goal_id: goal.id,
      metadata_minimal: {
        kind: "preview_cutover",
        run_id: runId
      },
      user_id: userA.id
    });

    notification = await insertOne(userA.client, "accountability_notifications", {
      accountability_grant_id: grantActive.id,
      accountability_partner_id: partnerActive.id,
      approved_at: now,
      channel: "in_app",
      goal_id: goal.id,
      notification_type: "preview_cutover_check",
      preview_payload: {
        kind: "preview_cutover",
        message: "Status minimo autorizado."
      },
      privacy_check: {
        passed: true
      },
      provider_status: "pending_provider_config",
      status: "approved",
      template_key: "preview_cutover",
      template_version: "v1",
      user_id: userA.id
    });

    notificationRevoked = await insertOne(admin, "accountability_notifications", {
      accountability_grant_id: grantRevoked.id,
      accountability_partner_id: partnerRevoked.id,
      approved_at: now,
      channel: "in_app",
      goal_id: goal.id,
      notification_type: "preview_cutover_revoked_check",
      preview_payload: {
        kind: "preview_cutover_revoked",
        message: "Status minimo revogado."
      },
      privacy_check: {
        passed: true
      },
      provider_status: "pending_provider_config",
      status: "approved",
      template_key: "preview_cutover_revoked",
      template_version: "v1",
      user_id: userA.id
    });

    commitment = await insertOne(userA.client, "commitment_documents", {
      consent_version: "preview_cutover_v1",
      content: "Documento minimo de compromisso para validar compartilhamento permitido.",
      goal_id: goal.id,
      privacy_check: {
        passed: true
      },
      reviewed_at: now,
      schema_version: "commitment_document_output_v1",
      shared_at: now,
      shared_with_atalaias: true,
      sharing_permissions: ["commitment_document"],
      status: "active",
      structured_content: {
        kind: "preview_cutover"
      },
      title: "Compromisso preview",
      user_id: userA.id
    });
  });

  await step("owner can read private owner-only rows", async () => {
    await expectRows("owner reads goal", userA.client.from("goals").select("id").eq("id", goal.id), 1);
    await expectRows(
      "owner reads metacognition",
      userA.client.from("metacognition_sessions").select("id").eq("id", metacognition.id),
      1
    );
    await expectRows(
      "owner reads energy check-in",
      userA.client.from("energy_checkins").select("id").eq("id", energy.id),
      1
    );
    await expectRows(
      "owner reads analytics event",
      userA.client.from("product_analytics_events").select("id").eq("id", analyticsEvent.id),
      1
    );
    await expectRows(
      "owner reads beta feedback",
      userA.client.from("beta_feedback_items").select("id").eq("id", betaFeedback.id),
      1
    );
    await expectRows(
      "owner reads account deletion request",
      userA.client.from("account_deletion_requests").select("id").eq("id", deletionRequest.id),
      1
    );
  });

  await step("user_b and anon cannot read user_a private rows", async () => {
    const anon = makeClient(anonKey);

    await expectDeniedOrNoRows("user_b cannot read goal", userB.client.from("goals").select("id").eq("id", goal.id));
    await expectDeniedOrNoRows(
      "user_b cannot read metacognition",
      userB.client.from("metacognition_sessions").select("id").eq("id", metacognition.id)
    );
    await expectDeniedOrNoRows(
      "anon cannot read goal",
      anon.from("goals").select("id").eq("id", goal.id)
    );
    await expectDeniedOrNoRows(
      "user_b cannot read analytics event",
      userB.client.from("product_analytics_events").select("id").eq("id", analyticsEvent.id)
    );
    await expectDeniedOrNoRows(
      "user_b cannot read beta feedback",
      userB.client.from("beta_feedback_items").select("id").eq("id", betaFeedback.id)
    );
    await expectDeniedOrNoRows(
      "user_b cannot read account deletion request",
      userB.client.from("account_deletion_requests").select("id").eq("id", deletionRequest.id)
    );
    await expectDeniedOrNoRows(
      "anon cannot read analytics event",
      anon.from("product_analytics_events").select("id").eq("id", analyticsEvent.id)
    );
  });

  await step("user_b cannot create children against user_a parents", async () => {
    await expectWriteDenied(
      "user_b cannot create project for user_a goal",
      userB.client
        .from("projects")
        .insert({
          goal_id: goal.id,
          title: "Invalid cross-owner project",
          user_id: userB.id
        })
        .select("id")
    );

    await expectWriteDenied(
      "user_b cannot write metacognition as user_a",
      userB.client
        .from("metacognition_sessions")
        .insert({
          emotional_state: "fixture",
          raw_thought: "invalid cross-owner write",
          user_id: userA.id
        })
        .select("id")
    );
    await expectWriteDenied(
      "user_b cannot write analytics as user_a",
      userB.client
        .from("product_analytics_events")
        .insert({
          consent_version: "product_analytics_v1",
          event_name: "module_navigation",
          expires_at: retentionExpiresAt,
          metadata: {
            module: "dashboard",
            source: "desktop"
          },
          schema_version: "product_analytics_event_v1",
          user_id: userA.id
        })
        .select("id")
    );
    await expectWriteDenied(
      "user_b cannot write feedback as user_a",
      userB.client
        .from("beta_feedback_items")
        .insert({
          blocked: "Invalid cross-owner write",
          clarity_score: 4,
          confused: "Invalid cross-owner write",
          consent_version: "beta_feedback_v1",
          expires_at: retentionExpiresAt,
          friction_score: 2,
          has_sensitive_hint: false,
          module: "dashboard",
          status: "submitted",
          usefulness_score: 4,
          user_id: userA.id,
          worked: "Invalid cross-owner write"
        })
        .select("id")
    );
    await expectWriteDenied(
      "user_b cannot request deletion as user_a",
      userB.client
        .from("account_deletion_requests")
        .insert({
          confirmation_phrase_matched: true,
          status: "pending_manual_review",
          user_id: userA.id
        })
        .select("id")
    );
  });

  await step("authenticated clients cannot bypass server-only analytics and feedback persistence", async () => {
    await expectWriteDenied(
      "user_a cannot directly insert analytics through anon/authenticated client",
      userA.client
        .from("product_analytics_events")
        .insert({
          consent_version: "product_analytics_v1",
          event_name: "module_navigation",
          expires_at: retentionExpiresAt,
          metadata: {
            module: "dashboard",
            source: "desktop"
          },
          occurred_at: now,
          schema_version: "product_analytics_event_v1",
          user_id: userA.id
        })
        .select("id")
    );

    await expectWriteDenied(
      "user_a cannot directly insert feedback through anon/authenticated client",
      userA.client
        .from("beta_feedback_items")
        .insert({
          blocked: "Direct insert should be denied.",
          clarity_score: 4,
          confused: "Direct insert should be denied.",
          consent_version: "beta_feedback_v1",
          expires_at: retentionExpiresAt,
          friction_score: 2,
          has_sensitive_hint: false,
          module: "dashboard",
          status: "submitted",
          submitted_at: now,
          usefulness_score: 4,
          user_id: userA.id,
          worked: "Direct insert should be denied."
        })
        .select("id")
    );
  });

  await step("atalia_invited sees only pending invite preview and cannot read grant scope", async () => {
    const anon = makeClient(anonKey);

    await expectRows(
      "atalia_invited reads own pending partner invite",
      atalaiaInvited.client.from("accountability_partners").select("id").eq("id", partnerInvited.id),
      1
    );
    await expectDeniedOrNoRows(
      "atalia_invited cannot read pending grant directly",
      atalaiaInvited.client.from("accountability_grants").select("id").eq("id", grantInvited.id)
    );
    await expectDeniedOrNoRows(
      "user_b cannot read pending Atalaia invite",
      userB.client.from("accountability_partners").select("id").eq("id", partnerInvited.id)
    );
    await expectDeniedOrNoRows(
      "anon cannot read pending Atalaia invite",
      anon.from("accountability_partners").select("id").eq("id", partnerInvited.id)
    );
  });

  await step("atalia_invited cannot escalate acceptance scope by direct update", async () => {
    await expectWriteDenied(
      "atalia_invited cannot activate partner directly",
      atalaiaInvited.client
        .from("accountability_partners")
        .update({
          accepted_at: now,
          invite_token_hash: null,
          partner_user_id: atalaiaInvited.id,
          status: "active"
        })
        .eq("id", partnerInvited.id)
        .select("id")
    );
    await expectWriteDenied(
      "atalia_invited cannot alter grant permissions",
      atalaiaInvited.client
        .from("accountability_grants")
        .update({
          permissions: {
            goal_name: true,
            metacognition: true,
            status: true
          }
        })
        .eq("id", grantInvited.id)
        .select("id")
    );
    await expectWriteDenied(
      "atalia_invited cannot alter goal_id",
      atalaiaInvited.client
        .from("accountability_grants")
        .update({ goal_id: randomUUID() })
        .eq("id", grantInvited.id)
        .select("id")
    );
    await expectWriteDenied(
      "atalia_invited cannot alter user_id",
      atalaiaInvited.client
        .from("accountability_grants")
        .update({ user_id: atalaiaInvited.id })
        .eq("id", grantInvited.id)
        .select("id")
    );
    await expectWriteDenied(
      "atalia_invited cannot alter tracking level or frequency",
      atalaiaInvited.client
        .from("accountability_grants")
        .update({ notification_frequency: "important_events", tracking_level: "firm" })
        .eq("id", grantInvited.id)
        .select("id")
    );
    await expectWriteDenied(
      "atalia_invited cannot alter expires_at",
      atalaiaInvited.client
        .from("accountability_grants")
        .update({ expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() })
        .eq("id", grantInvited.id)
        .select("id")
    );
  });

  await step("controlled acceptance activates only the invite-specific grant", async () => {
    const { data: acceptedPartner, error: acceptedPartnerError } = await admin
      .from("accountability_partners")
      .update({
        accepted_at: now,
        invite_token_hash: null,
        partner_user_id: atalaiaInvited.id,
        status: "active"
      })
      .eq("id", partnerInvited.id)
      .eq("user_id", userA.id)
      .eq("invite_token_hash", invitedTokenHash)
      .select("id")
      .single();

    if (acceptedPartnerError || acceptedPartner?.id !== partnerInvited.id) {
      throw new Error(`controlled partner acceptance: ${formatError(acceptedPartnerError)}`);
    }

    const { data: acceptedGrant, error: acceptedGrantError } = await admin
      .from("accountability_grants")
      .update({
        accepted_at: now,
        invite_token_hash: null,
        status: "active"
      })
      .eq("id", grantInvited.id)
      .eq("user_id", userA.id)
      .eq("accountability_partner_id", partnerInvited.id)
      .eq("invite_token_hash", invitedTokenHash)
      .select("id")
      .single();

    if (acceptedGrantError || acceptedGrant?.id !== grantInvited.id) {
      throw new Error(`controlled grant acceptance: ${formatError(acceptedGrantError)}`);
    }

    await expectRows(
      "atalia_invited reads only the accepted grant",
      atalaiaInvited.client.from("accountability_grants").select("id").eq("id", grantInvited.id),
      1
    );
    await expectDeniedOrNoRows(
      "atalia_invited cannot read sibling invited grant",
      atalaiaInvited.client.from("accountability_grants").select("id").eq("id", siblingInvitedGrant.id)
    );

    const { data: siblingGrant, error: siblingGrantError } = await admin
      .from("accountability_grants")
      .select("status, invite_token_hash")
      .eq("id", siblingInvitedGrant.id)
      .single();

    if (siblingGrantError || siblingGrant?.status !== "invited" || siblingGrant?.invite_token_hash !== siblingTokenHash) {
      throw new Error("controlled acceptance changed the sibling invited grant.");
    }
  });

  await step("Atalaia active sees only authorized accountability rows", async () => {
    await expectRows(
      "Atalaia reads own active partner relation",
      atalaiaActive.client.from("accountability_partners").select("id").eq("id", partnerActive.id),
      1
    );
    await expectRows(
      "Atalaia reads active grant",
      atalaiaActive.client.from("accountability_grants").select("id").eq("id", grantActive.id),
      1
    );
    await expectRows(
      "Atalaia reads minimal event",
      atalaiaActive.client.from("accountability_events").select("id").eq("id", event.id),
      1
    );
    await expectRows(
      "Atalaia reads approved notification",
      atalaiaActive.client.from("accountability_notifications").select("id").eq("id", notification.id),
      1
    );
    await expectRows(
      "Atalaia reads shared commitment document",
      atalaiaActive.client.from("commitment_documents").select("id").eq("id", commitment.id),
      1
    );
  });

  await step("Atalaia active cannot read private base tables", async () => {
    await expectDeniedOrNoRows(
      "Atalaia cannot read goal base row",
      atalaiaActive.client.from("goals").select("id").eq("id", goal.id)
    );
    await expectDeniedOrNoRows(
      "Atalaia cannot read calling",
      atalaiaActive.client.from("callings").select("id").eq("id", calling.id)
    );
    await expectDeniedOrNoRows(
      "Atalaia cannot read metacognition",
      atalaiaActive.client.from("metacognition_sessions").select("id").eq("id", metacognition.id)
    );
    await expectDeniedOrNoRows(
      "Atalaia cannot read energy check-in",
      atalaiaActive.client.from("energy_checkins").select("id").eq("id", energy.id)
    );
    await expectDeniedOrNoRows(
      "Atalaia cannot read analytics event",
      atalaiaActive.client.from("product_analytics_events").select("id").eq("id", analyticsEvent.id)
    );
    await expectDeniedOrNoRows(
      "Atalaia cannot read beta feedback",
      atalaiaActive.client.from("beta_feedback_items").select("id").eq("id", betaFeedback.id)
    );
    await expectDeniedOrNoRows(
      "Atalaia cannot read account deletion request",
      atalaiaActive.client.from("account_deletion_requests").select("id").eq("id", deletionRequest.id)
    );
  });

  await step("Atalaia cannot mutate grants or read revoked access", async () => {
    await expectWriteDenied(
      "Atalaia cannot mutate grant permissions",
      atalaiaActive.client
        .from("accountability_grants")
        .update({
          permissions: {
            commitment_document: true,
            metacognition: true
          }
        })
        .eq("id", grantActive.id)
        .select("id")
    );
    await expectDeniedOrNoRows(
      "revoked Atalaia cannot read revoked partner relation",
      atalaiaRevoked.client.from("accountability_partners").select("id").eq("id", partnerRevoked.id)
    );
    await expectDeniedOrNoRows(
      "revoked Atalaia cannot read revoked grant",
      atalaiaRevoked.client.from("accountability_grants").select("id").eq("id", grantRevoked.id)
    );
    await expectDeniedOrNoRows(
      "revoked Atalaia cannot read revoked event",
      atalaiaRevoked.client.from("accountability_events").select("id").eq("id", eventRevoked.id)
    );
    await expectDeniedOrNoRows(
      "revoked Atalaia cannot read revoked notification",
      atalaiaRevoked.client.from("accountability_notifications").select("id").eq("id", notificationRevoked.id)
    );
    await expectDeniedOrNoRows(
      "revoked Atalaia cannot read shared commitment after revocation",
      atalaiaRevoked.client.from("commitment_documents").select("id").eq("id", commitment.id)
    );
  });

  await step("revocation cuts future reads for formerly active Atalaia", async () => {
    const { error: notificationCancelError } = await admin
      .from("accountability_notifications")
      .update({ blocked_reason: "grant_revoked", status: "cancelled" })
      .eq("accountability_grant_id", grantActive.id)
      .eq("user_id", userA.id)
      .in("status", ["draft", "previewed", "approved", "queued"]);

    if (notificationCancelError) {
      throw new Error(`revoke notification fixture: ${formatError(notificationCancelError)}`);
    }

    const { error: grantRevokeError } = await admin
      .from("accountability_grants")
      .update({
        invite_token_hash: null,
        revoked_at: now,
        revoked_reason: "preview revocation check",
        status: "revoked"
      })
      .eq("id", grantActive.id)
      .eq("user_id", userA.id);

    if (grantRevokeError) {
      throw new Error(`revoke active grant fixture: ${formatError(grantRevokeError)}`);
    }

    const { error: partnerRevokeError } = await admin
      .from("accountability_partners")
      .update({ revoked_at: now, status: "revoked" })
      .eq("id", partnerActive.id)
      .eq("user_id", userA.id);

    if (partnerRevokeError) {
      throw new Error(`revoke active partner fixture: ${formatError(partnerRevokeError)}`);
    }

    await expectDeniedOrNoRows(
      "formerly active Atalaia cannot read partner after revocation",
      atalaiaActive.client.from("accountability_partners").select("id").eq("id", partnerActive.id)
    );
    await expectDeniedOrNoRows(
      "formerly active Atalaia cannot read grant after revocation",
      atalaiaActive.client.from("accountability_grants").select("id").eq("id", grantActive.id)
    );
    await expectDeniedOrNoRows(
      "formerly active Atalaia cannot read event after revocation",
      atalaiaActive.client.from("accountability_events").select("id").eq("id", event.id)
    );
    await expectDeniedOrNoRows(
      "formerly active Atalaia cannot read notification after revocation",
      atalaiaActive.client.from("accountability_notifications").select("id").eq("id", notification.id)
    );
    await expectDeniedOrNoRows(
      "formerly active Atalaia cannot read shared commitment after revocation",
      atalaiaActive.client.from("commitment_documents").select("id").eq("id", commitment.id)
    );
  });

  await step("private storage remains owner-only", async () => {
    await validateStorage(userA, userB, atalaiaActive);
  });
}

try {
  await run();
  console.log(`Supabase preview Auth/RLS harness passed for run ${runId}.`);
} catch (error) {
  console.error(`Supabase preview validation failed: ${formatError(error)}`);
  process.exitCode = 1;
} finally {
  await cleanupFixtures();
}
