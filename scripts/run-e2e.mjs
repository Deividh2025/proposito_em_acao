import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
const playwrightCli = join(root, "node_modules", "@playwright", "test", "cli.js");
const localBaseUrl = "http://127.0.0.1:3000";
const healthUrl = `${localBaseUrl}/api/health`;
const defaultReadyTimeoutMs = 60_000;
const serverLogs = [];

function childEnv(overrides = {}) {
  return {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    APP_RUNTIME_MODE: "local-demo",
    ...overrides
  };
}

function readyTimeoutMs() {
  const parsed = Number(process.env.E2E_SERVER_READY_TIMEOUT_MS ?? defaultReadyTimeoutMs);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultReadyTimeoutMs;
}

function rememberServerOutput(source, chunk) {
  const lines = chunk
    .toString("utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    serverLogs.push(`${source}: ${line}`);
  }

  while (serverLogs.length > 60) {
    serverLogs.shift();
  }
}

function formatServerLogs() {
  if (serverLogs.length === 0) {
    return "No Next server output was captured.";
  }

  return `Recent Next server output:\n${serverLogs.slice(-30).join("\n")}`;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const { env, ...spawnOptions } = options;
    const child = spawn(command, args, {
      cwd: root,
      env: childEnv(env),
      stdio: "inherit",
      windowsHide: true,
      ...spawnOptions
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? "null"}`));
    });
  });
}

async function waitForServer(getServerExit, timeoutMs = readyTimeoutMs()) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const serverExit = getServerExit();
    if (serverExit) {
      throw new Error(
        `Next server exited before readiness (code ${serverExit.code ?? "null"}, signal ${
          serverExit.signal ?? "none"
        }).\n${formatServerLogs()}`
      );
    }

    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until Next starts accepting connections.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${healthUrl} after ${timeoutMs}ms.\n${formatServerLogs()}`);
}

function stopServer(server) {
  if (!server.pid || server.killed) {
    return;
  }

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
      timeout: 5000
    });
    return;
  }

  server.kill("SIGTERM");
}

let server;
let serverExit = null;
let exitCode = 0;

function installShutdownHandlers() {
  const shutdown = (signal) => {
    if (server) {
      stopServer(server);
    }

    process.exit(signal === "SIGINT" ? 130 : 143);
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

try {
  installShutdownHandlers();
  await run(process.execPath, [nextBin, "build"]);

  server = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", "127.0.0.1", "--port", "3000"],
    {
      cwd: root,
      env: childEnv({
        HOSTNAME: "127.0.0.1",
        PORT: "3000"
      }),
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    }
  );

  server.stdout.on("data", (chunk) => rememberServerOutput("stdout", chunk));
  server.stderr.on("data", (chunk) => rememberServerOutput("stderr", chunk));
  server.on("exit", (code, signal) => {
    serverExit = { code, signal };
  });

  await waitForServer(() => serverExit);
  await run(process.execPath, [playwrightCli, "test", "--reporter=list", "--workers=1"], {
    env: {
      PLAYWRIGHT_BASE_URL: localBaseUrl
    }
  });
} catch (error) {
  exitCode = 1;
  console.error(error);
} finally {
  if (server) {
    stopServer(server);
  }
}

process.exit(exitCode);
