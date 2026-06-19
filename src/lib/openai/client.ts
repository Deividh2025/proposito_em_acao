import "server-only";

import OpenAI from "openai";
import { OpenAIProviderError } from "./errors";

export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY ?? "";
  const baseURL = process.env.OPENAI_BASE_URL ?? "";

  if (!apiKey) {
    throw new OpenAIProviderError("missing_api_key", "OPENAI_API_KEY is not configured.");
  }

  const options: Record<string, string> = { apiKey };
  if (baseURL) {
    options.baseURL = baseURL;
  }

  return new OpenAI(options);
}
