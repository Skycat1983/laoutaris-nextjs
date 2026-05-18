import type { MetadataRoute } from "next";
import { getPublicSitePathUrl } from "@/lib/config/publicSiteUrl";

type SitemapEntry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

export const stablePublicSitemapRoutes = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/artwork", changeFrequency: "weekly", priority: 0.9 },
  { path: "/collections", changeFrequency: "weekly", priority: 0.85 },
  { path: "/biography", changeFrequency: "monthly", priority: 0.75 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.75 },
  { path: "/project/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/project/aims", changeFrequency: "monthly", priority: 0.65 },
  { path: "/project/film", changeFrequency: "monthly", priority: 0.65 },
  { path: "/project/contact", changeFrequency: "monthly", priority: 0.65 },
  { path: "/shop/products", changeFrequency: "weekly", priority: 0.7 },
  { path: "/search", changeFrequency: "monthly", priority: 0.55 },
] satisfies SitemapEntry[];

export default function sitemap(): MetadataRoute.Sitemap {
  return stablePublicSitemapRoutes.map(
    ({ path, changeFrequency, priority }) => ({
      url: getPublicSitePathUrl(path),
      changeFrequency,
      priority,
    })
  );
}
