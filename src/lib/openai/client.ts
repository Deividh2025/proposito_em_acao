import "server-only";

import OpenAI from "openai";
import { getServerEnv } from "@/lib/config";
import { OpenAIProviderError } from "./errors";

export function createOpenAIClient() {
  const env = getServerEnv();

  if (!env.OPENAI_API_KEY) {
    throw new OpenAIProviderError("missing_api_key", "OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });
}
