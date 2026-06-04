import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getServerEnv } from "@/lib/config";
import type { Database } from "@/types/database";

export async function createSupabaseServerClient() {
  const env = getServerEnv();
  const supabasePublicKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !supabasePublicKey) {
    if (env.APP_RUNTIME_MODE === "local-demo") {
      throw new Error("Supabase public environment variables are not configured for local demo.");
    }

    throw new Error("Supabase Auth is required but public environment variables are not configured.");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
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
