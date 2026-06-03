import { randomUUID } from "node:crypto";

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
  let atalaiaActive;
  let atalaiaRevoked;

  await step("create preview Auth personas", async () => {
    userA = await createPersona("user-a");
    userB = await createPersona("user-b");
    atalaiaActive = await createPersona("atalia-active");
    atalaiaRevoked = await createPersona("atalia-revoked");
  });

  await step("sign in preview personas with anon key", async () => {
    await Promise.all([userA, userB, atalaiaActive, atalaiaRevoked].map((persona) => signIn(persona)));
  });

  let calling;
  let goal;
  let metacognition;
  let energy;
  let partnerActive;
  let partnerRevoked;
  let grantActive;
  let grantRevoked;
  let event;
  let notification;
  let commitment;

  const now = new Date().toISOString();

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
