import "server-only";

export const DEFAULT_AUTH_REDIRECT = "/dashboard";

export const publicRoutes = [
  "/",
  "/auth",
  "/offline",
  "/api/health",
  "/api/ready",
  "/accountability/partner"
] as const;

export const protectedRoutes = [
  "/dashboard",
  "/onboarding",
  "/settings",
  "/goals",
  "/projects",
  "/tasks",
  "/calendar",
  "/inbox",
  "/focus",
  "/habits",
  "/scoreboard",
  "/review",
  "/garden",
  "/metacognition",
  "/action-unblocker",
  "/accountability",
  "/commitments",
  "/mobile"
] as const;

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function isPublicRoute(pathname: string) {
  const normalized = normalizePathname(pathname);

  return publicRoutes.some((route) => matchesRoute(normalized, route));
}

export function isProtectedRoute(pathname: string) {
  const normalized = normalizePathname(pathname);

  return protectedRoutes.some((route) => matchesRoute(normalized, route));
}

export function safeNextPath(
  value: unknown,
  fallback = DEFAULT_AUTH_REDIRECT
) {
  if (typeof value !== "string") {
    return fallback;
  }

  const next = value.trim();

  if (
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("\\") ||
    /^[a-z][a-z0-9+.-]*:/i.test(next)
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(next, "https://proposito.invalid");

    if (parsed.origin !== "https://proposito.invalid") {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function sanitizeAuthNext(value: unknown, fallback = DEFAULT_AUTH_REDIRECT) {
  return safeNextPath(value, fallback);
}

export function appendSafeNext(path: string, next: unknown) {
  const safeNext = safeNextPath(next);

  if (safeNext === DEFAULT_AUTH_REDIRECT) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";

  return `${path}${separator}next=${encodeURIComponent(safeNext)}`;
}
