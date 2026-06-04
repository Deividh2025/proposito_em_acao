import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/config";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  const env = getPublicEnv();
  const supabasePublicKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !supabasePublicKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    supabasePublicKey
  );
}
