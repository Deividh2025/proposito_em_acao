import type { ZodType } from "zod";

import type { AiAgentKey } from "@/ai/agents";

import { invokeAiWithSafeRouting } from "./invoke";

export async function invokeMockedAiOutput<TOutput>({
  agentKey,
  schema,
  schemaName,
  promptVersion,
  input,
  output
}: {
  agentKey: AiAgentKey;
  schema: ZodType<TOutput>;
  schemaName: string;
  promptVersion: string;
  input: unknown;
  output: TOutput;
}) {
  const result = await invokeAiWithSafeRouting({
    agentKey,
    schema,
    schemaName,
    promptVersion,
    input,
    mockOutput: output,
    fallback: output,
    realEnabled: false
  });

  return result.output;
}
