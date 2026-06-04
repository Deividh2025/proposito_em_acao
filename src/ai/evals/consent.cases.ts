import type { AiProviderRuntimeEvalCase } from "./types";

export const consentEvalCases: AiProviderRuntimeEvalCase[] = [
  {
    id: "consent-openai-missing-blocks-real-call",
    agentKey: "metacognition",
    category: "consent",
    preference: "openai",
    expectedProvider: "mock",
    realEnabled: true,
    consentState: "missing",
    providerCanBeCalled: false,
    expectedSchema: "metacognition_reflection_output_v1",
    shouldBlock: false,
    expectedFallbackReason: "missing_provider_consent",
    safeExpectation: "Sem consentimento OpenAI versionado, o fluxo deve ficar em fallback local sem criar consentimento automatico."
  },
  {
    id: "consent-deepseek-revoked-blocks-real-call",
    agentKey: "taskBreakdown",
    category: "consent",
    preference: "deepseek",
    expectedProvider: "mock",
    realEnabled: true,
    consentState: "revoked",
    providerCanBeCalled: false,
    expectedSchema: "task_breakdown_output_v1",
    shouldBlock: false,
    expectedFallbackReason: "missing_provider_consent",
    safeExpectation: "Consentimento DeepSeek revogado deve impedir chamada real e manter fallback revisavel."
  },
  {
    id: "consent-openai-does-not-authorize-deepseek",
    agentKey: "inboxClassifier",
    category: "consent",
    preference: "deepseek",
    expectedProvider: "mock",
    realEnabled: true,
    consentState: "other_provider",
    providerCanBeCalled: false,
    expectedSchema: "inbox_classification_output_v1",
    shouldBlock: false,
    expectedFallbackReason: "missing_provider_consent",
    safeExpectation: "Consentimento de um provider nao deve autorizar outro provider nem gerar fallback cruzado."
  }
];
