import { expect, test } from "@playwright/test";

test("health endpoint returns service status", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toMatch(/application\/json/);

  const body = (await response.json()) as {
    ok?: boolean;
    app?: string;
    service?: string;
    runtime?: string;
    environment?: string;
  };
  expect(body).toMatchObject({
    ok: true,
    app: expect.any(String),
    service: "proposito-em-acao",
    runtime: expect.any(String),
    environment: "sanitized"
  });
});
