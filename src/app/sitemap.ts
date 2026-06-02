import type { MetadataRoute } from "next";

import { baseUrl } from "@/lib/seo";

export const dynamic = "force-static";

const routes = [
  "/",
  "/public-digital",
  "/pm",
  "/policy",
  "/assembly",
  "/resume",
  "/projects/busan-eumgil",
  "/projects/aekkim",
  "/projects/play-pick",
  "/projects/smile-game",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route, baseUrl).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
