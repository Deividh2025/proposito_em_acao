import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isProtectedRoute, isPublicRoute } from "@/lib/auth/redirects";
import { formatMissingEnvVars, getMissingSupabasePublicEnvVars, getServerEnv, getSupabasePublicKey } from "@/lib/config";
import { buildContentSecurityPolicy, generateNonce } from "@/lib/security/csp";
import type { Database } from "@/types/database";

type SupabaseCookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

type SecurityContext = {
  nonce: string;
  csp: string;
};

function getSupabasePublicConfig() {
  const env = getServerEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = getSupabasePublicKey(env);

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

function isOperationalStatusRoute(pathname: string) {
  return pathname === "/api/health" || pathname === "/api/ready";
}

function applyCspHeaders(response: NextResponse, security: SecurityContext) {
  response.headers.set("Content-Security-Policy", security.csp);
  response.headers.set("x-nonce", security.nonce);
}

function createNextResponse(
  request: NextRequest,
  security: SecurityContext,
  previousResponse?: NextResponse
) {
  // Forward the nonce/CSP on the request so Next.js can stamp the matching
  // nonce onto the framework `<script>` tags it renders for this request.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", security.nonce);
  requestHeaders.set("Content-Security-Policy", security.csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  previousResponse?.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      response.headers.set(key, value);
    }
  });

  applyCspHeaders(response, security);
  return response;
}

export async function refreshSupabaseAuth(request: NextRequest) {
  const nonce = generateNonce();
  const security: SecurityContext = { nonce, csp: buildContentSecurityPolicy(nonce) };

  const config = getSupabasePublicConfig();
  const pathname = request.nextUrl.pathname;
  const publicRoute = isPublicRoute(pathname);

  if (isOperationalStatusRoute(pathname)) {
    return createNextResponse(request, security);
  }

  if (!config) {
    if (!publicRoute && shouldFailClosedWithoutAuthConfig()) {
      const response = new NextResponse("Auth essencial ausente neste ambiente.", {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "X-Required-Env": formatMissingEnvVars(getMissingSupabasePublicEnvVars(getServerEnv()))
        }
      });
      applyCspHeaders(response, security);
      return response;
    }

    return createNextResponse(request, security);
  }

  let response = createNextResponse(request, security);

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

          response = createNextResponse(request, security, response);

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

    const redirectResponse = NextResponse.redirect(loginUrl);
    applyCspHeaders(redirectResponse, security);
    return redirectResponse;
  }

  return response;
}
