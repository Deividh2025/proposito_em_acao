import { expect, test } from "@playwright/test";

test("health endpoint returns service status", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toMatch(/application\/json/);

  const body = (await response.json()) as { ok?: boolean; service?: string };
  expect(body).toMatchObject({ ok: true, service: "proposito-em-acao" });
});
