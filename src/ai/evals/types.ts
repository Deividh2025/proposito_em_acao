import type { AiAgentKey } from "@/ai/agents";
import type { BlockedBehavior } from "@/ai/schemas";
import type { AiProviderName, AiProviderPreference } from "@/lib/openai";

export type AiEvalCategory =
  | "schema"
  | "clinical"
  | "pastoral"
  | "privacy"
  | "accountability"
  | "crisis"
  | "provider"
  | "consent"
  | "runtime"
  | "timeout";

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

export type AiProviderRuntimeEvalCase = {
  id: string;
  agentKey: AiAgentKey;
  category: Extract<AiEvalCategory, "provider" | "consent" | "runtime" | "timeout" | "accountability" | "crisis">;
  preference: AiProviderPreference;
  expectedProvider: AiProviderName;
  realEnabled: boolean;
  consentState: "granted" | "missing" | "revoked" | "other_provider";
  providerCanBeCalled: boolean;
  expectedSchema: string;
  shouldBlock: boolean;
  expectedFallbackReason: string | null;
  safeExpectation: string;
};
