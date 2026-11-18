import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Static assets are deployed from public, not copied into server functions.
  outputFileTracingExcludes: {
    "/*": ["./content/til/drafts/**/*", "./content/til/media/**/*", "./public/**/*"],
  },
  outputFileTracingIncludes: {
    "/til/future-dream": ["./content/til/config.json", "./content/til/published/*.md", "./content/til/visualizations/*.json"],
  },
  async rewrites() {
    return [
      {
        source: "/compliance/",
        destination: "/compliance/index.html",
      },
      {
        source: "/TIL",
        destination: "/til/future-dream",
      },
    ];
  },
};

export default nextConfig;
