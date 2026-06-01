import { expect, test } from "@playwright/test";

test("home renders the design system shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Propósito em Ação" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  await expect(page.getByText("Design system inicial em preparação", { exact: true })).toBeVisible();
});

test("dashboard initial journey renders without final product flow", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.getByRole("heading", { name: "Sua direção agora" })).toBeVisible();
  await expect(page.getByRole("main").getByText("Direção antes de agenda")).toBeVisible();
  await expect(page.getByRole("main").getByText("Módulos limitados por enquanto")).toBeVisible();
});

test("Prompt 10 metacognition renders private reflection flow", async ({ page }) => {
  await page.goto("/metacognition");

  await expect(page.getByRole("heading", { name: "Metacognição" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Clarear pensamento" })).toBeVisible();
  await expect(page.getByText("Metacognição é privada por padrão")).toBeVisible();

  await page.getByRole("button", { name: "Gerar reflexão estruturada" }).click();
  await expect(page.getByText("Privada por padrão", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Desmonte lógico" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reformulação e próxima ação" })).toBeVisible();
});

test("Prompt 10 action unblocker generates a tiny next step", async ({ page }) => {
  await page.goto("/action-unblocker");

  await expect(page.getByRole("heading", { name: "Desbloqueador de ação" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Destravar agora" })).toBeVisible();
  await expect(page.getByText("O Desbloqueador usa mock seguro nesta etapa")).toBeVisible();

  await page.getByRole("button", { name: "Gerar próximo passo" }).click();
  await expect(page.getByRole("heading", { name: "Primeiro passo" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Versão mínima aceitável" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sequência curta" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Começar agora" })).toBeVisible();
});

test("main navigation exposes foundational areas", async ({ page }) => {
  await page.goto("/");

  const navigation = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(navigation.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Desbloqueador" })).toBeVisible();
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
