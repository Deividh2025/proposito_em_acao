import type { AiAgentKey } from "@/ai/agents";
import type { BlockedBehavior } from "@/ai/schemas";

export type AiEvalCategory = "schema" | "clinical" | "pastoral" | "privacy" | "accountability" | "crisis";

export type AiEvalCase = {
  id: string;
  agentKey: AiAgentKey;
  category: AiEvalCategory;
  input: string;
  expectedSchema: string;
  shouldBlock: boolean;
  expectedBlockedBehaviors: BlockedBehavior[];
  safeExpectation: string;
};
