import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const runtimeModes = new Set(["local-demo", "preview", "beta", "production"]);
const defaultAppName = "Prop\u00f3sito em A\u00e7\u00e3o";
const defaultVersion = "0.1.0";

function sanitizeRuntimeMode(value: string | undefined) {
  return value && runtimeModes.has(value) ? value : "local-demo";
}

function sanitizeAppName(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || defaultAppName;
}

function sanitizeVersion(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed || !/^[0-9A-Za-z.+_-]+$/.test(trimmed)) {
    return defaultVersion;
  }

  return trimmed;
}

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      app: sanitizeAppName(process.env.NEXT_PUBLIC_APP_NAME),
      service: "proposito-em-acao",
      runtime: sanitizeRuntimeMode(process.env.APP_RUNTIME_MODE),
      timestamp: new Date().toISOString(),
      version: sanitizeVersion(process.env.npm_package_version),
      environment: "sanitized"
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    }
  );
}
