import type { NextConfig } from "next";

import { buildStaticContentSecurityPolicy } from "./src/lib/security/csp";

// The per-request Content-Security-Policy (with a nonce and without
// 'unsafe-inline' in production) is emitted by the Auth proxy in
// src/lib/supabase/proxy.ts for every routed document. The static CSP below
// only covers asset responses that bypass the proxy (e.g. /sw.js,
// /manifest.json), which never execute inline scripts.
const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), xr-spatial-tracking=()"
  }
];

const staticCspHeader = {
  key: "Content-Security-Policy",
  value: buildStaticContentSecurityPolicy()
};

const productionOnlySecurityHeaders =
  process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
    : [];

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...baseSecurityHeaders, ...productionOnlySecurityHeaders]
      },
      {
        source: "/sw.js",
        headers: [
          staticCspHeader,
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }
        ]
      },
      {
        source: "/manifest.json",
        headers: [staticCspHeader, { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }]
      }
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
