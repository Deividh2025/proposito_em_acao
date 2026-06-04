export type OpenAIErrorCategory =
  | "missing_api_key"
  | "provider_unavailable"
  | "provider_timeout"
  | "ai_real_disabled"
  | "schema_validation"
  | "guardrail_blocked"
  | "missing_provider_consent"
  | "daily_user_limit_reached"
  | "provider_model_missing"
  | "unexpected";

export class OpenAIProviderError extends Error {
  readonly category: OpenAIErrorCategory;

  constructor(category: OpenAIErrorCategory, message: string) {
    super(message);
    this.name = "OpenAIProviderError";
    this.category = category;
  }
}

export function getOpenAIErrorCategory(error: unknown): OpenAIErrorCategory {
  if (error instanceof OpenAIProviderError) {
    return error.category;
  }

  if (isZodLikeError(error)) {
    return "schema_validation";
  }

  return "unexpected";
}

function isZodLikeError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: unknown }).name === "ZodError"
  );
}
