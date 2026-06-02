import { expect, test } from "@playwright/test";

test("Prompt 15 auth surface supports account creation and login entry points", async ({ page }) => {
  await page.goto("/auth");

  await expect(page.getByRole("heading", { name: "Acesso e conta" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Criar conta" })).toBeVisible();
  await expect(page.getByLabel("E-mail").first()).toBeVisible();
  await expect(page.getByLabel("Senha").first()).toBeVisible();
  await expect(page.getByText(/Supabase\/Auth/)).toBeVisible();
});
