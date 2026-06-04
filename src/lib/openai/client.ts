import "server-only";

import OpenAI from "openai";
import { OpenAIProviderError } from "./errors";

export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY ?? "";

  if (!apiKey) {
    throw new OpenAIProviderError("missing_api_key", "OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey
  });
}
