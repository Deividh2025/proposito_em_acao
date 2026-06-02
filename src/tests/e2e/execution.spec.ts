import { expect, test } from "@playwright/test";

test("Prompt 8 execution flow renders goals, projects, tasks and microtasks", async ({ page }) => {
  await page.goto("/goals");
  await expect(page.getByRole("heading", { name: "Alvos SMART-E" })).toBeVisible();
  await expect(page.getByText("Proxima acao")).toBeVisible();

  await page.goto("/goals/new");
  await expect(page.getByRole("heading", { name: "Novo alvo" })).toBeVisible();
  await page.getByRole("button", { name: "Gerar com mock" }).click();
  await expect(page.getByText("Rascunho SMART-E")).toBeVisible();
  await expect(page.getByText("Mock seguro gerou um alvo SMART-E revisavel")).toBeVisible();

  await page.goto("/projects/new");
  await expect(page.getByRole("heading", { name: "Novo projeto" })).toBeVisible();
  await page.getByRole("button", { name: "Sugerir projeto" }).click();
  await expect(page.getByText("Plano revisavel")).toBeVisible();
  await expect(page.getByText("Planejador mock gerou projeto")).toBeVisible();

  await page.goto("/tasks/new");
  await expect(page.getByRole("heading", { name: "Nova tarefa" })).toBeVisible();
  await page.getByRole("button", { name: "Quebrar tarefa" }).click();
  await expect(page.getByText("Proxima microacao")).toBeVisible();
  await page.getByLabel("1. Abrir extrato").check();
  await expect(page.getByText("Microtarefa atualizada nesta sessao.")).toBeVisible();
});

test("execution routes keep newer modules explicit about their prompt status", async ({ page }) => {
  await page.goto("/tasks");

  await expect(page.getByText("usar Desbloqueador")).toBeVisible();
  await expect(page.getByText("encaminhar para Metacognicao")).toBeVisible();

  await page.goto("/focus");
  await expect(page.getByRole("heading", { name: "Modo Foco" })).toBeVisible();
  await expect(page.getByText("Status: Prompt 11")).toBeVisible();

  await page.goto("/accountability");
  await expect(page.getByRole("heading", { name: "Atalaia" })).toBeVisible();
  await expect(page.getByText("Prompt 13")).toBeVisible();
  await expect(page.getByText("Criar convite com previa")).toBeVisible();
});
