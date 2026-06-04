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

const serverEnvSchema = publicEnvSchema.extend({
  APP_RUNTIME_MODE: runtimeModeSchema.default("local-demo"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  SUPABASE_PROJECT_ID: z.string().optional().or(z.literal("")),
  AI_REAL_ENABLED: disabledByDefaultFlagSchema.default(false),
  EMAIL_REAL_ENABLED: disabledByDefaultFlagSchema.default(false),
  ANALYTICS_REAL_ENABLED: disabledByDefaultFlagSchema.default(false),
  FEEDBACK_REAL_ENABLED: disabledByDefaultFlagSchema.default(false),
  OPENAI_API_KEY: z.string().optional().or(z.literal("")),
  OPENAI_MODEL: z.string().optional().or(z.literal("")),
  DEEPSEEK_API_KEY: z.string().optional().or(z.literal("")),
  DEEPSEEK_BASE_URL: z.string().url().optional().or(z.literal("")),
  DEEPSEEK_MODEL_FLASH: z.string().optional().or(z.literal("")),
  DEEPSEEK_MODEL_PRO: z.string().optional().or(z.literal("")),
  EMAIL_PROVIDER: z.string().optional().or(z.literal("")),
  EMAIL_FROM: z.string().optional().or(z.literal(""))
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type AppRuntimeMode = z.infer<typeof runtimeModeSchema>;

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
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL,
    DEEPSEEK_MODEL_FLASH: process.env.DEEPSEEK_MODEL_FLASH,
    DEEPSEEK_MODEL_PRO: process.env.DEEPSEEK_MODEL_PRO,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    EMAIL_FROM: process.env.EMAIL_FROM
  });
}

export function getAppRuntimeMode(): AppRuntimeMode {
  return getServerEnv().APP_RUNTIME_MODE;
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
