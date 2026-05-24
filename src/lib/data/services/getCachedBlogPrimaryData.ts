import "server-only";

import { unstable_cache } from "next/cache";
import { getBlogBySlugWithAuthor } from "@/lib/data/services/getBlogBySlugWithAuthor";

export const BLOG_PRIMARY_CACHE_REVALIDATE_SECONDS = 10 * 60;

export const getCachedBlogBySlugWithAuthor = unstable_cache(
  async (slug: string) => getBlogBySlugWithAuthor(slug),
  ["public-blog-primary-detail"],
  { revalidate: BLOG_PRIMARY_CACHE_REVALIDATE_SECONDS }
);
