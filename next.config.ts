import type { NextConfig } from "next";

// Old Lovable routes go here once known. Example:
// { source: "/old-path", destination: "/new-path", permanent: true },
const LEGACY_REDIRECTS: { source: string; destination: string; permanent: boolean }[] = [];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  // Always put metadata in <head>, including on dynamic pages like /apply.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  async redirects() {
    return LEGACY_REDIRECTS;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
