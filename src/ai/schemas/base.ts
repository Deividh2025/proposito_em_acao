import { z } from "zod";

export const aiSafetyReviewSchema = z.object({
  allowed: z.boolean(),
  blockedReasons: z.array(z.string()).default([]),
  requiresHumanHelp: z.boolean().default(false),
  sensitiveCategories: z.array(z.string()).default([]),
  nextSafeStep: z.string().min(1)
});

export type AiSafetyReview = z.infer<typeof aiSafetyReviewSchema>;
