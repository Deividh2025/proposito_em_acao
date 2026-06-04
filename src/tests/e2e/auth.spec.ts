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

test("Auth surface ignores unknown status and next query values", async ({ page }) => {
  const secret = "token-super-secreto-123";

  await page.goto(`/auth?status=${secret}&next=https%3A%2F%2Fevil.example%2Fphish`);

  await expect(page.getByRole("heading", { name: "Acesso e conta" })).toBeVisible();
  await expect(page.getByText(secret)).toHaveCount(0);
  await expect(page.getByText("https://evil.example/phish")).toHaveCount(0);
});

test("Invalid Auth callback or confirmation URLs do not echo token values", async ({ page }) => {
  const secret = "codigo-secreto-nao-exibir";

  await page.goto(`/auth/callback?code=${secret}&token_hash=${secret}`);
  await expect(page.locator("body")).not.toContainText(secret);

  await page.goto(`/auth/confirm?token_hash=${secret}&type=signup`);
  await expect(page.locator("body")).not.toContainText(secret);
});

test("Local-demo keeps the dashboard available without forcing an Auth redirect", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(/Sua dire/)).toBeVisible();
});
