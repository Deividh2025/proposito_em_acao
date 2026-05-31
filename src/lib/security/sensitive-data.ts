export const sensitiveDataCategories = [
  "faith",
  "health",
  "family",
  "finances",
  "emotions",
  "calling",
  "metacognition",
  "calendar",
  "habits",
  "weekly-review",
  "accountability"
] as const;

export type SensitiveDataCategory = (typeof sensitiveDataCategories)[number];

export const clientSecretEnvPrefixes = ["OPENAI_", "SUPABASE_SERVICE_ROLE", "EMAIL_", "WEBHOOK_"];
