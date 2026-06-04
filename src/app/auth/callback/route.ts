import { NextResponse, type NextRequest } from "next/server";

import { sanitizeAuthNext } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = sanitizeAuthNext(request.nextUrl.searchParams.get("next"));

  if (!code) {
    return redirectTo(request, "/auth/error?status=invalid-link");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirectTo(request, "/auth/error?status=invalid-link");
    }

    return redirectTo(request, next);
  } catch {
    return redirectTo(request, "/auth/error?status=unavailable");
  }
}
