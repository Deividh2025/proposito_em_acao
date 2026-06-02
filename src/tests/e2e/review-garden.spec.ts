import { expect, test } from "@playwright/test";

test("Prompt 12 weekly review generates a structured mock summary and saves locally", async ({ page }) => {
  await page.goto("/review");

  await expect(page.getByRole("heading", { name: "Revisao semanal" })).toBeVisible();
  await expect(page.getByText("Revisao privada por padrao")).toBeVisible();

  await page.getByRole("button", { name: "Gerar sintese mock" }).click();
  await expect(page.getByText("Mock seguro gerou uma revisao estruturada")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Resumo da semana" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Foco da proxima semana" })).toBeVisible();
  await expect(page.getByText("Retomada visivel")).toBeVisible();

  await page.getByRole("button", { name: "Salvar revisao" }).click();
  await expect(page.getByText(/Revisao mantida local\/dev|Modo local seguro|Revisao e Jardim salvos/)).toBeVisible();
});

test("Prompt 12 garden shows all life areas with care instead of punishment", async ({ page }) => {
  await page.goto("/garden");

  await expect(page.getByRole("heading", { name: "Jardim da Vida" })).toBeVisible();
  await expect(page.getByText("Jardim privado e derivado")).toBeVisible();
  await expect(page.getByText("Progresso visual sem vergonha")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Fe e espiritualidade" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Descanso" })).toBeVisible();
  await expect(page.getByText("Convite de cuidado, nao punicao.").first()).toBeVisible();
  await expect(page.getByText(/falhou|fracasso|perdeu tudo/i)).toHaveCount(0);
});
