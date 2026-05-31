export type OpenAIErrorCategory =
  | "missing_api_key"
  | "provider_unavailable"
  | "schema_validation"
  | "guardrail_blocked"
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

  return "unexpected";
}
