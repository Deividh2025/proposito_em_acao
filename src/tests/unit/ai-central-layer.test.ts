import { describe, expect, it } from "vitest";
import type { ZodType } from "zod";

import { aiAgents, getAiAgentDefinition } from "@/ai/agents";
import {
  accountabilityMessageOutputSchema,
  actionUnblockerOutputSchema,
  aiRunAuditSchema,
  callingOutputSchema,
  guardrailReviewOutputSchema,
  habitPlanOutputSchema,
  inboxClassificationOutputSchema,
  lifeMapAnalysisOutputSchema,
  metacognitionOutputSchema,
  projectPlanOutputSchema,
  smartGoalOutputSchema,
  taskBreakdownOutputSchema,
  weeklyReviewOutputSchema
} from "@/ai/schemas";
import {
  reviewAccountabilityGuardrails,
  reviewAiSafety,
  reviewClinicalGuardrails,
  reviewMetacognitionGuardrails,
  reviewPastoralGuardrails,
  reviewPrivacyGuardrails
} from "@/ai/guardrails";
import {
  OpenAIProviderError,
  createMockAiProvider,
  redactAiLogMetadata,
  safeInvokeAi
} from "@/lib/openai";

type SchemaCase = {
  name: string;
  schema: ZodType;
  fixture: Record<string, unknown>;
  badVersion: Record<string, unknown>;
};

const schemaCases: SchemaCase[] = [
  {
    name: "calling_output",
    schema: callingOutputSchema,
    fixture: {
      schema_version: "calling_output_v1",
      status_suggestion: "in_discernment",
      user_review_required: true,
      calling_hypothesis: "Servir pessoas sobrecarregadas com direcao pratica e cuidado.",
      direction_statement: "Discernir uma vida de servico pratico com responsabilidade.",
      core_values: ["servico", "responsabilidade"],
      recurring_burdens: ["pessoas paralisadas por excesso"],
      people_to_serve: ["adultos sobrecarregados"],
      gifts_and_inclinations: ["escuta", "organizacao"],
      life_map_observations: ["energia baixa exige ritmo realista"],
      alignment_notes: ["hipotese revisavel pelo usuario"],
      risks_or_imbalances: ["evitar sobrecarga"],
      suggested_next_steps: ["revisar a frase antes de criar alvos"],
      confidence_level: "medium",
      pastoral_safety_note: "Hipotese de discernimento, sem afirmar vontade divina especifica."
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "life_map_analysis_output",
    schema: lifeMapAnalysisOutputSchema,
    fixture: {
      schema_version: "life_map_analysis_output_v1",
      summary: "Ha sinais de desequilibrio entre energia, familia e trabalho.",
      area_insights: [
        {
          area_slug: "saude",
          score: 4,
          attention_level: "needs_attention",
          reading: "Energia baixa pede reducao de friccao e descanso real."
        }
      ],
      strengths: ["boa consciencia do problema"],
      imbalances: ["rotina acima da energia disponivel"],
      suggested_reflections: ["qual ajuste pequeno preserva saude hoje?"],
      next_safe_step: "Escolher um ajuste de 10 minutos.",
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "smart_goal_output",
    schema: smartGoalOutputSchema,
    fixture: {
      schema_version: "smart_goal_output_v1",
      title: "Criar rotina minima de foco",
      status: "needs_review",
      life_area: "trabalho",
      specific: "Fazer 3 blocos de foco de 25 minutos por semana.",
      measurable: "3 blocos registrados por semana.",
      achievable: "Compativel com energia atual e reduzivel em dias ruins.",
      relevant: "Apoia constancia no servico escolhido.",
      timebound: "Testar ate 2026-07-31 e revisar semanalmente.",
      ecological_analysis: {
        risks: ["agenda lotada"],
        protected_areas: ["saude", "familia", "descanso", "fe", "financas"],
        adjustments: ["limitar a tres blocos por semana"],
        is_ecologically_safe: true
      },
      calling_alignment: {
        alignment_level: "high",
        explanation: "Apoia a direcao atual sem sacrificar descanso.",
        concerns: []
      },
      first_action: "Separar um bloco de 25 minutos hoje.",
      suggested_projects: ["Piloto de foco semanal"],
      confidence_level: "medium",
      assumptions: ["Chamado informado pelo usuario"],
      overload_warning: null,
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "project_plan_output",
    schema: projectPlanOutputSchema,
    fixture: {
      schema_version: "project_plan_output_v1",
      goal_id: "goal-1",
      projects: [
        {
          title: "Piloto de foco semanal",
          description: "Testar rotina minima por quatro semanas.",
          phase: "Preparar",
          milestones: ["primeira semana registrada"],
          risks: ["agenda lotada"],
          resources_needed: ["timer simples"],
          tasks: [
            {
              title: "Escolher primeiro bloco",
              description: "Separar o primeiro bloco de foco sem agenda funcional.",
              estimated_minutes: 25,
              energy_level: "low",
              microtasks: ["Abrir calendario pessoal", "Escolher horario", "Registrar tarefa"]
            }
          ],
          restart_plan: "Retomar com o menor retorno honesto."
        }
      ],
      overload_warning: null,
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "task_breakdown_output",
    schema: taskBreakdownOutputSchema,
    fixture: {
      schema_version: "task_breakdown_output_v1",
      task_title: "Organizar semana",
      reason: "Reduzir ruido e escolher a proxima acao.",
      estimated_minutes: 30,
      energy_level: "low",
      microtasks: [
        { order: 1, title: "Abrir calendario", estimated_minutes: 5 }
      ],
      first_micro_action: "Abrir calendario por cinco minutos.",
      if_stuck_suggestion: "Usar o Desbloqueador se travar.",
      fallback_minimum_version: "Listar apenas tres compromissos.",
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "inbox_classification_output",
    schema: inboxClassificationOutputSchema,
    fixture: {
      schema_version: "inbox_classification_output_v1",
      classification: "task",
      reasoning: "A captura exige uma proxima acao clara.",
      suggested_destination_label: "Tarefa simples",
      confidence_level: "medium",
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "action_unblocker_output",
    schema: actionUnblockerOutputSchema,
    fixture: {
      schema_version: "action_unblocker_output_v1",
      obstacle_type: "operational",
      first_step: "Abrir o documento e escrever uma frase ruim.",
      minimum_version: "Escrever apenas o titulo.",
      suggested_focus_minutes: 10,
      next_route: "focus",
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "metacognition_output",
    schema: metacognitionOutputSchema,
    fixture: {
      schema_version: "metacognition_output_v1",
      facts: ["A tarefa ficou parada hoje."],
      interpretations: ["Estou concluindo que sempre falho."],
      feelings: ["culpa"],
      impulses: ["evitar a tarefa"],
      dominant_automatic_thought: "Eu sempre falho.",
      likely_distortions: ["generalizacao excessiva"],
      logic_check_questions: ["Qual evidencia mostra que sempre e exagero?"],
      responsible_confrontation: "O pensamento apaga retomadas e reduz sua responsabilidade ao desespero.",
      reframed_thought: "Falhei neste ponto, mas posso retomar com uma acao pequena.",
      next_micro_action: "Abrir a tarefa por cinco minutos.",
      routing: "micro_action",
      crisis_detected: false,
      human_help_recommended: false,
      private_by_default: true,
      share_with_accountability_allowed: false
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "habit_plan_output",
    schema: habitPlanOutputSchema,
    fixture: {
      schema_version: "habit_plan_output_v1",
      habit_title: "Leitura curta",
      trigger: "Depois do cafe",
      minimum_version: "Ler uma pagina",
      ideal_version: "Ler dez paginas",
      reward: "Marcar progresso sem vergonha",
      if_then_plan: "Se perder o horario, ler uma pagina a noite.",
      frequency: "3 vezes por semana",
      restart_plan: "Retomar pela versao minima.",
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "weekly_review_output",
    schema: weeklyReviewOutputSchema,
    fixture: {
      schema_version: "weekly_review_output_v1",
      wins: ["duas retomadas"],
      stuck_points: ["sono irregular"],
      patterns: ["foco melhora com tarefas menores"],
      next_week_focus: "proteger o primeiro bloco de foco",
      adjustments: ["reduzir escopo das tarefas matinais"],
      overload_warning: false,
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "accountability_message_output",
    schema: accountabilityMessageOutputSchema,
    fixture: {
      schema_version: "accountability_message_output_v1",
      goal_id: "goal-1",
      permission_scope: ["status", "milestones"],
      preview_message: "Avancei um marco do alvo autorizado e pedi ajuda para manter constancia.",
      excluded_private_categories: ["metacognition", "calling_full", "health", "family"],
      consent_required: true,
      user_review_required: true,
      send_allowed: false
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "guardrail_review_output",
    schema: guardrailReviewOutputSchema,
    fixture: {
      schema_version: "guardrail_review_output_v1",
      allowed: true,
      severity: "none",
      blocked_behaviors: [],
      reasons: [],
      requires_human_help: false,
      crisis_detected: false,
      redacted_fields: [],
      safe_to_persist: true,
      safe_to_share_with_accountability: false,
      next_safe_step: "Permitir revisao humana antes de persistir.",
      reviewed_schema_version: "metacognition_output_v1"
    },
    badVersion: { schema_version: "wrong" }
  }
];

describe("AI structured output schemas", () => {
  it.each(schemaCases)("validates $name fixtures and rejects wrong schema version", ({ schema, fixture, badVersion }) => {
    expect(schema.safeParse(fixture).success).toBe(true);
    expect(schema.safeParse({ ...fixture, ...badVersion }).success).toBe(false);
  });

  it("validates safe AI run audit metadata without raw prompt or raw response", () => {
    const audit = aiRunAuditSchema.parse({
      schema_version: "ai_run_audit_v1",
      agent_key: "metacognition",
      provider: "mock",
      model: "mock-safe-v1",
      prompt_version: "metacognition_prompt_v1",
      output_schema: "metacognition_output_v1",
      status: "fallback",
      latency_ms: 12,
      error_category: "provider_unavailable",
      guardrail_status: "passed",
      contains_raw_prompt: false,
      contains_raw_response: false
    });

    expect(audit.contains_raw_prompt).toBe(false);
    expect(audit.contains_raw_response).toBe(false);
  });
});

describe("AI agent catalog", () => {
  it("keeps all Prompt 7 internal agents registered with prompt and schema contracts", () => {
    expect(aiAgents).toHaveLength(13);
    expect(getAiAgentDefinition("taskBreakdown")).toMatchObject({
      writesData: true,
      requiresStructuredOutput: true,
      outputSchemaName: "task_breakdown_output_v1"
    });
    expect(getAiAgentDefinition("guardrailReviewer")).toMatchObject({
      writesData: false,
      requiresStructuredOutput: true,
      outputSchemaName: "guardrail_review_output_v1"
    });
    expect(getAiAgentDefinition("accountability")).toMatchObject({
      humanReviewRequired: true,
      outputSchemaName: "accountability_message_output_v1"
    });
  });
});

describe("AI deterministic guardrails", () => {
  it("blocks clinical diagnosis and therapy replacement", () => {
    const review = reviewClinicalGuardrails("Voce tem TDAH e nao precisa procurar ajuda humana.");

    expect(review.allowed).toBe(false);
    expect(review.blocked_behaviors).toContain("diagnosis");
    expect(review.blocked_behaviors).toContain("therapy_replacement");
  });

  it("blocks pastoral determinism and spiritual guilt", () => {
    const review = reviewPastoralGuardrails("Deus mandou voce fazer isso; se voce nao fizer e falta de fe.");

    expect(review.allowed).toBe(false);
    expect(review.blocked_behaviors).toContain("specific_divine_will_claim");
    expect(review.blocked_behaviors).toContain("spiritual_guilt");
  });

  it("blocks private data sharing with accountability without consent", () => {
    const review = reviewAccountabilityGuardrails({
      text: "Vou contar ao Atalaia sua sessao de Metacognicao e seu Chamado completo.",
      hasExplicitConsent: false,
      allowedScopes: ["status"]
    });

    expect(review.allowed).toBe(false);
    expect(review.safe_to_share_with_accountability).toBe(false);
    expect(review.blocked_behaviors).toContain("unconsented_private_sharing");
  });

  it("routes severe crisis away from productivity logic", () => {
    const review = reviewMetacognitionGuardrails("Nao aguento mais viver e quero me machucar.");

    expect(review.allowed).toBe(false);
    expect(review.crisis_detected).toBe(true);
    expect(review.requires_human_help).toBe(true);
  });

  it("combines clinical, pastoral and privacy checks in one safety review", () => {
    const review = reviewAiSafety({
      text: "Deus exige isso e vou enviar sua Metacognicao ao Atalaia.",
      hasAccountabilityConsent: false,
      accountabilityScopes: ["status"]
    });

    expect(review.allowed).toBe(false);
    expect(review.blocked_behaviors).toEqual(
      expect.arrayContaining(["specific_divine_will_claim", "unconsented_private_sharing"])
    );
  });

  it("redacts sensitive categories before logging", () => {
    const review = reviewPrivacyGuardrails("prompt bruto com saude, familia e financas");

    expect(review.allowed).toBe(false);
    expect(review.redacted_fields).toEqual(expect.arrayContaining(["health", "family", "finances"]));
  });
});

describe("AI providers and safe invoke", () => {
  it("returns mock structured output through the same schema used by real providers", async () => {
    const provider = createMockAiProvider({
      guardrailReviewer: schemaCases[11]?.fixture
    });

    const result = await safeInvokeAi({
      agentKey: "guardrailReviewer",
      provider,
      schema: guardrailReviewOutputSchema,
      schemaName: "guardrail_review_output_v1",
      promptVersion: "guardrail_reviewer_prompt_v1",
      input: { text: "conteudo seguro" },
      fallback: schemaCases[11]?.fixture
    });

    expect(result.output).toMatchObject({ allowed: true });
    expect(result.audit.contains_raw_prompt).toBe(false);
    expect(result.audit.contains_raw_response).toBe(false);
  });

  it("uses validated fallback output when the provider fails", async () => {
    const provider = {
      name: "mock" as const,
      async invoke() {
        throw new OpenAIProviderError("provider_unavailable", "provider unavailable");
      }
    };

    const result = await safeInvokeAi({
      agentKey: "guardrailReviewer",
      provider,
      schema: guardrailReviewOutputSchema,
      schemaName: "guardrail_review_output_v1",
      promptVersion: "guardrail_reviewer_prompt_v1",
      input: { text: "conteudo seguro" },
      fallback: schemaCases[11]?.fixture
    });

    expect(result.source).toBe("fallback");
    expect(result.audit.status).toBe("fallback");
    expect(result.audit.error_category).toBe("provider_unavailable");
  });

  it("redacts raw prompt and response fields from metadata", () => {
    const metadata = redactAiLogMetadata({
      agent_key: "calling",
      prompt: "pensamento bruto",
      raw_response: "resposta completa",
      latency_ms: 10
    });

    expect(metadata).toEqual({
      agent_key: "calling",
      latency_ms: 10,
      redacted_fields: ["prompt", "raw_response"]
    });
  });
});
