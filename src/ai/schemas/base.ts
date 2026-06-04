import { z } from "zod";

import { blockedBehaviorSchema } from "./guardrail-review";

export const aiSafetyReviewSchema = z.object({
  allowed: z.boolean(),
  blockedReasons: z.array(z.string()).default([]),
  requiresHumanHelp: z.boolean().default(false),
  sensitiveCategories: z.array(z.string()).default([]),
  nextSafeStep: z.string().min(1)
});

export type AiSafetyReview = z.infer<typeof aiSafetyReviewSchema>;

export const aiRunAuditSchema = z
  .object({
    schema_version: z.literal("ai_run_audit_v1"),
    agent_key: z.string().min(1),
    provider: z.enum(["mock", "openai", "deepseek"]),
    invocation_mode: z.enum(["mock", "real", "fallback"]).default("mock"),
    model: z.string().min(1),
    prompt_version: z.string().min(1),
    output_schema: z.string().min(1),
    status: z.enum(["success", "fallback", "blocked", "error"]),
    latency_ms: z.number().nonnegative(),
    error_category: z
      .enum([
        "none",
        "missing_api_key",
        "provider_unavailable",
        "provider_timeout",
        "ai_real_disabled",
        "schema_validation",
        "guardrail_blocked",
        "missing_provider_consent",
        "daily_user_limit_reached",
        "provider_model_missing",
        "unexpected"
      ])
      .default("none"),
    guardrail_status: z.enum(["passed", "blocked", "failed"]),
    blocked_behaviors: z.array(blockedBehaviorSchema).default([]),
    contains_raw_prompt: z.literal(false),
    contains_raw_response: z.literal(false),
    fallback_reason: z.string().min(1).nullable().default(null),
    consent_version: z.string().min(1).nullable().default(null),
    timestamp: z.string().datetime().default("1970-01-01T00:00:00.000Z")
  })
  .strict();

export type AiRunAudit = z.infer<typeof aiRunAuditSchema>;
