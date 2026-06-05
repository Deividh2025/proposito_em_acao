import type { AppRuntimeMode } from "@/lib/config";

export type ReadinessAppUrlStatus = "configured" | "local-demo" | "missing-published-https-url";

function isPublishedHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";

    return url.protocol === "https:" && !isLocalhost;
  } catch {
    return false;
  }
}

export function getReadinessAppUrlStatus(runtimeMode: AppRuntimeMode, appUrl: string): ReadinessAppUrlStatus {
  if (runtimeMode === "local-demo") {
    return "local-demo";
  }

  return isPublishedHttpsUrl(appUrl) ? "configured" : "missing-published-https-url";
}

export function isReadinessAppUrlConfigured(status: ReadinessAppUrlStatus) {
  return status === "configured" || status === "local-demo";
}
