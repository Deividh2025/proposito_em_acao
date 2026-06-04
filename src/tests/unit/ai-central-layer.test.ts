import { describe, expect, it } from "vitest";
import type { ZodType } from "zod";

import { aiAgents, getAiAgentDefinition } from "@/ai/agents";
import {
  accountabilityMessageOutputSchema,
  actionUnblockerOutputSchema,
  aiRunAuditSchema,
  callingOutputSchema,
  commitmentDocumentOutputSchema,
  guardrailReviewOutputSchema,
  gardenStateOutputSchema,
  habitPlanOutputSchema,
  inboxClassificationOutputSchema,
  lifeMapAnalysisOutputSchema,
  metacognitionOutputSchema,
  projectPlanOutputSchema,
  scheduleOverloadOutputSchema,
  scoreboardPlanOutputSchema,
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
      confidence: "medium",
      suggested_title: "Tarefa simples",
      summary: "A captura exige uma proxima acao clara.",
      recommended_action: "create_task",
      life_area: null,
      estimated_minutes: 15,
      energy_level: "medium",
      due_date_suggestion: null,
      clarifying_question: null,
      safety_note: "Revisar antes de criar tarefa.",
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "action_unblocker_output",
    schema: actionUnblockerOutputSchema,
    fixture: {
      schema_version: "action_unblocker_output_v1",
      state_summary: "A tarefa esta grande e a energia esta baixa.",
      first_step: "Abrir o documento e escrever uma frase ruim por dois minutos.",
      minimum_viable_action: "Escrever apenas o titulo provisório.",
      microtasks: [
        { title: "Abrir o documento certo", estimated_minutes: 2, order: 1 },
        { title: "Escrever uma frase imperfeita", estimated_minutes: 3, order: 2 }
      ],
      recommended_focus_minutes: 5,
      immediate_reward: "Marcar a retomada e beber agua.",
      reorientation_phrase: "Nao preciso resolver tudo; preciso iniciar honestamente.",
      restart_plan: "Se travar de novo, reduzir para dois minutos e registrar o obstaculo.",
      suggest_metacognition: true,
      reason_to_suggest_metacognition: "O obstaculo menciona medo de errar.",
      safety_note: null,
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "schedule_overload_output",
    schema: scheduleOverloadOutputSchema,
    fixture: {
      schema_version: "schedule_overload_output_v1",
      overload_level: "medium",
      message: "Esta agenda parece pesada para sua energia atual.",
      reasons: ["Há muitos blocos de execução sem buffer suficiente."],
      recommended_adjustments: ["Proteger um bloco de descanso antes de adicionar outra entrega."],
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "metacognition_output",
    schema: metacognitionOutputSchema,
    fixture: {
      schema_version: "metacognition_output_v1",
      state_name: "Culpa e paralisia diante da tarefa",
      category: "guilt",
      intensity_observed: "medium",
      fact: "A tarefa ficou parada hoje.",
      interpretation: "Estou concluindo que sempre falho.",
      feeling: "culpa",
      impulse: "evitar a tarefa",
      dominant_automatic_thought: "Eu sempre falho.",
      cognitive_patterns: ["generalizacao excessiva"],
      logical_deconstruction: "O fato prova atraso hoje, nao incapacidade permanente.",
      confrontation_question: "Qual pequeno passo ainda esta sob sua responsabilidade agora?",
      reframe: "Falhei neste ponto, mas posso retomar com uma acao pequena.",
      next_action: "Abrir a tarefa por cinco minutos.",
      recommended_route: "action_unblocker",
      christian_anchor: null,
      safety_flags: [],
      privacy_note: "Sessao privada por padrao e nao compartilhada com Atalaia.",
      user_review_required: true,
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
      identity_statement: "Sou uma pessoa que retorna ao essencial em pequena escala.",
      why_it_matters: "Ler de forma curta protege direcao sem depender de energia alta.",
      life_area: "Espiritualidade",
      trigger: "Depois do cafe",
      minimum_version: "Ler uma pagina",
      ideal_version: "Ler dez paginas",
      schedule_suggestion: "Depois do cafe da manha",
      reward: "Marcar progresso sem vergonha",
      likely_obstacle: "pressa",
      if_then_plan: "Se perder o horario, ler uma pagina a noite.",
      environment_design: "Deixar o livro na mesa antes de dormir.",
      frequency: "weekly",
      metric: "paginas lidas sem pressao",
      scoreboard_items: ["Leitura minima", "Retomada de leitura"],
      restart_plan: "Retomar pela versao minima.",
      risk_of_overload: "low",
      adjustments: ["reduzir para um paragrafo em dias ruins"],
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "scoreboard_plan_output",
    schema: scoreboardPlanOutputSchema,
    fixture: {
      schema_version: "scoreboard_plan_output_v1",
      scoreboard_title: "Placar leve",
      period: "weekly",
      items: [
        {
          title: "Foco honesto",
          type: "focus",
          target_frequency: "3 vezes por semana",
          minimum_success: "5 minutos",
          linked_goal_id: null,
          linked_habit_id: null,
          linked_task_id: null
        }
      ],
      restart_tracking: true,
      visual_guidance: "Sem vergonha; retomada conta.",
      risk_notes: ["nao transformar falha em identidade"],
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "weekly_review_output",
    schema: weeklyReviewOutputSchema,
    fixture: {
      schema_version: "weekly_review_output_v1",
      week_summary: "A semana teve retomadas reais, alguns travamentos por sono irregular e um foco claro para reduzir escopo.",
      wins: ["duas retomadas"],
      stuck_points: ["sono irregular"],
      patterns: [
        {
          pattern: "Foco melhora com tarefas menores",
          evidence: ["duas retomadas", "sono irregular"],
          impact: "medium",
          suggested_adjustment: "Reduzir tarefas da manha para a versao minima."
        }
      ],
      overload_alerts: ["agenda apertada sem descanso suficiente"],
      neglected_life_areas: ["Descanso"],
      restart_moments: ["duas retomadas"],
      metacognition_insights: ["sem conteudo bruto; apenas padrao agregado"],
      scoreboard_insights: ["retomada apareceu como progresso"],
      next_week_focus: "proteger o primeiro bloco de foco",
      recommended_actions: ["reduzir escopo das tarefas matinais", "proteger descanso antes de adicionar entrega"],
      first_action_next_week: "bloquear 25 minutos para uma tarefa essencial",
      encouragement: "Retomada registrada e progresso real.",
      christian_reflection: null,
      safety_notes: ["privado por padrao"],
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "garden_state_output",
    schema: gardenStateOutputSchema,
    fixture: {
      schema_version: "garden_state_output_v1",
      garden_state: {
        life_areas: [
          {
            area: "Descanso",
            growth_level: 1,
            recent_events: ["Revisao semanal concluida"],
            care_needed: true,
            care_message: "Descanso pede cuidado simples, sem culpa.",
            visual_state: "needs_care"
          }
        ],
        unlocked_items: ["Retomada visivel"],
        weekly_growth_summary: "A semana mostrou progresso e cuidado necessario."
      }
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "accountability_message_output",
    schema: accountabilityMessageOutputSchema,
    fixture: {
      schema_version: "accountability_message_output_v1",
      message_type: "invite",
      subject: "Convite para acompanhar um alvo autorizado",
      body: "Voce foi convidado para acompanhar um alvo especifico e limitado no Proposito em Acao.",
      shared_fields: ["goal_name", "status", "completed_milestones"],
      privacy_check: {
        contains_private_metacognition: false,
        contains_full_calling: false,
        contains_sensitive_health_data: false,
        contains_family_finance_emotion_data: false,
        safe_to_send: true
      },
      tone: "supportive",
      call_to_action: "Aceitar convite limitado",
      consent_required: true,
      user_review_required: true
    },
    badVersion: { schema_version: "wrong" }
  },
  {
    name: "commitment_document_output",
    schema: commitmentDocumentOutputSchema,
    fixture: {
      schema_version: "commitment_document_output_v1",
      goal_id: "goal-1",
      title: "Compromisso - alvo autorizado",
      commitment_statement:
        "Comprometo-me a caminhar neste alvo com passos pequenos, apoio consentido e responsabilidade sem humilhacao.",
      calling_summary: null,
      deadline: "2026-07-31",
      linked_projects: ["Projeto piloto"],
      supporting_habits: ["Revisao curta"],
      scoreboard_items: ["Retomada"],
      accountability_partner: {
        name: "Atalaia",
        email: "atalia@example.com"
      },
      reward: "Descanso planejado",
      restorative_consequence: "Fazer revisao curta e reduzir escopo.",
      first_action: "Abrir o plano por 15 minutos.",
      sharing_permissions: ["goal_name", "deadline", "commitment_document"],
      user_review_required: true
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

const guardrailReviewFixture = schemaCases.find((item) => item.name === "guardrail_review_output")?.fixture;

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
    expect(aiAgents).toHaveLength(16);
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
    expect(getAiAgentDefinition("commitmentDocument")).toMatchObject({
      humanReviewRequired: true,
      outputSchemaName: "commitment_document_output_v1"
    });
    expect(getAiAgentDefinition("scheduleReviewer")).toMatchObject({
      humanReviewRequired: true,
      outputSchemaName: "schedule_overload_output_v1"
    });
    expect(getAiAgentDefinition("scoreboard")).toMatchObject({
      humanReviewRequired: true,
      outputSchemaName: "scoreboard_plan_output_v1"
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

  it("blocks diagnosis requests without blocking anti-diagnosis language", () => {
    const unsafeReview = reviewClinicalGuardrails("Me diagnostique com TDAH agora.");
    const safeReview = reviewClinicalGuardrails("Sem diagnostico, somente uma revisao segura.");

    expect(unsafeReview.allowed).toBe(false);
    expect(unsafeReview.blocked_behaviors).toContain("diagnosis");
    expect(safeReview.allowed).toBe(true);
  });

  it("blocks pastoral determinism and spiritual guilt", () => {
    const review = reviewPastoralGuardrails("Deus mandou voce fazer isso; se voce nao fizer e falta de fe.");

    expect(review.allowed).toBe(false);
    expect(review.blocked_behaviors).toContain("specific_divine_will_claim");
    expect(review.blocked_behaviors).toContain("spiritual_guilt");
  });

  it("blocks humiliating shame without blocking shame-prevention language", () => {
    const unsafeReview = reviewPastoralGuardrails("Que vergonha, voce e um fracassado.");
    const safeReview = reviewPastoralGuardrails("Dar o primeiro passo sem transformar isso em vergonha.");

    expect(unsafeReview.allowed).toBe(false);
    expect(unsafeReview.blocked_behaviors).toContain("humiliation");
    expect(safeReview.allowed).toBe(true);
  });

  it("blocks harmful punishment without blocking anti-punishment language", () => {
    const unsafeReview = reviewPastoralGuardrails("Use punicao e fique sem comer se falhar.");
    const safeReview = reviewPastoralGuardrails("Convite de cuidado, nao punicao.");

    expect(unsafeReview.allowed).toBe(false);
    expect(unsafeReview.blocked_behaviors).toContain("harmful_punishment");
    expect(safeReview.allowed).toBe(true);
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
      guardrailReviewer: guardrailReviewFixture
    });

    const result = await safeInvokeAi({
      agentKey: "guardrailReviewer",
      provider,
      schema: guardrailReviewOutputSchema,
      schemaName: "guardrail_review_output_v1",
      promptVersion: "guardrail_reviewer_prompt_v1",
      input: { text: "conteudo seguro" },
      fallback: guardrailReviewFixture
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
      fallback: guardrailReviewFixture
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
