import OpenAI from "openai";
import { getServerEnv } from "@/lib/config";

export function createOpenAIClient() {
  const env = getServerEnv();

  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });
}
