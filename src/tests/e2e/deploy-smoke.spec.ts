import { expect, type Page, test } from "@playwright/test";

const criticalRoutes = [
  "/",
  "/dashboard",
  "/settings",
  "/onboarding",
  "/goals",
  "/projects",
  "/tasks",
  "/calendar",
  "/inbox",
  "/mobile",
  "/auth"
];

const fatalTextPatterns = [
  /application error/i,
  /internal server error/i,
  /supabase service role/i,
  /supabase client is not configured/i,
  /openai_api_key/i,
  /supabase_service_role_key/i
];

async function expectRouteWithoutFatalErrors(page: Page, route: string) {
  const browserErrors: string[] = [];
  const onConsole = (message: { type: () => string; text: () => string }) => {
    if (message.type() === "error") {
      browserErrors.push(message.text());
    }
  };
  const onPageError = (error: Error) => browserErrors.push(error.message);

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  try {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });

    expect(response, `${route} should return a response`).toBeTruthy();
    expect(response?.status(), `${route} should render successfully`).toBe(200);
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("main").first()).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.trim().length, `${route} should not render a blank body`).toBeGreaterThan(0);
    for (const pattern of fatalTextPatterns) {
      expect(bodyText, `${route} should not render fatal provider/config text`).not.toMatch(pattern);
    }

    expect(browserErrors, `${route} should not emit browser errors`).toEqual([]);
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
}

test.describe("deploy smoke foundation", () => {
  test("critical local-demo routes render without blank or fatal states", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const route of criticalRoutes) {
      await expectRouteWithoutFatalErrors(page, route);
    }
  });

  test("settings remains usable without Supabase or Auth in local-demo", async ({ page }) => {
    await page.goto("/settings", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Configuracoes e privacidade" })).toBeVisible();
    await expect(page.getByText("Local-demo sem persistencia real")).toBeVisible();
    await expect(page.getByRole("button", { name: "Salvar preferencias" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/missing-essential-config|supabase client is not configured/i);
  });

  test("basic navigation reaches dashboard, settings and access without real login", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.locator('a[href="/dashboard"]').first().click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.locator('a[href="/settings"]').first().click();
    await expect(page).toHaveURL(/\/settings$/);

    await page.locator('a[href="/auth"]').first().click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByText("Supabase/Auth em modo local/dev")).toBeVisible();
  });
});
