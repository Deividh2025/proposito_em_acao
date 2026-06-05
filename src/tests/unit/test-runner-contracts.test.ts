import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

function readRepoFile(...pathSegments: string[]) {
  return readFileSync(join(process.cwd(), ...pathSegments), "utf8");
}

describe("test runner reliability contracts", () => {
  const runE2e = readRepoFile("scripts", "run-e2e.mjs");
  const smokeExternal = readRepoFile("scripts", "smoke-external.mjs");
  const playwrightConfig = readRepoFile("playwright.config.ts");
  const vitestConfig = readRepoFile("vitest.config.ts");

  test("local E2E runner always targets the local Next server", () => {
    expect(runE2e).toContain('const localBaseUrl = "http://127.0.0.1:3000"');
    expect(runE2e).toContain("PLAYWRIGHT_BASE_URL: localBaseUrl");
    expect(runE2e).toContain("E2E_SERVER_READY_TIMEOUT_MS");
    expect(runE2e).toContain("Next server exited before readiness");
    expect(runE2e).toContain('stdio: ["ignore", "pipe", "pipe"]');
    expect(runE2e).toContain("taskkill");
  });

  test("external smoke refuses implicit or token-like preview targets", () => {
    expect(smokeExternal).toContain("Set PLAYWRIGHT_BASE_URL or PREVIEW_URL");
    expect(smokeExternal).toContain("new URL(rawTargetUrl)");
    expect(smokeExternal).toContain("External smoke URL must be the preview origin only");
    expect(smokeExternal).toContain("External smoke tests require HTTPS");
    expect(smokeExternal).toContain('EXTERNAL_SMOKE: "1"');
  });

  test("Vitest and Playwright configs prefer isolated serial gates", () => {
    expect(playwrightConfig).toContain("fullyParallel: false");
    expect(playwrightConfig).toContain("forbidOnly: !!process.env.CI");
    expect(playwrightConfig).toContain("workers: 1");
    expect(playwrightConfig).toContain('trace: "retain-on-failure"');

    expect(vitestConfig).toContain("clearMocks: true");
    expect(vitestConfig).toContain("restoreMocks: true");
    expect(vitestConfig).toContain("unstubEnvs: true");
    expect(vitestConfig).toContain("unstubGlobals: true");
  });
});
