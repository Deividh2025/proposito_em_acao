import "server-only";

import { zodTextFormat } from "openai/helpers/zod";

import { OpenAIProviderError } from "./errors";
import { createOpenAIClient } from "./client";
import type { AiProvider } from "./types";

export function createOpenAIProvider(): AiProvider {
  return {
    name: "openai",
    async invoke({ schema, schemaName, input, instructions, model }) {
      if (!model) {
        throw new OpenAIProviderError(
          "missing_api_key",
          "OpenAI model is not configured for this AI invocation."
        );
      }

      const client = createOpenAIClient();
      const response = await client.responses.parse({
        model,
        instructions,
        input: typeof input === "string" ? input : JSON.stringify(input),
        store: false,
        text: {
          format: zodTextFormat(schema, schemaName)
        }
      });

      if (!response.output_parsed) {
        throw new OpenAIProviderError("schema_validation", "OpenAI response did not include parsed output.");
      }

      return schema.parse(response.output_parsed);
    }
  };
}
