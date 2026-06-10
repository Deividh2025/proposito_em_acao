import { createBrowserClient } from "@supabase/ssr";
import {
  formatMissingEnvVars,
  getMissingSupabasePublicEnvVars,
  getPublicEnv,
  getSupabasePublicKey
} from "@/lib/config";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  const env = getPublicEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublicKey = getSupabasePublicKey(env);
  const missing = getMissingSupabasePublicEnvVars(env);

  if (missing.length > 0 || !supabaseUrl || !supabasePublicKey) {
    throw new Error(`Missing required Supabase environment variables: ${formatMissingEnvVars(missing)}.`);
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabasePublicKey
  );
}
