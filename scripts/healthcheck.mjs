const defaultHealthTarget = "http://127.0.0.1:3000";
const rawTarget =
  process.env.HEALTHCHECK_URL ||
  process.env.PLAYWRIGHT_BASE_URL ||
  process.env.PREVIEW_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  defaultHealthTarget;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseHealthUrl(rawValue) {
  let parsed;

  try {
    parsed = new URL(rawValue);
  } catch {
    fail("HEALTHCHECK_URL, PLAYWRIGHT_BASE_URL, PREVIEW_URL or NEXT_PUBLIC_APP_URL must be a valid URL.");
  }

  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    fail("Healthcheck URL must not contain credentials, query strings or fragments.");
  }

  if (parsed.pathname === "" || parsed.pathname === "/") {
    parsed.pathname = "/api/health";
    return parsed;
  }

  if (parsed.pathname !== "/api/health") {
    fail("Healthcheck URL must be an origin or the /api/health endpoint.");
  }

  return parsed;
}

function assertNoSecretShape(payloadText) {
  const forbiddenPatterns = [
    /SUPABASE_SERVICE_ROLE_KEY/i,
    /OPENAI_API_KEY/i,
    /DEEPSEEK_API_KEY/i,
    /RESEND_API_KEY/i,
    /PRIVATE KEY/i,
    /BEGIN [A-Z ]*PRIVATE KEY/i,
    /\bsk-[A-Za-z0-9_-]{12,}/
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(payloadText)) {
      fail("Healthcheck response appears to expose a secret-like value.");
    }
  }
}

const healthUrl = parseHealthUrl(rawTarget);

try {
  const response = await fetch(healthUrl, {
    headers: {
      Accept: "application/json"
    }
  });
  const bodyText = await response.text();

  assertNoSecretShape(bodyText);

  if (!response.ok) {
    fail(`Healthcheck failed with HTTP ${response.status} at ${healthUrl.origin}/api/health.`);
  }

  let body;
  try {
    body = JSON.parse(bodyText);
  } catch {
    fail("Healthcheck response was not valid JSON.");
  }

  if (body?.ok !== true || body?.environment !== "sanitized") {
    fail("Healthcheck response did not match the expected sanitized ok:true contract.");
  }

  console.log(
    `Healthcheck ok: ${healthUrl.origin}/api/health runtime=${String(body.runtime ?? "unknown")} version=${String(
      body.version ?? "unknown"
    )}`
  );
} catch (error) {
  fail(error instanceof Error ? error.message : "Healthcheck failed.");
}
