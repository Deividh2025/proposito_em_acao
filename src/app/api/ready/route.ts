import { NextResponse } from "next/server";

import { getServerEnv } from "@/lib/config";
import {
  hasEssentialSupabaseConfig,
  shouldFailClosedForMissingSupabase
} from "@/lib/supabase/guards";
import { getReadinessAppUrlStatus, isReadinessAppUrlConfigured } from "./readiness";

export const dynamic = "force-dynamic";

export function GET() {
  const env = getServerEnv();
  const runtimeMode = env.APP_RUNTIME_MODE;
  const hasSupabase = hasEssentialSupabaseConfig();
  const appUrlStatus = getReadinessAppUrlStatus(runtimeMode, env.NEXT_PUBLIC_APP_URL);
  const hasPublishedAppUrl = isReadinessAppUrlConfigured(appUrlStatus);

  if ((!hasSupabase && shouldFailClosedForMissingSupabase()) || !hasPublishedAppUrl) {
    return NextResponse.json(
      {
        ok: false,
        checks: {
          appUrl: appUrlStatus,
          supabase: hasSupabase ? "configured" : "missing-essential-config"
        },
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
      supabase: hasSupabase ? "configured" : "local-demo-not-configured"
    },
    runtimeMode,
    service: "proposito-em-acao",
    timestamp: new Date().toISOString()
  });
}
