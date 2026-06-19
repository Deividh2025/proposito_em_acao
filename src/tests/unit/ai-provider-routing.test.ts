import { beforeEach, describe, expect, test, vi } from "vitest";
import { z } from "zod";

const openAIResponsesParseMock = vi.hoisted(() => vi.fn());
const openAIChatCompletionsCreateMock = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("@/lib/openai/client", () => ({
  createOpenAIClient: () => ({
    responses: {
      parse: openAIResponsesParseMock
    },
    chat: {
      completions: {
        create: openAIChatCompletionsCreateMock
      }
    }
  })
}));

import { createDeepSeekProvider } from "@/lib/deepseek/provider";
import { createOpenAIProvider } from "@/lib/openai/provider";
import {
  checkAiDailyLimit,
  hasRequiredAiProviderConsent,
  invokeAiWithSafeRouting,
  redactAiAuditMetadata,
  resolveAiProviderRoute
} from "@/lib/ai";
import { OpenAIProviderError, safeInvokeAi } from "@/lib/openai";
import type { AiProvider, AiProviderRequest } from "@/lib/openai";

const tinyOutputSchema = z
  .object({
    message: z.string().min(1),
    user_review_required: z.literal(true)
  })
  .strict();

const safeOutput = {
  message: "Criar uma microacao revisavel sem enviar dados sensiveis.",
  user_review_required: true
};

const consentRecords = [
  {
    provider: "openai" as const,
    version: "ai_provider_openai_v1",
    grantedAt: "2026-06-04T03:00:00.000Z",
    revokedAt: null
  },
  {
    provider: "deepseek" as const,
    version: "ai_provider_deepseek_v1",
    grantedAt: "2026-06-04T03:00:00.000Z",
    revokedAt: null
  }
];

const providerModels = {
  openaiFast: "gpt-5.4-mini",
  openaiPro: "gpt-5.5",
  deepseekFlash: "deepseek-chat",
  deepseekPro: "deepseek-reasoner"
};

beforeEach(() => {
  openAIResponsesParseMock.mockReset();
  openAIChatCompletionsCreateMock.mockReset();
});

describe("AI provider routing and consent", () => {
  test("keeps real providers blocked when AI_REAL_ENABLED is false", () => {
    const route = resolveAiProviderRoute({
      agentKey: "metacognition",
      preference: "openai",
      realEnabled: false,
      consentRecords,
      models: providerModels
    });

    expect(route).toMatchObject({
      providerName: "mock",
      mode: "mock",
      fallbackReason: "ai_real_disabled"
    });
  });

  test("routes automatic preference by agent sensitivity without cross-provider fallback", () => {
    const sensitive = resolveAiProviderRoute({
      agentKey: "metacognition",
      preference: "automatic",
      realEnabled: true,
      consentRecords,
      models: providerModels
    });
    const operational = resolveAiProviderRoute({
      agentKey: "taskBreakdown",
      preference: "automatic",
      realEnabled: true,
      consentRecords,
      models: providerModels
    });

    expect(sensitive).toMatchObject({ providerName: "deepseek", mode: "real", model: "deepseek-reasoner" });
    expect(operational).toMatchObject({ providerName: "deepseek", mode: "real", model: "deepseek-chat" });
  });

  test("respects explicit openai and deepseek preferences when consent is valid", () => {
    const openaiRoute = resolveAiProviderRoute({
      agentKey: "smartGoal",
      preference: "openai",
      realEnabled: true,
      consentRecords,
      models: providerModels
    });
    const deepseekRoute = resolveAiProviderRoute({
      agentKey: "metacognition",
      preference: "deepseek",
      realEnabled: true,
      consentRecords,
      models: providerModels
    });

    expect(openaiRoute).toMatchObject({
      requestedPreference: "openai",
      providerName: "deepseek",
      mode: "real",
      model: "deepseek-chat"
    });
    expect(deepseekRoute).toMatchObject({
      requestedPreference: "deepseek",
      providerName: "deepseek",
      mode: "real",
      model: "deepseek-reasoner"
    });
  });

  test("blocks real provider when consent is absent or revoked", () => {
    expect(
      hasRequiredAiProviderConsent({
        provider: "openai",
        requiredVersion: "ai_provider_openai_v1",
        records: [{ ...consentRecords[0], revokedAt: "2026-06-04T04:00:00.000Z" }]
      })
    ).toBe(false);

    const route = resolveAiProviderRoute({
      agentKey: "taskBreakdown",
      preference: "deepseek",
      realEnabled: true,
      consentRecords: [],
      models: providerModels
    });
    const revokedRoute = resolveAiProviderRoute({
      agentKey: "metacognition",
      preference: "openai",
      realEnabled: true,
      consentRecords: [{ ...consentRecords[0], revokedAt: "2026-06-04T04:00:00.000Z" }],
      models: providerModels
    });

    expect(route).toMatchObject({
      providerName: "deepseek",
      mode: "fallback",
      fallbackReason: "missing_provider_consent"
    });
    expect(revokedRoute).toMatchObject({
      providerName: "deepseek",
      mode: "fallback",
      fallbackReason: "missing_provider_consent"
    });
  });

  test("returns a safe limit result before persistence-backed daily limits exist", () => {
    expect(checkAiDailyLimit({ usedToday: 10, dailyLimit: 10 })).toMatchObject({
      allowed: false,
      reason: "daily_user_limit_reached"
    });
    expect(checkAiDailyLimit({ usedToday: 3, dailyLimit: 10 })).toMatchObject({ allowed: true });
  });

  test("safe routing invoker keeps kill switch on mock and calls only the authorized provider", async () => {
    const openaiProvider: AiProvider = {
      name: "openai",
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };
    const deepseekProvider: AiProvider = {
      name: "deepseek",
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };

    const disabledResult = await invokeAiWithSafeRouting({
      agentKey: "smartGoal",
      preference: "openai",
      realEnabled: false,
      consentRecords,
      models: providerModels,
      providers: { openai: openaiProvider, deepseek: deepseekProvider },
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      fallback: safeOutput
    });
    const enabledResult = await invokeAiWithSafeRouting({
      agentKey: "smartGoal",
      preference: "openai",
      realEnabled: true,
      consentRecords,
      models: providerModels,
      providers: { openai: openaiProvider, deepseek: deepseekProvider },
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      fallback: safeOutput
    });

    expect(disabledResult.audit.provider).toBe("mock");
    expect(disabledResult.audit.invocation_mode).toBe("mock");
    expect(openaiProvider.invoke).not.toHaveBeenCalled();
    expect(deepseekProvider.invoke).toHaveBeenCalledTimes(1);
    expect(enabledResult.audit.provider).toBe("deepseek");
    expect(enabledResult.audit.invocation_mode).toBe("real");
  });

  test("safe routing invoker does not call another provider after selected provider failure", async () => {
    const openaiProvider: AiProvider = {
      name: "openai",
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };
    const deepseekProvider: AiProvider = {
      name: "deepseek",
      invoke: vi.fn().mockRejectedValue(new OpenAIProviderError("provider_unavailable", "DeepSeek unavailable"))
    };

    const result = await invokeAiWithSafeRouting({
      agentKey: "smartGoal",
      preference: "openai",
      realEnabled: true,
      consentRecords,
      models: providerModels,
      providers: { openai: openaiProvider, deepseek: deepseekProvider },
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      fallback: safeOutput
    });

    expect(deepseekProvider.invoke).toHaveBeenCalledTimes(1);
    expect(openaiProvider.invoke).not.toHaveBeenCalled();
    expect(result.source).toBe("fallback");
    expect(result.audit.provider).toBe("deepseek");
    expect(result.audit.fallback_reason).toBe("provider_unavailable");
  });

  test("daily user limit blocks real provider invocation before any external call", async () => {
    const deepseekProvider: AiProvider = {
      name: "deepseek",
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };

    const result = await invokeAiWithSafeRouting({
      agentKey: "smartGoal",
      preference: "openai",
      realEnabled: true,
      consentRecords,
      models: providerModels,
      providers: { deepseek: deepseekProvider },
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      fallback: safeOutput,
      usedToday: 50
    });

    expect(deepseekProvider.invoke).not.toHaveBeenCalled();
    expect(result.source).toBe("fallback");
    expect(result.audit.provider).toBe("deepseek");
    expect(result.audit.invocation_mode).toBe("fallback");
    expect(result.audit.error_category).toBe("daily_user_limit_reached");
    expect(result.audit.fallback_reason).toBe("daily_user_limit_reached");
  });
});

describe("safe AI invocation guardrails and audit", () => {
  test("marks guardrails as passed for mock/provider output instead of not_run", async () => {
    const provider: AiProvider = {
      name: "mock",
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };

    const result = await safeInvokeAi({
      agentKey: "taskBreakdown",
      provider,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "planner_prompt_v1",
      input: { task: "Organizar semana" },
      fallback: safeOutput,
      consentVersion: "ai_provider_openai_v1"
    });

    expect(result.source).toBe("provider");
    expect(result.audit.invocation_mode).toBe("mock");
    expect(result.audit.guardrail_status).toBe("passed");
    expect(result.audit.blocked_behaviors).toEqual([]);
    expect(result.audit.contains_raw_prompt).toBe(false);
    expect(result.audit.contains_raw_response).toBe(false);
    expect(result.audit.consent_version).toBe("ai_provider_openai_v1");
  });

  test("blocks direct real provider invocation without router authorization", async () => {
    const provider: AiProvider = {
      name: "openai",
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };

    const result = await safeInvokeAi({
      agentKey: "taskBreakdown",
      provider,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "planner_prompt_v1",
      input: { task: "Organizar semana" },
      fallback: safeOutput,
      model: "gpt-5.4-mini"
    });

    expect(provider.invoke).not.toHaveBeenCalled();
    expect(result.source).toBe("fallback");
    expect(result.audit.provider).toBe("openai");
    expect(result.audit.invocation_mode).toBe("fallback");
    expect(result.audit.error_category).toBe("missing_provider_consent");
    expect(result.audit.contains_raw_prompt).toBe(false);
    expect(result.audit.contains_raw_response).toBe(false);
  });

  test("blocks crisis input before provider invocation and returns fallback without raw content", async () => {
    const provider: AiProvider = {
      name: "openai",
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };

    const result = await safeInvokeAi({
      agentKey: "metacognition",
      provider,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "metacognition_prompt_v1",
      input: "Nao aguento mais viver e quero me machucar.",
      fallback: safeOutput,
      model: "gpt-5.5"
    });

    expect(provider.invoke).not.toHaveBeenCalled();
    expect(result.source).toBe("fallback");
    expect(result.audit.invocation_mode).toBe("fallback");
    expect(result.audit.status).toBe("blocked");
    expect(result.audit.guardrail_status).toBe("blocked");
    expect(result.audit.error_category).toBe("guardrail_blocked");
    expect(result.audit.blocked_behaviors).toContain("crisis_as_productivity");
  });

  test("provider failure uses local fallback without trying a different provider", async () => {
    const openaiProvider: AiProvider = {
      name: "openai",
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };
    const deepseekProvider: AiProvider = {
      name: "deepseek",
      invoke: vi.fn().mockRejectedValue(new OpenAIProviderError("provider_unavailable", "DeepSeek unavailable"))
    };

    const result = await safeInvokeAi({
      agentKey: "taskBreakdown",
      provider: deepseekProvider,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "planner_prompt_v1",
      input: { task: "Organizar semana" },
      fallback: safeOutput,
      model: "deepseek-chat",
      realProviderAuthorized: true
    });

    expect(openaiProvider.invoke).not.toHaveBeenCalled();
    expect(deepseekProvider.invoke).toHaveBeenCalledTimes(1);
    expect(result.source).toBe("fallback");
    expect(result.audit.provider).toBe("deepseek");
    expect(result.audit.invocation_mode).toBe("fallback");
    expect(result.audit.error_category).toBe("provider_unavailable");
    expect(result.audit.fallback_reason).toBe("provider_unavailable");
  });

  test("removes sensitive provider input keys before a real provider call", async () => {
    const provider: AiProvider = {
      name: "openai",
      invoke: vi.fn().mockResolvedValue(safeOutput)
    };

    await safeInvokeAi({
      agentKey: "smartGoal",
      provider,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: {
        desire: "focar",
        token: "secret-token",
        nested: {
          Raw_Prompt: "redacted-test-value",
          content: "conteudo minimo permitido para o agente"
        }
      },
      fallback: safeOutput,
      model: "gpt-5.4-mini",
      realProviderAuthorized: true
    });

    const request = vi.mocked(provider.invoke).mock.calls[0][0];

    expect(request.input).toEqual({
      desire: "focar",
      nested: {
        content: "conteudo minimo permitido para o agente"
      }
    });
    expect(request.signal).toBeDefined();
  });

  test("aborts provider signal when timeout returns local fallback", async () => {
    let signal: AbortSignal | undefined;
    const provider: AiProvider = {
      name: "openai",
      invoke<TOutput>(request: AiProviderRequest<TOutput>) {
        signal = request.signal;
        return new Promise<TOutput>(() => undefined);
      }
    };

    const result = await safeInvokeAi({
      agentKey: "smartGoal",
      provider,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      fallback: safeOutput,
      model: "gpt-5.4-mini",
      timeoutMs: 1,
      realProviderAuthorized: true
    });

    expect(result.source).toBe("fallback");
    expect(result.audit.error_category).toBe("provider_timeout");
    expect(signal?.aborted).toBe(true);
  });

  test("blocks accountability output that tries to include private metacognition context", async () => {
    const provider: AiProvider = {
      name: "mock",
      invoke: vi.fn().mockResolvedValue({
        message: "Vou enviar sua Metacognicao completa ao Atalaia.",
        user_review_required: true
      })
    };

    const result = await safeInvokeAi({
      agentKey: "accountability",
      provider,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "accountability_prompt_v1",
      input: { approvedGoal: "Retomar com cuidado" },
      fallback: safeOutput
    });

    expect(result.source).toBe("fallback");
    expect(result.audit.status).toBe("blocked");
    expect(result.audit.guardrail_status).toBe("blocked");
    expect(result.audit.blocked_behaviors).toContain("unconsented_private_sharing");
  });

  test("invalid provider schema and timeout return safe fallback metadata", async () => {
    const invalidProvider: AiProvider = {
      name: "openai",
      invoke: vi.fn().mockResolvedValue({ message: "sem revisao" })
    };

    const invalidResult = await safeInvokeAi({
      agentKey: "smartGoal",
      provider: invalidProvider,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      fallback: safeOutput,
      model: "gpt-5.4-mini",
      realProviderAuthorized: true
    });

    const slowProvider: AiProvider = {
      name: "openai",
      invoke: async <TOutput>() =>
        new Promise<TOutput>((resolve) => setTimeout(() => resolve(safeOutput as TOutput), 50))
    };

    const timeoutResult = await safeInvokeAi({
      agentKey: "smartGoal",
      provider: slowProvider,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      fallback: safeOutput,
      model: "gpt-5.4-mini",
      timeoutMs: 1,
      realProviderAuthorized: true
    });

    expect(invalidResult.source).toBe("fallback");
    expect(invalidResult.audit.status).toBe("fallback");
    expect(invalidResult.audit.error_category).toBe("schema_validation");
    expect(invalidResult.audit.guardrail_status).toBe("passed");
    expect(invalidResult.audit.fallback_reason).toBe("schema_validation");
    expect(invalidResult.audit.contains_raw_prompt).toBe(false);
    expect(invalidResult.audit.contains_raw_response).toBe(false);
    expect(timeoutResult.source).toBe("fallback");
    expect(timeoutResult.audit.status).toBe("fallback");
    expect(timeoutResult.audit.error_category).toBe("provider_timeout");
    expect(timeoutResult.audit.fallback_reason).toBe("provider_timeout");
  });

  test("recursively redacts sensitive metadata keys case-insensitively", () => {
    const metadata = redactAiAuditMetadata({
      agent_key: "metacognition",
      Raw_Prompt: "pensamento bruto",
      nested: {
        response: "resposta completa",
        safe: "ok",
        array: [{ API_KEY: "secret" }, { output: "raw" }]
      }
    });

    expect(metadata).toEqual({
      agent_key: "metacognition",
      nested: {
        safe: "ok",
        array: [{}, {}]
      },
      redacted_fields: ["Raw_Prompt", "nested.response", "nested.array.0.API_KEY", "nested.array.1.output"]
    });
  });
});

describe("DeepSeek provider adapter", () => {
  test("parses JSON output through Zod because JSON mode is not a strict schema guarantee", async () => {
    const provider = createDeepSeekProvider({
      apiKey: "test-key",
      baseURL: "https://api.deepseek.com",
      createCompletion: vi.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(safeOutput) } }]
      })
    });

    const output = await provider.invoke({
      agentKey: "taskBreakdown",
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "planner_prompt_v1",
      input: { task: "Organizar semana" },
      model: "deepseek-chat",
      instructions: "Responda em JSON valido conforme o schema."
    });

    expect(provider.name).toBe("deepseek");
    expect(output).toEqual(safeOutput);
  });

  test("rejects invalid JSON, missing content and schema-invalid DeepSeek responses", async () => {
    const invalidJsonProvider = createDeepSeekProvider({
      apiKey: "test-key",
      createCompletion: vi.fn().mockResolvedValue({
        choices: [{ message: { content: "not-json" } }]
      })
    });
    const missingContentProvider = createDeepSeekProvider({
      apiKey: "test-key",
      createCompletion: vi.fn().mockResolvedValue({
        choices: [{ message: { content: null } }]
      })
    });
    const invalidSchemaProvider = createDeepSeekProvider({
      apiKey: "test-key",
      createCompletion: vi.fn().mockResolvedValue({
        choices: [{ message: { content: JSON.stringify({ message: "sem revisao" }) } }]
      })
    });

    const request = {
      agentKey: "taskBreakdown" as const,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "planner_prompt_v1",
      input: { task: "Organizar semana" },
      model: "deepseek-chat"
    };

    await expect(invalidJsonProvider.invoke(request)).rejects.toMatchObject({ category: "schema_validation" });
    await expect(missingContentProvider.invoke(request)).rejects.toMatchObject({
      category: "provider_unavailable"
    });
    await expect(invalidSchemaProvider.invoke(request)).rejects.toMatchObject({ name: "ZodError" });
  });
});

describe("OpenAI provider adapter", () => {
  test("uses Responses structured parsing without storing raw prompts or responses", async () => {
    openAIResponsesParseMock.mockResolvedValue({ output_parsed: safeOutput });

    const provider = createOpenAIProvider();
    const output = await provider.invoke({
      agentKey: "smartGoal",
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      model: "gpt-5.4-mini",
      instructions: "Responda somente no schema."
    });

    expect(output).toEqual(safeOutput);
    expect(openAIResponsesParseMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-5.4-mini",
        store: false,
        input: JSON.stringify({ desire: "focar" })
      }),
      expect.objectContaining({
        signal: undefined
      })
    );
  });

  test("uses chat completions when OPENAI_BASE_URL is set (NVIDIA compatibility mode)", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://integrate.api.nvidia.com/v1");
    openAIChatCompletionsCreateMock.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(safeOutput) } }]
    });

    const provider = createOpenAIProvider();
    const output = await provider.invoke({
      agentKey: "smartGoal",
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
      instructions: "Responda somente no schema."
    });

    expect(output).toEqual(safeOutput);
    expect(openAIChatCompletionsCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
        response_format: { type: "json_object" },
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: "system",
            content: expect.stringContaining("Responda somente no schema.")
          }),
          expect.objectContaining({
            role: "user",
            content: JSON.stringify({ desire: "focar" })
          })
        ])
      }),
      expect.any(Object)
    );

    vi.unstubAllEnvs();
  });

  test("rejects invalid json, missing content and schema-invalid responses when OPENAI_BASE_URL is set", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://integrate.api.nvidia.com/v1");
    
    const request = {
      agentKey: "smartGoal" as const,
      schema: tinyOutputSchema,
      schemaName: "tiny_output_v1",
      promptVersion: "smart_goal_prompt_v1",
      input: { desire: "focar" },
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning"
    };

    // 1. Invalid JSON
    openAIChatCompletionsCreateMock.mockResolvedValue({
      choices: [{ message: { content: "not-json" } }]
    });
    const provider = createOpenAIProvider();
    await expect(provider.invoke(request)).rejects.toMatchObject({ category: "schema_validation" });

    // 2. Missing content
    openAIChatCompletionsCreateMock.mockResolvedValue({
      choices: [{ message: { content: null } }]
    });
    await expect(provider.invoke(request)).rejects.toMatchObject({ category: "provider_unavailable" });

    // 3. Schema invalid
    openAIChatCompletionsCreateMock.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({ message: "sem revisao" }) } }]
    });
    await expect(provider.invoke(request)).rejects.toThrow();

    vi.unstubAllEnvs();
  });
});
