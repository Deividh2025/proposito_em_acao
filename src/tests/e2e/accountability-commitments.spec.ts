import { expect, test } from "@playwright/test";

test("Prompt 13 accountability flow renders empty real-data states and invite preview", async ({ page }) => {
  await page.goto("/accountability");

  await expect(page.getByRole("heading", { name: "Atalaia", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Proxima acao", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nenhum Atalaia encontrado", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nenhum acesso autorizado", exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Novo Atalaia" }).click();

  await expect(page.getByRole("heading", { name: "Adicionar Atalaia a um alvo" })).toBeVisible();
  await expect(page.getByText("Acesso nunca e a conta inteira")).toBeVisible();

  await page.getByRole("button", { name: "Gerar previa" }).click();

  await expect(page.getByRole("heading", { name: "Convite para acompanhar um alvo autorizado" })).toBeVisible();
  await expect(page.getByText("privacy check ok")).toBeVisible();
  await expect(page.getByText("Previa antes de enviar")).toBeVisible();
});

test("Prompt 13 commitment document flow blocks unsafe levers and creates preview", async ({ page }) => {
  await page.goto("/commitments");

  await expect(page.getByRole("heading", { name: "Documento de Compromisso", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Alavancas de compromisso" })).toBeVisible();
  await expect(page.getByText("safe").first()).toBeVisible();

  await page.getByLabel("Consequencia restaurativa").fill("fazer humilhacao publica se eu falhar");
  await expect(page.getByText("blocked")).toBeVisible();

  await page.getByRole("button", { name: "Gerar documento" }).click();

  await expect(page.getByText("Documento revisavel", { exact: true })).toBeVisible();
  await expect(page.getByText("nao compartilhado")).toBeVisible();
  await expect(page.getByText("Revise antes de compartilhar")).toBeVisible();

  await page.getByRole("button", { name: "Salvar rascunho" }).click();
  await expect(page.getByText("Alavanca bloqueada")).toBeVisible();
});
