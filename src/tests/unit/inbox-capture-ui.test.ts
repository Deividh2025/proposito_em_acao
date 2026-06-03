// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

const captureInboxItem = vi.fn();
const classifyInboxItem = vi.fn();
const processInboxItem = vi.fn();

vi.mock("@/app/inbox/actions", () => ({
  captureInboxItem,
  classifyInboxItem,
  processInboxItem
}));

describe("InboxCapture UI action results", () => {
  let root: Root | null = null;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = null;
    vi.clearAllMocks();
  });

  test("shows action failure as alert instead of success", async () => {
    classifyInboxItem.mockResolvedValue({
      message: "Falha simulada",
      mode: "supabase",
      ok: false
    });

    const { InboxCapture } = await import("@/components/inbox/InboxCapture");
    const host = document.createElement("div");

    await act(async () => {
      root = createRoot(host);
      root.render(React.createElement(InboxCapture));
    });

    const button = [...host.querySelectorAll("button")].find((item) =>
      item.textContent?.includes("Classificar captura")
    );

    await act(async () => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(host.querySelector('[role="alert"]')?.textContent).toContain("Falha simulada");
    expect(host.querySelector('[role="status"]')?.textContent ?? "").not.toContain("Falha simulada");
  });
});
