import "server-only";

import { zodTextFormat } from "openai/helpers/zod";

import { OpenAIProviderError } from "./errors";
import { createOpenAIClient } from "./client";
import type { AiProvider } from "./types";

export function createOpenAIProvider(): AiProvider {
  return {
    name: "openai",
    async invoke({ schema, schemaName, input, instructions, model, signal }) {
      if (!model) {
        throw new OpenAIProviderError(
          "missing_api_key",
          "OpenAI model is not configured for this AI invocation."
        );
      }

      const client = createOpenAIClient();
      const isCustomBase = !!process.env.OPENAI_BASE_URL;

      if (isCustomBase) {
        const response = await client.chat.completions.create(
          {
            model,
            messages: [
              {
                role: "system",
                content:
                  `${instructions ?? "Return only valid JSON."}\n` +
                  `The answer must be valid json and conform to the schema: ${schemaName}.`
              },
              {
                role: "user",
                content: typeof input === "string" ? input : JSON.stringify(input)
              }
            ],
            response_format: { type: "json_object" },
            stream: false
          },
          {
            signal
          }
        );

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new OpenAIProviderError("provider_unavailable", "NVIDIA/OpenAI compatible response did not include content.");
        }

        try {
          return schema.parse(JSON.parse(content));
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw new OpenAIProviderError("schema_validation", "NVIDIA/OpenAI compatible response was not valid JSON.");
          }
          throw error;
        }
      } else {
        const response = await client.responses.parse(
          {
            model,
            instructions,
            input: typeof input === "string" ? input : JSON.stringify(input),
            store: false,
            text: {
              format: zodTextFormat(schema, schemaName)
            }
          },
          {
            signal
          }
        );

        if (!response.output_parsed) {
          throw new OpenAIProviderError("schema_validation", "OpenAI response did not include parsed output.");
        }

        return schema.parse(response.output_parsed);
      }
    }
  };
}
