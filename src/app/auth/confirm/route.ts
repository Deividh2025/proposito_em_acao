import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { sanitizeAuthNext } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedOtpTypes = new Set<EmailOtpType>([
  "email",
  "email_change",
  "invite",
  "magiclink",
  "recovery",
  "signup"
]);

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

function readOtpType(value: string | null): EmailOtpType | null {
  if (!value || !allowedOtpTypes.has(value as EmailOtpType)) {
    return null;
  }

  return value as EmailOtpType;
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = readOtpType(request.nextUrl.searchParams.get("type"));
  const next = sanitizeAuthNext(request.nextUrl.searchParams.get("next"));

  if (!tokenHash || !type) {
    return redirectTo(request, "/auth/error?status=invalid-link");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type
    });

    if (error) {
      return redirectTo(request, "/auth/error?status=invalid-link");
    }

    return redirectTo(request, next);
  } catch {
    return redirectTo(request, "/auth/error?status=unavailable");
  }
}
