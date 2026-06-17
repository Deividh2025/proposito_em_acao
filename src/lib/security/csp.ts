/**
 * Content-Security-Policy helpers.
 *
 * The dynamic, per-request CSP (with a fresh nonce) is emitted by the Auth
 * proxy in `src/lib/supabase/proxy.ts` for every document/route it matches.
 * The static CSP below is only used by `next.config.ts` for asset responses
 * that bypass the proxy (e.g. `/sw.js`, `/manifest.json`) and never execute
 * inline scripts.
 */

const isProduction = process.env.NODE_ENV === "production";

function baseCspDirectives(): string[] {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co",
    "style-src 'self' 'unsafe-inline'",
    "worker-src 'self'",
    "manifest-src 'self'"
  ];
}

/**
 * Per-request CSP. In production `script-src` relies on the request nonce plus
 * `strict-dynamic` (no `'unsafe-inline'`). In development it keeps
 * `'unsafe-inline'`/`'unsafe-eval'` so Next.js HMR and React Refresh work.
 */
export function buildContentSecurityPolicy(nonce: string): string {
  const scriptSrc = isProduction
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  return [...baseCspDirectives(), scriptSrc].join("; ");
}

/**
 * Static CSP for asset routes served outside the proxy. These responses never
 * run inline scripts, so `script-src 'self'` is enough in production.
 */
export function buildStaticContentSecurityPolicy(): string {
  const scriptSrc = isProduction
    ? "script-src 'self'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  return [...baseCspDirectives(), scriptSrc].join("; ");
}

/** Cryptographically strong base64 nonce for a single request. */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
