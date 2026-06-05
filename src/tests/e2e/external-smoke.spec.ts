import { expect, type Page, test } from "@playwright/test";

test.skip(process.env.EXTERNAL_SMOKE !== "1", "External smoke runs only via npm run test:e2e:external.");

const desktopRoutes = [
  "/",
  "/auth",
  "/dashboard",
  "/goals",
  "/projects",
  "/tasks",
  "/calendar",
  "/inbox",
  "/action-unblocker",
  "/metacognition",
  "/focus",
  "/habits",
  "/scoreboard",
  "/review",
  "/garden",
  "/accountability",
  "/settings"
];

const mobileRoutes = [
  "/mobile",
  "/mobile/capture",
  "/mobile/focus",
  "/mobile/habits",
  "/mobile/scoreboard",
  "/mobile/unblock",
  "/mobile/metacognition",
  "/mobile/energy",
  "/offline"
];

const forbiddenServiceWorkerCachePaths = [
  "/auth",
  "/auth/callback",
  "/auth/confirm",
  "/auth/forgot-password",
  "/auth/update-password",
  "/dashboard",
  "/goals",
  "/projects",
  "/tasks",
  "/calendar",
  "/inbox",
  "/metacognition",
  "/review",
  "/settings",
  "/settings/export",
  "/api/"
];

function expectSecurityHeaders(headers: Record<string, string>) {
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBeTruthy();
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
}

function expectNoStore(headers: Record<string, string>) {
  expect(headers["cache-control"] ?? "").toMatch(/\bno-store\b/i);
}

async function expectRouteRenders(page: Page, route: string) {
  const runtimeErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  const response = await page.goto(route, { waitUntil: "domcontentloaded" });

  expect(response, `${route} should return a response`).toBeTruthy();
  expect(response?.status(), `${route} should not be 5xx`).toBeLessThan(500);
  expectSecurityHeaders(response?.headers() ?? {});
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("main").first()).toBeVisible();
  expect(runtimeErrors, `${route} should not emit console/page errors`).toEqual([]);
}

test.describe("external HTTPS smoke", () => {
  test("health and readiness endpoints are live", async ({ request }) => {
    const health = await request.get("/api/health", { failOnStatusCode: false });

    expect(health.status()).toBe(200);
    expectSecurityHeaders(health.headers());
    expect(health.headers()["content-type"]).toMatch(/application\/json/);
    expect(await health.json()).toMatchObject({ ok: true, service: "proposito-em-acao" });

    const readiness = await request.get("/api/ready", { failOnStatusCode: false });

    expect(readiness.status()).toBe(200);
    expectSecurityHeaders(readiness.headers());
    expect(readiness.headers()["content-type"]).toMatch(/application\/json/);
    expect(await readiness.json()).toMatchObject({ ok: true, service: "proposito-em-acao" });
  });

  test("desktop critical routes render without browser errors", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const route of desktopRoutes) {
      await expectRouteRenders(page, route);
    }
  });

  test("mobile and PWA routes render without browser errors", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of mobileRoutes) {
      await expectRouteRenders(page, route);
    }
  });

  test("PWA assets are available and do not cache authenticated routes", async ({ request }) => {
    const manifest = await request.get("/manifest.json", { failOnStatusCode: false });

    expect(manifest.status()).toBe(200);
    expectSecurityHeaders(manifest.headers());
    expect(manifest.headers()["content-type"]).toMatch(/application\/manifest\+json|application\/json/);
    expect(await manifest.json()).toMatchObject({
      display: "standalone",
      start_url: "/mobile"
    });

    const serviceWorker = await request.get("/sw.js", { failOnStatusCode: false });

    expect(serviceWorker.status()).toBe(200);
    expectSecurityHeaders(serviceWorker.headers());
    expect(serviceWorker.headers()["content-type"]).toMatch(/javascript/);
    expectNoStore(serviceWorker.headers());

    const serviceWorkerBody = await serviceWorker.text();
    expect(serviceWorkerBody).toContain('request.mode === "navigate"');
    expect(serviceWorkerBody).toContain('caches.match("/offline")');
    expect(serviceWorkerBody).not.toContain("cache.put(");
    for (const path of forbiddenServiceWorkerCachePaths) {
      expect(serviceWorkerBody).not.toContain(`"${path}"`);
      expect(serviceWorkerBody).not.toContain(`'${path}'`);
    }
  });

  test("authenticated export and auth callbacks are not stored by caches", async ({ request }) => {
    const exportResponse = await request.get("/settings/export", { failOnStatusCode: false });

    expect([200, 401, 403]).toContain(exportResponse.status());
    expectSecurityHeaders(exportResponse.headers());
    expectNoStore(exportResponse.headers());

    for (const route of ["/auth/callback", "/auth/confirm"]) {
      const response = await request.get(route, {
        failOnStatusCode: false,
        maxRedirects: 0
      });

      expect([302, 303, 307, 308, 400]).toContain(response.status());
      expectSecurityHeaders(response.headers());
      expect((response.headers()["cache-control"] ?? "no-store")).toMatch(/\b(no-store|no-cache|private)\b/i);
    }
  });
});
