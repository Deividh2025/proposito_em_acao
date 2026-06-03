import { expect, type Locator, type Page, test } from "@playwright/test";

async function openFeedback(page: Page) {
  const feedback = page.getByRole("region", { name: "Feedback beta" }).last();

  await expect(feedback.getByRole("heading", { name: "Feedback beta" })).toBeVisible();
  await feedback.scrollIntoViewIfNeeded();
  await feedback.getByRole("button", { name: "Preparar rascunho" }).click();

  return feedback;
}

async function fillFeedbackDraft(scope: Locator, sensitive = false) {
  await scope.getByLabel("O que funcionou").fill("A proxima acao ficou clara.");
  await scope
    .getByLabel("O que confundiu")
    .fill(sensitive ? "Minha senha apareceu no texto de feedback." : "Nao entendi o que era salvo.");
  await scope.getByLabel("Onde travou").fill("Nada travou.");
}

test("Prompt 17 desktop feedback beta prepares a local draft without external send", async ({ page }) => {
  await page.goto("/dashboard");

  const feedback = await openFeedback(page);

  await expect(feedback.getByText("Feedback sem dados intimos")).toBeVisible();
  await expect(feedback.getByText(/nao envie Chamado, Metacognicao/)).toBeVisible();

  await fillFeedbackDraft(feedback, true);
  await feedback.getByRole("button", { name: "Preparar rascunho local" }).click();

  await expect(feedback.getByRole("status")).toContainText("Rascunho local/dev preparado");
  await expect(feedback.getByRole("status")).toContainText("Nada foi enviado para canal externo");
  await expect(feedback.getByRole("status")).toContainText("Revise e remova dados sensiveis");
});

test.describe("mobile feedback beta", () => {
  test.use({ isMobile: true, viewport: { width: 390, height: 844 } });

  test("Prompt 17 mobile hub opens feedback and prepares only a local draft", async ({ page }) => {
    await page.goto("/mobile");

    const feedback = await openFeedback(page);

    await expect(feedback.getByText("Feedback sem dados intimos")).toBeVisible();
    await fillFeedbackDraft(feedback);
    await feedback.getByRole("button", { name: "Preparar rascunho local" }).click();

    await expect(feedback.getByRole("status")).toContainText("Rascunho local/dev preparado");
    await expect(feedback.getByRole("status")).toContainText("Nada foi enviado para canal externo");
  });
});
