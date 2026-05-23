import "server-only";

import { unstable_cache } from "next/cache";
import { getArticleBySlugPopulated } from "@/lib/data/services/getArticleBySlugPopulated";
import { getArticleNavigationList } from "@/lib/data/services/getArticleNavigationList";

export const BIOGRAPHY_CACHE_REVALIDATE_SECONDS = 10 * 60;

export const getCachedBiographyArticleBySlug = unstable_cache(
  async (slug: string) => getArticleBySlugPopulated(slug),
  ["public-biography-article-detail"],
  { revalidate: BIOGRAPHY_CACHE_REVALIDATE_SECONDS }
);

export const getCachedBiographyNavigationList = unstable_cache(
  async () => getArticleNavigationList("biography"),
  ["public-biography-article-navigation"],
  { revalidate: BIOGRAPHY_CACHE_REVALIDATE_SECONDS }
);
