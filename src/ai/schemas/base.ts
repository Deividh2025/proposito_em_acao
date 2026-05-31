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
    provider: z.enum(["mock", "openai"]),
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
        "schema_validation",
        "guardrail_blocked",
        "unexpected"
      ])
      .default("none"),
    guardrail_status: z.enum(["passed", "blocked", "not_run"]),
    blocked_behaviors: z.array(blockedBehaviorSchema).default([]),
    contains_raw_prompt: z.literal(false),
    contains_raw_response: z.literal(false)
  })
  .strict();

export type AiRunAudit = z.infer<typeof aiRunAuditSchema>;
