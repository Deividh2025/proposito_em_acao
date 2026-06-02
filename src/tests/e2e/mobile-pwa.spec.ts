import { expect, test } from "@playwright/test";

test.use({ isMobile: true, viewport: { width: 390, height: 844 } });

test("Prompt 14 mobile shell opens quick actions without becoming desktop", async ({ page }) => {
  await page.goto("/mobile");

  await expect(page.getByRole("heading", { name: "Ações rápidas" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Capturar ideia/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /mínimo, retomada ou pausa/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /atalhos do momento/ })).toBeVisible();
  await expect(page.getByText("sem calendário complexo")).toBeVisible();
});

test("Prompt 14 mobile captures an inbox item in a few taps", async ({ page }) => {
  await page.goto("/mobile/capture");

  await page.getByLabel("Captura rápida").fill("Comprar pilhas depois do almoço");
  await page.getByRole("button", { name: "Salvar captura" }).click();

  await expect(page.getByText("Item capturado")).toBeVisible();
  await expect(page.getByText(/Item capturado\..*(local\/dev|Supabase)/)).toBeVisible();
});

test("Prompt 14 mobile marks habit and scoreboard quickly", async ({ page }) => {
  await page.goto("/mobile/habits");

  await page.getByRole("button", { name: "Mínimo feito" }).click();
  await expect(page.getByText("Hábito atualizado")).toBeVisible();

  await page.goto("/mobile/scoreboard");
  await page.getByRole("button", { name: "Retomado" }).click();
  await expect(page.getByText("Placar atualizado")).toBeVisible();
});

test("Prompt 14 mobile starts short focus and captures a distraction", async ({ page }) => {
  await page.goto("/mobile/focus");

  await page.getByRole("button", { name: "5 min", exact: true }).click();
  await page.getByRole("button", { name: "Começar foco" }).click();
  await expect(page.getByText("Foco curto iniciado")).toBeVisible();

  await page.getByLabel("Distração").fill("Responder mensagem depois");
  await page.getByRole("button", { name: "Capturar" }).click();
  await expect(page.getByText("Responder mensagem depois")).toBeVisible();
});

test("Prompt 14 mobile unblocker and metacognition use safe mocks", async ({ page }) => {
  await page.goto("/mobile/unblock");

  await page.getByLabel("O que precisa fazer?").fill("Enviar proposta");
  await page.getByRole("button", { name: "Gerar primeiro passo" }).click();
  await expect(page.getByText("Primeiro passo", { exact: true })).toBeVisible();
  await expect(page.getByText("Plano mock seguro gerado com revisao obrigatoria.")).toBeVisible();

  await page.goto("/mobile/metacognition");
  await page.getByLabel("O que estou sentindo ou pensando?").fill("Estou ansioso e acho que sempre falho");
  await page.getByRole("button", { name: "Clarear agora" }).click();
  await expect(page.getByText("Fato x interpretação")).toBeVisible();
  await expect(page.getByText("Sessão privada por padrão; não vai ao Atalaia.")).toBeVisible();
});

test("Prompt 14 mobile records energy and keeps privacy visible", async ({ page }) => {
  await page.goto("/mobile/energy");

  await page.getByRole("button", { name: "Baixa" }).click();
  await page.getByLabel("Observação opcional").fill("Dormir pouco");
  await page.getByRole("button", { name: "Registrar energia" }).click();

  await expect(page.getByText("Check-in de energia registrado")).toBeVisible();
  await expect(page.getByText("Nada é compartilhado com Atalaia.", { exact: true })).toBeVisible();
});
