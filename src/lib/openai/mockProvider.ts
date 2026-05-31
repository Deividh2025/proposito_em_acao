import type { AiAgentKey } from "@/ai/agents";

import type { AiProvider } from "./types";

type MockProviderFixtures = Partial<Record<AiAgentKey, unknown>>;

export function createMockAiProvider(fixtures: MockProviderFixtures): AiProvider {
  return {
    name: "mock",
    async invoke({ agentKey, schema }) {
      const fixture = fixtures[agentKey];

      if (!fixture) {
        throw new Error(`Missing mock AI fixture for agent: ${agentKey}`);
      }

      return schema.parse(fixture);
    }
  };
}
