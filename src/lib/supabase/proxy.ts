import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isProtectedRoute, isPublicRoute } from "@/lib/auth/redirects";
import { getServerEnv } from "@/lib/config";
import type { Database } from "@/types/database";

type SupabaseCookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

function getSupabasePublicConfig() {
  const env = getServerEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return {
    supabaseAnonKey,
    supabaseUrl
  };
}

function shouldFailClosedWithoutAuthConfig() {
  return getServerEnv().APP_RUNTIME_MODE !== "local-demo";
}

function isLocalDemoRuntime() {
  return getServerEnv().APP_RUNTIME_MODE === "local-demo";
}

function createNextResponse(request: NextRequest, previousResponse?: NextResponse) {
  const response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  previousResponse?.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      response.headers.set(key, value);
    }
  });

  return response;
}

export async function refreshSupabaseAuth(request: NextRequest) {
  const config = getSupabasePublicConfig();
  const pathname = request.nextUrl.pathname;
  const publicRoute = isPublicRoute(pathname);

  if (!config) {
    if (!publicRoute && shouldFailClosedWithoutAuthConfig()) {
      return new NextResponse("Auth essencial ausente neste ambiente.", {
        status: 503,
        headers: {
          "Cache-Control": "no-store"
        }
      });
    }

    return createNextResponse(request);
  }

  let response = createNextResponse(request);

  const supabase = createServerClient<Database>(
    config.supabaseUrl,
    config.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: SupabaseCookieToSet[], headers?: Record<string, string>) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = createNextResponse(request, response);

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headers ?? {}).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        }
      }
    }
  );

  const { data, error } = await supabase.auth.getClaims();
  const claims = error ? null : data?.claims;

  if (!isLocalDemoRuntime() && !publicRoute && isProtectedRoute(pathname) && !claims) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);

    return NextResponse.redirect(loginUrl);
  }

  return response;
}
