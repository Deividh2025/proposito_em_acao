import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const playwrightCli = join(root, "node_modules", "@playwright", "test", "cli.js");
const targetUrl = process.env.PLAYWRIGHT_BASE_URL || process.env.PREVIEW_URL;

if (!targetUrl) {
  console.error("Set PLAYWRIGHT_BASE_URL or PREVIEW_URL to the published preview URL.");
  process.exit(1);
}

function parseTargetUrl(rawTargetUrl) {
  try {
    return new URL(rawTargetUrl);
  } catch {
    console.error("PLAYWRIGHT_BASE_URL or PREVIEW_URL must be a valid URL.");
    process.exit(1);
  }
}

const url = parseTargetUrl(targetUrl);

if (url.username || url.password || url.search || url.hash || (url.pathname !== "/" && url.pathname !== "")) {
  console.error("External smoke URL must be the preview origin only, without credentials, path, query, or hash.");
  process.exit(1);
}

function isLocalPreview(url) {
  return url.hostname === "127.0.0.1" || url.hostname === "localhost";
}

function isTemporarySslipPreview(url) {
  return url.protocol === "http:" && (url.hostname === "sslip.io" || url.hostname.endsWith(".sslip.io"));
}

if (url.protocol !== "https:" && !isLocalPreview(url) && !isTemporarySslipPreview(url)) {
  console.error("External smoke tests require HTTPS except temporary sslip.io HTTP previews.");
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [
    playwrightCli,
    "test",
    "src/tests/e2e/external-smoke.spec.ts",
    "--project=desktop-chromium",
    "--reporter=list",
    "--workers=1"
  ],
  {
    cwd: root,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
      EXTERNAL_SMOKE: "1",
      PLAYWRIGHT_BASE_URL: url.origin
    },
    stdio: "inherit",
    windowsHide: true
  }
);

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
