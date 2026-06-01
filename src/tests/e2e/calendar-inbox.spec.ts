import { expect, test } from "@playwright/test";

test("Prompt 9 calendar renders week, day, blocks and overload care", async ({ page }) => {
  await page.goto("/calendar");

  await expect(page.getByRole("heading", { name: "Calendário de execução" })).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "Semana" })).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "Dia" })).toBeVisible();
  await expect(page.getByRole("button", { exact: true, name: "Hoje" })).toBeVisible();
  await expect(page.getByText("Próxima ação", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, name: "Organizar finanças" }).first()).toBeVisible();
  await expect(page.getByText("Esta agenda parece pesada")).toBeVisible();
  await expect(page.getByText("Tarefas não agendadas")).toBeVisible();
  await expect(page.getByText("Inbox recente")).toBeVisible();
});

test("Prompt 9 calendar creates and reschedules a local block", async ({ page }) => {
  await page.goto("/calendar");

  await page.getByLabel("Título do bloco").fill("Revisar orçamento familiar");
  await page.getByLabel("Tipo de bloco").selectOption("family");
  await page.getByLabel("Início").fill("2026-06-03T15:00");
  await page.getByLabel("Fim").fill("2026-06-03T15:30");
  await page.getByRole("button", { name: "Criar bloco" }).click();

  await expect(page.getByText("Bloco criado nesta sessão local/dev.")).toBeVisible();
  await expect(page.getByText("Revisar orçamento familiar")).toBeVisible();

  await page.getByRole("button", { name: "Reagendar Revisar orçamento familiar" }).click();
  await expect(page.getByText("Bloco reagendado sem culpa.")).toBeVisible();
});

test("Prompt 9 inbox captures, classifies and converts an item", async ({ page }) => {
  await page.goto("/inbox");

  await expect(page.getByRole("heading", { name: "Caixa de entrada" })).toBeVisible();
  await page.getByLabel("Captura rápida").fill("Agendar revisão financeira sexta às 9h por 25 minutos");
  await page.getByRole("button", { name: "Capturar" }).click();

  await expect(page.getByText("Item capturado nesta sessão local/dev.")).toBeVisible();
  await page.getByRole("button", { name: "Classificar captura" }).click();
  const processPanel = page.getByRole("region", { name: "Processamento da captura" });
  await expect(processPanel.getByText("calendar_event")).toBeVisible();
  await expect(processPanel.getByText("Agendar", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Converter em bloco" }).click();
  await expect(page.getByText("Item convertido em bloco de calendário local/dev.")).toBeVisible();
});
