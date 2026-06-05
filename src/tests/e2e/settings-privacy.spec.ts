import { expect, test } from "@playwright/test";

test("Etapa 7 settings renders privacy controls and saves local-demo preferences", async ({
  page
}) => {
  await page.goto("/settings");

  await expect(page.getByRole("heading", { name: "Configuracoes e privacidade" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preferencias" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "IA e consentimentos" })).toBeVisible();
  await expect(page.getByText("ai_provider_openai_v1", { exact: true })).toBeVisible();
  await expect(page.getByText("ai_provider_deepseek_v1", { exact: true })).toBeVisible();
  await expect(page.getByText(/product_analytics_v1/)).toBeVisible();
  await expect(page.getByText(/beta_feedback_v1/)).toBeVisible();

  await page.getByRole("radio", { name: /OpenAI/ }).check();
  await page.getByLabel("Tom da IA").selectOption("structured");
  await page.getByRole("radio", { name: /Leve/ }).check();
  await page.getByRole("button", { name: "Salvar preferencias" }).click();

  await expect(page.getByText("Modo local-demo: preferencias validadas sem persistencia real.")).toBeVisible();
  await expect(page.getByText("IA selecionada").locator("..")).toContainText("openai");
  await expect(page.getByText("Preferencia ativa").locator("..")).toContainText("structured - light");
});

test("Etapa 7 settings gates analytics and deletion with explicit consent", async ({
  page
}) => {
  await page.goto("/settings");

  const openAiConsent = page
    .getByText("Entendo e autorizo somente ai_provider_openai_v1.")
    .locator("xpath=ancestor::section[1]");

  await openAiConsent.getByLabel("Entendo e autorizo somente ai_provider_openai_v1.").check();
  await openAiConsent.getByRole("button", { name: "Autorizar" }).click();
  await expect(page.getByText("Modo local-demo: consentimento revisado sem persistencia real.")).toBeVisible();

  await page.getByRole("switch", { name: /Analytics first-party/ }).click();
  await expect(page.getByText("Modo local-demo: consentimento revisado sem persistencia real.")).toBeVisible();

  await page.getByPlaceholder("EXCLUIR MINHA CONTA").fill("excluir");
  await page.getByRole("button", { name: "Solicitar exclusao" }).click();
  await expect(page.getByText("Digite EXCLUIR MINHA CONTA para registrar a solicitacao")).toBeVisible();

  await page.getByPlaceholder("EXCLUIR MINHA CONTA").fill("EXCLUIR MINHA CONTA");
  await page.getByRole("button", { name: "Solicitar exclusao" }).click();
  await expect(page.getByText("Modo local-demo: solicitacao de exclusao validada sem persistencia real.")).toBeVisible();
});
