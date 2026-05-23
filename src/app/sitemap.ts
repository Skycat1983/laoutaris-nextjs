import type { MetadataRoute } from "next";
import { getPublicSitePathUrl } from "@/lib/config/publicSiteUrl";
import {
  getDynamicPublicSitemapEntries,
  type PublicSitemapEntry,
} from "@/lib/metadata/publicDynamicSitemap";

export const SITEMAP_REVALIDATE_SECONDS = 3600;
export const revalidate = SITEMAP_REVALIDATE_SECONDS;

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
] satisfies PublicSitemapEntry[];

const dedupeSitemapEntries = (entries: PublicSitemapEntry[]) => {
  const seenPaths = new Set<string>();

  return entries.filter(({ path }) => {
    if (seenPaths.has(path)) {
      return false;
    }

    seenPaths.add(path);
    return true;
  });
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicSitemapRoutes = await getDynamicPublicSitemapEntries();
  const sitemapRoutes = dedupeSitemapEntries([
    ...stablePublicSitemapRoutes,
    ...dynamicSitemapRoutes,
  ]);

  return sitemapRoutes.map(
    ({ path, changeFrequency, priority, lastModified }) => ({
      url: getPublicSitePathUrl(path),
      changeFrequency,
      priority,
      lastModified,
    })
  );
}
