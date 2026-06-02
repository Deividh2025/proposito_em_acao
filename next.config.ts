import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
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
