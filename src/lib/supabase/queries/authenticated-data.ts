import "server-only";

import type { User } from "@supabase/supabase-js";

import { getAppRuntimeMode, type AppRuntimeMode } from "@/lib/config";
import { hasEssentialSupabaseConfig } from "@/lib/supabase/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

export type AuthenticatedDataDecision =
  | {
      canUseSampleData: true;
      kind: "local-demo";
      reason: "local-demo";
    }
  | {
      canUseSampleData: false;
      kind: "authenticated";
      reason: "authenticated";
    }
  | {
      canUseSampleData: false;
      kind: "blocked";
      reason: "auth-required" | "config-missing";
    };

export type AuthenticatedDataModeInput = {
  hasSupabaseConfig: boolean;
  hasUser: boolean;
  runtimeMode: AppRuntimeMode;
};

type BlockedReason = "auth-required" | "config-missing" | "service-error";

export type SafeQueryError = {
  code: "query-error";
  message: string;
};

export type AuthenticatedDataContext =
  | {
      canUseSampleData: true;
      kind: "local-demo";
      message: string;
      runtimeMode: AppRuntimeMode;
      supabase: null;
      user: null;
    }
  | {
      canUseSampleData: false;
      kind: "authenticated";
      runtimeMode: AppRuntimeMode;
      supabase: TypedSupabaseClient;
      user: User;
    }
  | {
      canUseSampleData: false;
      kind: "blocked";
      reason: "auth-required" | "config-missing" | "service-error";
      runtimeMode: AppRuntimeMode;
      userMessage: string;
    };

export const LOCAL_DEMO_DATA_MESSAGE =
  "Dados demonstrativos visiveis apenas no modo local-demo.";

export const AUTH_REQUIRED_DATA_MESSAGE = "Entre na sua conta para ver seus dados reais.";
export const CONFIG_REQUIRED_DATA_MESSAGE =
  "Este ambiente ainda nao esta configurado para carregar dados autenticados.";
export const QUERY_ERROR_MESSAGE = "Nao foi possivel carregar seus dados agora.";

export function resolveAuthenticatedDataMode({
  hasSupabaseConfig,
  hasUser,
  runtimeMode
}: AuthenticatedDataModeInput): AuthenticatedDataDecision {
  if (hasSupabaseConfig && hasUser) {
    return {
      canUseSampleData: false,
      kind: "authenticated",
      reason: "authenticated"
    };
  }

  if (runtimeMode === "local-demo") {
    return {
      canUseSampleData: true,
      kind: "local-demo",
      reason: "local-demo"
    };
  }

  if (!hasSupabaseConfig) {
    return {
      canUseSampleData: false,
      kind: "blocked",
      reason: "config-missing"
    };
  }

  return {
    canUseSampleData: false,
    kind: "blocked",
    reason: "auth-required"
  };
}

export function toSafeQueryError(_error: unknown, message = QUERY_ERROR_MESSAGE): SafeQueryError {
  return {
    code: "query-error",
    message
  };
}

function blockedContext(
  runtimeMode: AppRuntimeMode,
  reason: BlockedReason
): AuthenticatedDataContext {
  const userMessage =
    reason === "auth-required"
      ? AUTH_REQUIRED_DATA_MESSAGE
      : reason === "config-missing"
        ? CONFIG_REQUIRED_DATA_MESSAGE
        : QUERY_ERROR_MESSAGE;

  return {
    canUseSampleData: false,
    kind: "blocked",
    reason,
    runtimeMode,
    userMessage
  };
}

export async function getAuthenticatedDataContext(): Promise<AuthenticatedDataContext> {
  const runtimeMode = getAppRuntimeMode();
  const hasSupabaseConfig = hasEssentialSupabaseConfig();

  if (!hasSupabaseConfig) {
    const decision = resolveAuthenticatedDataMode({
      hasSupabaseConfig,
      hasUser: false,
      runtimeMode
    });

    if (decision.kind === "local-demo") {
      return {
        canUseSampleData: true,
        kind: "local-demo",
        message: LOCAL_DEMO_DATA_MESSAGE,
        runtimeMode,
        supabase: null,
        user: null
      };
    }

    return blockedContext(runtimeMode, decision.kind === "blocked" ? decision.reason : "service-error");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
    const decision = resolveAuthenticatedDataMode({
      hasSupabaseConfig,
      hasUser: Boolean(user && !error),
      runtimeMode
    });

    if (decision.kind === "authenticated" && user) {
      return {
        canUseSampleData: false,
        kind: "authenticated",
        runtimeMode,
        supabase,
        user
      };
    }

    if (decision.kind === "local-demo") {
      return {
        canUseSampleData: true,
        kind: "local-demo",
        message: LOCAL_DEMO_DATA_MESSAGE,
        runtimeMode,
        supabase: null,
        user: null
      };
    }

    return blockedContext(runtimeMode, decision.kind === "blocked" ? decision.reason : "service-error");
  } catch {
    if (runtimeMode === "local-demo") {
      return {
        canUseSampleData: true,
        kind: "local-demo",
        message: LOCAL_DEMO_DATA_MESSAGE,
        runtimeMode,
        supabase: null,
        user: null
      };
    }

    return blockedContext(runtimeMode, "service-error");
  }
}
