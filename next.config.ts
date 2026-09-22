import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // File tracing can otherwise include drafts while following dynamic fs paths.
  outputFileTracingExcludes: {
    "/*": ["./content/til/drafts/**/*"],
  },
  async rewrites() {
    return [
      {
        source: "/TIL",
        destination: "/til/future-dream",
      },
    ];
  },
};

export default nextConfig;
