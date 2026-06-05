import { describe, expect, test } from "vitest";

import { getReadinessAppUrlStatus, isReadinessAppUrlConfigured } from "@/app/api/ready/readiness";

describe("readiness app URL checks", () => {
  test("allows local-demo without a published HTTPS app URL", () => {
    const status = getReadinessAppUrlStatus("local-demo", "http://localhost:3000");

    expect(status).toBe("local-demo");
    expect(isReadinessAppUrlConfigured(status)).toBe(true);
  });

  test("fails closed in preview without a published HTTPS app URL", () => {
    const status = getReadinessAppUrlStatus("preview", "http://localhost:3000");

    expect(status).toBe("missing-published-https-url");
    expect(isReadinessAppUrlConfigured(status)).toBe(false);
  });

  test("passes in preview with a published HTTPS app URL", () => {
    const status = getReadinessAppUrlStatus("preview", "https://preview.example.com");

    expect(status).toBe("configured");
    expect(isReadinessAppUrlConfigured(status)).toBe(true);
  });
});
