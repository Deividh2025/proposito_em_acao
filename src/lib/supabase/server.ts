import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  formatMissingEnvVars,
  getMissingSupabasePublicEnvVars,
  getServerEnv,
  getSupabasePublicKey
} from "@/lib/config";
import type { Database } from "@/types/database";

export async function createSupabaseServerClient() {
  const env = getServerEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublicKey = getSupabasePublicKey(env);
  const missing = getMissingSupabasePublicEnvVars(env);

  if (missing.length > 0 || !supabaseUrl || !supabasePublicKey) {
    if (env.APP_RUNTIME_MODE === "local-demo") {
      throw new Error(`Supabase public environment variables are not configured for local demo: ${formatMissingEnvVars(missing)}.`);
    }

    throw new Error(`Supabase Auth is required but these public environment variables are missing: ${formatMissingEnvVars(missing)}.`);
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    supabaseUrl,
    supabasePublicKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies. Middleware or Route Handlers
            // must refresh sessions before protected data access.
          }
        }
      }
    }
  );
}
