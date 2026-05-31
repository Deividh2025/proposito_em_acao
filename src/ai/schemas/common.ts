import { z } from "zod";

export const confidenceLevelSchema = z.enum(["low", "medium", "high"]);
export const attentionLevelSchema = z.enum(["stable", "watch", "needs_attention"]);
export const reviewRequiredSchema = z.literal(true);
export const energyLevelSchema = z.enum(["low", "medium", "high"]);

export const shortTextSchema = z.string().trim().min(1);
export const meaningfulTextSchema = z.string().trim().min(10);

export const stringListSchema = z.array(shortTextSchema).min(1).max(8);
