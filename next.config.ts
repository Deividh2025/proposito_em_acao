import type { NextConfig } from "next";

const scriptSrc =
  process.env.NODE_ENV === "production"
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), xr-spatial-tracking=()"
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "worker-src 'self'",
      "manifest-src 'self'"
    ].join("; ")
  }
];

const productionOnlySecurityHeaders =
  process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
    : [];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders, ...productionOnlySecurityHeaders]
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" }
        ]
      },
      {
        source: "/manifest.json",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, must-revalidate" }]
      }
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
