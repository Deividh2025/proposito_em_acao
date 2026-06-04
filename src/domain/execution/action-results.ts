import { z } from "zod";

import { getAppRuntimeMode, getPublicEnv } from "@/lib/config";

import { executionActionResultSchema, type ExecutionActionResult } from "./persistence";

type ActionResultSchema<T extends ExecutionActionResult> = {
  parse(value: unknown): T;
};

type ActionResultExtras = Record<string, unknown>;

function normalizeResultId(id: unknown): string | undefined {
  if (typeof id === "string") {
    return id;
  }

  if (id === null || id === undefined) {
    return undefined;
  }

  return String(id);
}

export const ACTION_VALIDATION_ERROR_MESSAGE = "Revise os dados informados e tente novamente.";
export const ACTION_CONFIG_ERROR_MESSAGE =
  "Este ambiente ainda nao esta configurado para persistencia real.";
export const ACTION_AUTH_ERROR_MESSAGE = "Entre na sua conta para concluir esta acao.";
export const ACTION_NOT_FOUND_ERROR_MESSAGE = "Registro nao encontrado para este usuario.";
export const ACTION_SERVICE_ERROR_MESSAGE = "Nao foi possivel concluir a acao agora. Tente novamente.";

export function isLocalDemoRuntime() {
  try {
    return getAppRuntimeMode() === "local-demo";
  } catch {
    return false;
  }
}

export function hasSupabasePublicConfig() {
  try {
    const env = getPublicEnv();

    return Boolean(
      env.NEXT_PUBLIC_SUPABASE_URL &&
        (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    );
  } catch {
    return false;
  }
}

export function localDraftResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  message: string,
  id?: unknown,
  extras: ActionResultExtras = {}
): T {
  return schema.parse({
    ...extras,
    id: normalizeResultId(id),
    message,
    mode: "local-draft",
    ok: true
  });
}

export function supabaseSuccessResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  message: string,
  id?: unknown,
  extras: ActionResultExtras = {}
): T {
  return schema.parse({
    ...extras,
    id: normalizeResultId(id),
    message,
    mode: "supabase",
    ok: true
  });
}

export function validationErrorResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  message = ACTION_VALIDATION_ERROR_MESSAGE,
  extras: ActionResultExtras = {}
): T {
  return schema.parse({
    ...extras,
    message,
    mode: "local-draft",
    ok: false
  });
}

export function configErrorResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  message = ACTION_CONFIG_ERROR_MESSAGE,
  extras: ActionResultExtras = {}
): T {
  return schema.parse({
    ...extras,
    message,
    mode: "local-draft",
    ok: false
  });
}

export function authErrorResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  message = ACTION_AUTH_ERROR_MESSAGE,
  extras: ActionResultExtras = {}
): T {
  return schema.parse({
    ...extras,
    message,
    mode: "local-draft",
    ok: false
  });
}

export function realServiceErrorResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  message = ACTION_SERVICE_ERROR_MESSAGE,
  extras: ActionResultExtras = {}
): T {
  return schema.parse({
    ...extras,
    message,
    mode: "supabase",
    ok: false
  });
}

export function missingSupabaseConfigResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  localDemoMessage: string,
  id?: unknown,
  extras: ActionResultExtras = {}
): T {
  if (isLocalDemoRuntime()) {
    return localDraftResult(schema, localDemoMessage, id, extras);
  }

  return configErrorResult(schema);
}

export function missingSessionResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  localDemoMessage: string,
  id?: unknown,
  extras: ActionResultExtras = {}
): T {
  if (isLocalDemoRuntime()) {
    return localDraftResult(schema, localDemoMessage, id, extras);
  }

  return authErrorResult(schema);
}

export function localOnlyDraftResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  localDemoMessage: string,
  id?: unknown,
  extras: ActionResultExtras = {},
  failClosedMessage = ACTION_CONFIG_ERROR_MESSAGE
): T {
  if (isLocalDemoRuntime()) {
    return localDraftResult(schema, localDemoMessage, id, extras);
  }

  return validationErrorResult(schema, failClosedMessage, extras);
}

export function persistenceCatchResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  localDemoMessage: string,
  id?: unknown,
  extras: ActionResultExtras = {},
  serviceMessage = ACTION_SERVICE_ERROR_MESSAGE
): T {
  if (!hasSupabasePublicConfig() && isLocalDemoRuntime()) {
    return localDraftResult(schema, localDemoMessage, id, extras);
  }

  if (!hasSupabasePublicConfig()) {
    return configErrorResult(schema);
  }

  return realServiceErrorResult(schema, serviceMessage);
}

export function safeParseActionInput<T, R extends ExecutionActionResult>(
  inputSchema: z.ZodType<T>,
  input: unknown,
  resultSchema: ActionResultSchema<R>,
  message = ACTION_VALIDATION_ERROR_MESSAGE
): { ok: true; data: T } | { ok: false; result: R } {
  const parsed = inputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      result: validationErrorResult(resultSchema, message)
    };
  }

  return {
    data: parsed.data,
    ok: true
  };
}

export function noAffectedRowResult<T extends ExecutionActionResult>(
  schema: ActionResultSchema<T>,
  message = ACTION_NOT_FOUND_ERROR_MESSAGE
): T {
  return realServiceErrorResult(schema, message);
}

export const baseActionResult = {
  authErrorResult,
  configErrorResult,
  localDraftResult,
  localOnlyDraftResult,
  missingSessionResult,
  missingSupabaseConfigResult,
  noAffectedRowResult,
  persistenceCatchResult,
  realServiceErrorResult,
  safeParseActionInput,
  supabaseSuccessResult,
  validationErrorResult
};

export type { ExecutionActionResult };
export { executionActionResultSchema };
