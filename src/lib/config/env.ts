import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Proposito em Acao"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_BETA_FEEDBACK_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal(""))
});

const runtimeModeSchema = z.enum(["local-demo", "preview", "beta", "production"]);

const disabledByDefaultFlagSchema = z
  .preprocess((value) => (value === true || value === "true" ? "true" : "false"), z.enum(["true", "false"]))
  .transform((value) => value === "true");

const aiProviderDefaultSchema = z.enum(["automatic", "openai", "deepseek"]).default("automatic");

const positiveIntegerEnvSchema = (defaultValue: number) =>
  z
    .preprocess((value) => {
      if (value === undefined || value === null || value === "") {
        return undefined;
      }

      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : value;
    }, z.number().int().positive().optional())
    .transform((value) => value ?? defaultValue);

const optionalStringEnvSchema = z.string().optional().or(z.literal(""));

const serverEnvSchema = publicEnvSchema.extend({
  APP_RUNTIME_MODE: runtimeModeSchema.default("local-demo"),
  SUPABASE_SERVICE_ROLE_KEY: optionalStringEnvSchema,
  SUPABASE_PROJECT_ID: optionalStringEnvSchema,
  AI_REAL_ENABLED: disabledByDefaultFlagSchema.default(false),
  EMAIL_REAL_ENABLED: disabledByDefaultFlagSchema.default(false),
  ANALYTICS_REAL_ENABLED: disabledByDefaultFlagSchema.default(false),
  FEEDBACK_REAL_ENABLED: disabledByDefaultFlagSchema.default(false),
  EMAIL_DOMAIN_VERIFIED: disabledByDefaultFlagSchema.default(false),
  AI_PROVIDER_DEFAULT: aiProviderDefaultSchema,
  AI_REQUEST_TIMEOUT_MS: positiveIntegerEnvSchema(20_000),
  AI_DAILY_USER_LIMIT: positiveIntegerEnvSchema(50),
  AI_AUDIT_RETENTION_DAYS: positiveIntegerEnvSchema(90),
  OPENAI_API_KEY: optionalStringEnvSchema,
  OPENAI_BASE_URL: z.string().url().optional().or(z.literal("")),
  OPENAI_MODEL: optionalStringEnvSchema,
  OPENAI_MODEL_FAST: optionalStringEnvSchema.default(""),
  OPENAI_MODEL_PRO: optionalStringEnvSchema.default(""),
  DEEPSEEK_API_KEY: optionalStringEnvSchema,
  DEEPSEEK_BASE_URL: z.string().url().optional().or(z.literal("")).default("https://integrate.api.nvidia.com/v1"),
  DEEPSEEK_MODEL_FLASH: optionalStringEnvSchema.default("deepseek-ai/deepseek-v4-pro"),
  DEEPSEEK_MODEL_PRO: optionalStringEnvSchema.default("deepseek-ai/deepseek-v4-pro"),
  EMAIL_PROVIDER: optionalStringEnvSchema,
  EMAIL_FROM: optionalStringEnvSchema,
  EMAIL_FROM_AUTH: optionalStringEnvSchema,
  EMAIL_FROM_NOTIFICATIONS: optionalStringEnvSchema,
  RESEND_API_KEY: optionalStringEnvSchema,
  RESEND_WEBHOOK_SECRET: optionalStringEnvSchema,
  RESEND_TEST_RECIPIENT: optionalStringEnvSchema
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type AppRuntimeMode = z.infer<typeof runtimeModeSchema>;

const supabasePublicKeyFallbackLabel =
  "NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

function hasValue(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

function isPublishedHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";

    return url.protocol === "https:" && !isLocalhost;
  } catch {
    return false;
  }
}

export function getPublicEnv(): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BETA_FEEDBACK_URL: process.env.NEXT_PUBLIC_BETA_FEEDBACK_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });
}

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BETA_FEEDBACK_URL: process.env.NEXT_PUBLIC_BETA_FEEDBACK_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    APP_RUNTIME_MODE: process.env.APP_RUNTIME_MODE,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
    AI_REAL_ENABLED: process.env.AI_REAL_ENABLED,
    EMAIL_REAL_ENABLED: process.env.EMAIL_REAL_ENABLED,
    ANALYTICS_REAL_ENABLED: process.env.ANALYTICS_REAL_ENABLED,
    FEEDBACK_REAL_ENABLED: process.env.FEEDBACK_REAL_ENABLED,
    EMAIL_DOMAIN_VERIFIED: process.env.EMAIL_DOMAIN_VERIFIED,
    AI_PROVIDER_DEFAULT: process.env.AI_PROVIDER_DEFAULT,
    AI_REQUEST_TIMEOUT_MS: process.env.AI_REQUEST_TIMEOUT_MS,
    AI_DAILY_USER_LIMIT: process.env.AI_DAILY_USER_LIMIT,
    AI_AUDIT_RETENTION_DAYS: process.env.AI_AUDIT_RETENTION_DAYS,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    OPENAI_MODEL_FAST: process.env.OPENAI_MODEL_FAST,
    OPENAI_MODEL_PRO: process.env.OPENAI_MODEL_PRO,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL,
    DEEPSEEK_MODEL_FLASH: process.env.DEEPSEEK_MODEL_FLASH,
    DEEPSEEK_MODEL_PRO: process.env.DEEPSEEK_MODEL_PRO,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_FROM_AUTH: process.env.EMAIL_FROM_AUTH,
    EMAIL_FROM_NOTIFICATIONS: process.env.EMAIL_FROM_NOTIFICATIONS,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_WEBHOOK_SECRET: process.env.RESEND_WEBHOOK_SECRET,
    RESEND_TEST_RECIPIENT: process.env.RESEND_TEST_RECIPIENT
  });
}

export function getAppRuntimeMode(): AppRuntimeMode {
  return getServerEnv().APP_RUNTIME_MODE;
}

export function getSupabasePublicKey(env: Pick<PublicEnv, "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY">) {
  return env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function getMissingSupabasePublicEnvVars(
  env: Pick<PublicEnv, "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" | "NEXT_PUBLIC_SUPABASE_URL">
) {
  const missing: string[] = [];

  if (!hasValue(env.NEXT_PUBLIC_SUPABASE_URL)) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!hasValue(getSupabasePublicKey(env))) {
    missing.push(supabasePublicKeyFallbackLabel);
  }

  return missing;
}

export function getRuntimeEnvironmentStatus(env = getServerEnv()) {
  const requiresRealAuth = env.APP_RUNTIME_MODE !== "local-demo";
  const missingSupabase = getMissingSupabasePublicEnvVars(env);
  const appUrlIsPublishedHttps = isPublishedHttpsUrl(env.NEXT_PUBLIC_APP_URL);
  const missingAppUrl = requiresRealAuth && !appUrlIsPublishedHttps ? ["NEXT_PUBLIC_APP_URL"] : [];

  return {
    appUrl: {
      configured: !requiresRealAuth || appUrlIsPublishedHttps,
      missing: missingAppUrl,
      publishedHttps: appUrlIsPublishedHttps,
      value: env.NEXT_PUBLIC_APP_URL
    },
    auth: {
      configured: !requiresRealAuth || (missingSupabase.length === 0 && appUrlIsPublishedHttps),
      missing: requiresRealAuth ? [...missingSupabase, ...missingAppUrl] : []
    },
    localDemoFallbackAllowed: env.APP_RUNTIME_MODE === "local-demo",
    runtimeMode: env.APP_RUNTIME_MODE,
    supabase: {
      configured: missingSupabase.length === 0,
      missing: missingSupabase
    }
  };
}

export function formatMissingEnvVars(missing: string[]) {
  return missing.length > 0 ? missing.join(", ") : "none";
}

export function getRealIntegrationFlags() {
  const env = getServerEnv();

  return {
    ai: env.AI_REAL_ENABLED,
    analytics: env.ANALYTICS_REAL_ENABLED,
    email: env.EMAIL_REAL_ENABLED,
    feedback: env.FEEDBACK_REAL_ENABLED
  };
}
