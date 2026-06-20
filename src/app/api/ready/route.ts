import { NextResponse } from "next/server";

import { getRuntimeEnvironmentStatus, getServerEnv } from "@/lib/config";
import {
  hasEssentialSupabaseConfig,
  shouldFailClosedForMissingSupabase
} from "@/lib/supabase/guards";
import { getReadinessAppUrlStatus, isReadinessAppUrlConfigured } from "./readiness";

export const dynamic = "force-dynamic";

export function GET() {
  const env = getServerEnv();
  const runtimeMode = env.APP_RUNTIME_MODE;
  const runtimeStatus = getRuntimeEnvironmentStatus(env);
  const hasSupabase = hasEssentialSupabaseConfig();
  const appUrlStatus = getReadinessAppUrlStatus(runtimeMode, env.NEXT_PUBLIC_APP_URL);
  const hasPublishedAppUrl = isReadinessAppUrlConfigured(appUrlStatus);

  const missingKeys: string[] = [];
  if (env.AI_REAL_ENABLED && (!env.DEEPSEEK_API_KEY || env.DEEPSEEK_API_KEY.trim() === "")) {
    missingKeys.push("DEEPSEEK_API_KEY");
  }
  if (env.EMAIL_REAL_ENABLED && (!env.RESEND_API_KEY || env.RESEND_API_KEY.trim() === "")) {
    missingKeys.push("RESEND_API_KEY");
  }

  const isFailed = (!hasSupabase && shouldFailClosedForMissingSupabase()) || !hasPublishedAppUrl || missingKeys.length > 0;

  if (isFailed) {
    return NextResponse.json(
      {
        ok: false,
        checks: {
          appUrl: appUrlStatus,
          supabase: hasSupabase ? "configured" : "missing-essential-config",
          integrationKeys: missingKeys.length === 0 ? "configured" : `missing: ${missingKeys.join(", ")}`
        },
        missing: [...runtimeStatus.auth.missing, ...missingKeys],
        runtimeMode,
        service: "proposito-em-acao"
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    checks: {
      appUrl: appUrlStatus,
      supabase: hasSupabase ? "configured" : "local-demo-not-configured",
      integrationKeys: "configured"
    },
    missing: [],
    runtimeMode,
    service: "proposito-em-acao",
    timestamp: new Date().toISOString()
  });
}
