import { expect, test } from "@playwright/test";

test("home renders the design system shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Propósito em Ação" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  await expect(page.getByText("Design system inicial em preparação", { exact: true })).toBeVisible();
});

test("dashboard placeholder renders without final product flow", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("main").getByText("Status: em preparação")).toBeVisible();
  await expect(page.getByRole("main").getByText("NextActionCard")).toBeVisible();
});

test("metacognition placeholder keeps privacy and scope clear", async ({ page }) => {
  await page.goto("/metacognition");

  await expect(page.getByRole("heading", { name: "Metacognição" })).toBeVisible();
  await expect(page.getByRole("main").getByText("Status: em preparação")).toBeVisible();
  await expect(page.getByRole("main").getByText("Privada por padrão", { exact: true })).toBeVisible();
});

test("main navigation exposes foundational areas", async ({ page }) => {
  await page.goto("/");

  const navigation = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(navigation.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Metacognição" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Jardim" })).toBeVisible();
});

test("layout fits desktop and mobile widths", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/dashboard");
  await expect(page.getByTestId("app-shell")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();

  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto("/dashboard");
  await expect(page.getByTestId("mobile-shell")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navegação mobile" })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await expect(page.getByTestId("mobile-shell")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navegação mobile" })).toBeVisible();
});
