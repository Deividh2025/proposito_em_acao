import { NextResponse } from "next/server";

import { getAppRuntimeMode } from "@/lib/config";
import {
  hasEssentialSupabaseConfig,
  shouldFailClosedForMissingSupabase
} from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

export function GET() {
  const runtimeMode = getAppRuntimeMode();
  const hasSupabase = hasEssentialSupabaseConfig();

  if (!hasSupabase && shouldFailClosedForMissingSupabase()) {
    return NextResponse.json(
      {
        ok: false,
        checks: {
          supabase: "missing-essential-config"
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
      supabase: hasSupabase ? "configured" : "local-demo-not-configured"
    },
    runtimeMode,
    service: "proposito-em-acao",
    timestamp: new Date().toISOString()
  });
}
