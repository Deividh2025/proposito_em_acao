import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
const playwrightCli = join(root, "node_modules", "@playwright", "test", "cli.js");
const url = "http://127.0.0.1:3000";

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
      ...options
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

async function waitForServer(timeoutMs = 60_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until Next starts accepting connections.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
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
let exitCode = 0;

try {
  await run(process.execPath, [nextBin, "build"]);

  server = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", "127.0.0.1", "--port", "3000"],
    {
      cwd: root,
      env: process.env,
      stdio: "ignore",
      windowsHide: true
    }
  );

  await waitForServer();
  await run(process.execPath, [playwrightCli, "test", "--reporter=list", "--workers=1"]);
} catch (error) {
  exitCode = 1;
  console.error(error);
} finally {
  if (server) {
    stopServer(server);
  }
}

process.exit(exitCode);
