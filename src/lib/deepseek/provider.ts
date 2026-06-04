import "server-only";

import OpenAI from "openai";

import { OpenAIProviderError } from "@/lib/openai";
import type { AiProvider } from "@/lib/openai";

type DeepSeekCompletionFactory = (request: {
  model: string;
  messages: Array<{ role: "system" | "user"; content: string }>;
  response_format: { type: "json_object" };
  stream: false;
}, options?: { signal?: AbortSignal }) => Promise<unknown>;

export type DeepSeekProviderOptions = {
  apiKey?: string;
  baseURL?: string;
  createCompletion?: DeepSeekCompletionFactory;
};

export function createDeepSeekProvider(options: DeepSeekProviderOptions = {}): AiProvider {
  return {
    name: "deepseek",
    async invoke({ schema, input, instructions, model, signal }) {
      if (!model) {
        throw new OpenAIProviderError(
          "missing_api_key",
          "DeepSeek model is not configured for this AI invocation."
        );
      }

      const createCompletion = options.createCompletion ?? createDefaultDeepSeekCompletion(options);
      const response = await createCompletion(
        {
          model,
          messages: [
            {
              role: "system",
              content:
                `${instructions ?? "Return only valid JSON."}\n` +
                "The answer must be valid json and will be validated by a server-side Zod schema."
            },
            {
              role: "user",
              content: typeof input === "string" ? input : JSON.stringify(input)
            }
          ],
          response_format: { type: "json_object" },
          stream: false
        },
        { signal }
      );

      const content = extractDeepSeekContent(response);

      if (!content) {
        throw new OpenAIProviderError("provider_unavailable", "DeepSeek response did not include JSON content.");
      }

      try {
        return schema.parse(JSON.parse(content));
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new OpenAIProviderError("schema_validation", "DeepSeek response was not valid JSON.");
        }

        throw error;
      }
    }
  };
}

function createDefaultDeepSeekCompletion(options: DeepSeekProviderOptions): DeepSeekCompletionFactory {
  const apiKey = options.apiKey ?? process.env.DEEPSEEK_API_KEY ?? "";
  const baseURL = options.baseURL ?? process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";

  if (!apiKey) {
    throw new OpenAIProviderError("missing_api_key", "DEEPSEEK_API_KEY is not configured.");
  }

  const client = new OpenAI({
    apiKey,
    baseURL: baseURL || "https://api.deepseek.com"
  });

  return (request, options) => client.chat.completions.create(request, { signal: options?.signal });
}

function extractDeepSeekContent(response: unknown) {
  if (!isRecord(response)) {
    return null;
  }

  const choices = response.choices;

  if (!Array.isArray(choices)) {
    return null;
  }

  const first = choices[0];

  if (!isRecord(first) || !isRecord(first.message)) {
    return null;
  }

  return typeof first.message.content === "string" ? first.message.content : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
