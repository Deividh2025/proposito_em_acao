import "server-only";

import type { Json } from "@/types/database";

export type GenericSupabaseRow = Record<string, unknown>;

export function recordFromUnknown(value: unknown): GenericSupabaseRow {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as GenericSupabaseRow;
}

export function stringFromRow(row: GenericSupabaseRow, key: string, fallback = "") {
  const value = row[key];

  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

export function nullableStringFromRow(row: GenericSupabaseRow, key: string) {
  const value = row[key];

  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

export function numberFromRow(row: GenericSupabaseRow, key: string, fallback = 0) {
  const value = row[key];

  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function booleanFromRow(row: GenericSupabaseRow, key: string, fallback = false) {
  const value = row[key];

  return typeof value === "boolean" ? value : fallback;
}

export function stringArrayFromRow(row: GenericSupabaseRow, key: string) {
  const value = row[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function jsonArrayFromRow(row: GenericSupabaseRow, key: string): Json[] {
  const value = row[key];

  return Array.isArray(value) ? (value as Json[]) : [];
}

export function firstRowFromUnknown(value: unknown) {
  if (!Array.isArray(value)) {
    return {};
  }

  return recordFromUnknown(value[0]);
}
