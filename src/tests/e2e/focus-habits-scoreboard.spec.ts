import { expect, test } from "@playwright/test";

test("Prompt 11 focus starts, captures distraction and completes locally", async ({ page }) => {
  await page.goto("/focus?minutes=5");

  await expect(page.getByRole("heading", { name: "Modo Foco" })).toBeVisible();
  await expect(page.getByText("05:00")).toBeVisible();

  await page.getByRole("button", { name: "Iniciar foco" }).click();
  await expect(page.getByText("Foco em andamento")).toBeVisible();

  await page.getByLabel("Nota curta").fill("Comprar pilhas depois");
  await page.getByRole("button", { name: "Capturar e voltar" }).click();
  await expect(page.getByText("Comprar pilhas depois")).toBeVisible();

  await page.getByRole("button", { name: "Concluir" }).click();
  await expect(page.getByRole("heading", { name: "Sessao registrada" })).toBeVisible();
});

test("Prompt 11 habits generate a safe mock plan and mark restart", async ({ page }) => {
  await page.goto("/habits");

  await expect(page.getByRole("heading", { name: "Habitos", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Gerar plano mock" }).click();
  await expect(page.getByText("Plano revisavel")).toBeVisible();
  await expect(page.getByText("Mock seguro gerou um plano de habito revisavel")).toBeVisible();

  await page.getByRole("button", { name: "Retomei" }).click();
  await expect(page.getByText(/marcacao de habito/i)).toBeVisible();
});

test("Prompt 11 scoreboard suggests and marks restart without shame", async ({ page }) => {
  await page.goto("/scoreboard");

  await expect(page.getByRole("heading", { name: "Placar da Disciplina" })).toBeVisible();
  await page.getByRole("button", { name: "Sugerir por mock" }).click();
  await expect(page.getByText("Mock seguro sugeriu um Placar revisavel")).toBeVisible();

  await page.getByRole("button", { name: "Retomado" }).first().click();
  await expect(page.getByText(/marcacao do Placar/i)).toBeVisible();
  await expect(page.getByText(/retomadas valorizadas/i)).toBeVisible();
});
