import type { MetadataRoute } from "next";
import { PROVIDERS } from "@/lib/providers";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aiwatch.dev";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/timeline`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/analytics`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...Object.keys(PROVIDERS).map((slug) => ({
      url: `${base}/c/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
