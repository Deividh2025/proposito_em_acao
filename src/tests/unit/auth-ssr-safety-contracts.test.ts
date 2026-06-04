import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test, vi } from "vitest";

vi.mock("server-only", () => ({}));

const root = process.cwd();

function readRepoFile(path: string) {
  return readFileSync(join(root, path), "utf8");
}

describe("Auth SSR safety contracts", () => {
  test("does not re-export the Supabase admin client from the public barrel", () => {
    const barrel = readRepoFile("src/lib/supabase/index.ts");
    const admin = readRepoFile("src/lib/supabase/admin.ts");

    expect(barrel).not.toMatch(/admin/i);
    expect(barrel).not.toContain("createSupabaseAdminClient");
    expect(admin).toContain('import "server-only"');
    expect(admin).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("uses getUser or getClaims, not getSession, as the server-side authorization signal", () => {
    const server = readRepoFile("src/lib/supabase/server.ts");
    const guards = readRepoFile("src/lib/supabase/guards.ts");
    const proxy = readRepoFile("src/lib/supabase/proxy.ts");
    const rootProxy = readRepoFile("proxy.ts");

    expect(`${server}\n${guards}\n${proxy}\n${rootProxy}`).not.toContain(".getSession(");
    expect(guards).toContain("assertAuthenticatedUser");
    expect(proxy).toContain(".getClaims(");
  });

  test("sanitizes next redirects to same-origin paths only", async () => {
    const { DEFAULT_AUTH_REDIRECT, appendSafeNext, sanitizeAuthNext } = await import("@/lib/auth/redirects");

    expect(sanitizeAuthNext("/dashboard")).toBe("/dashboard");
    expect(sanitizeAuthNext("/tasks?filter=today#top")).toBe("/tasks?filter=today#top");
    expect(sanitizeAuthNext("https://evil.example/phish")).toBe(DEFAULT_AUTH_REDIRECT);
    expect(sanitizeAuthNext("//evil.example/phish")).toBe(DEFAULT_AUTH_REDIRECT);
    expect(sanitizeAuthNext("/\\evil")).toBe(DEFAULT_AUTH_REDIRECT);
    expect(appendSafeNext("/auth?status=invalid", "/tasks")).toBe("/auth?status=invalid&next=%2Ftasks");
    expect(appendSafeNext("/auth?status=invalid", "https://evil.example")).toBe("/auth?status=invalid");
  });

  test("routes Auth redirects through the safe next helper", () => {
    const actions = readRepoFile("src/app/auth/actions.ts");
    const page = readRepoFile("src/app/auth/page.tsx");

    expect(actions).toContain("sanitizeAuthNext");
    expect(actions).toContain("appendSafeNext");
    expect(page).toContain("sanitizeAuthNext");
    expect(actions).not.toMatch(/redirect\(\s*readText\(formData,\s*["']next["']\)/);
    expect(actions).toContain("redirectToAuthStatus");
  });

  test("keeps Auth status rendering behind an allowlist instead of echoing raw query text", () => {
    const page = readRepoFile("src/app/auth/page.tsx");

    expect(page).toContain("statusMessages");
    expect(page).toContain("statusMessages[rawStatus]");
    expect(page).not.toMatch(/rawStatus[^?;]*\}/);
  });

  test("service worker caches only static shell assets and keeps authenticated routes network-first", () => {
    const serviceWorker = readRepoFile("public/sw.js");
    const protectedPathPatterns = [
      /["'`]\/dashboard["'`]/,
      /["'`]\/settings["'`]/,
      /["'`]\/goals/,
      /["'`]\/projects/,
      /["'`]\/tasks/,
      /["'`]\/calendar/,
      /["'`]\/inbox/,
      /["'`]\/metacognition/,
      /["'`]\/accountability/
    ];

    for (const pattern of protectedPathPatterns) {
      expect(serviceWorker).not.toMatch(pattern);
    }

    expect(serviceWorker).toContain('request.mode === "navigate"');
    expect(serviceWorker).toContain('caches.match("/offline")');
    expect(serviceWorker).not.toMatch(/cache\.put\(/);
  });
});
