"use server";

import { getBlogList } from "@/lib/data/services/getBlogList";
import type { BlogEntryFrontend } from "@/lib/data/types/blogTypes";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "BlogPrototypeLoader",
  operation: "prototype.home.blog.loader",
  surface: "server_loader",
});

const BLOG_PROTOTYPE_FETCH_CONFIG = {
  sortby: "latest" as const,
  limit: 5,
} as const;

export async function getBlogPrototypeEntries(): Promise<BlogEntryFrontend[]> {
  try {
    const result = await getBlogList({
      sortby: BLOG_PROTOTYPE_FETCH_CONFIG.sortby,
      limit: BLOG_PROTOTYPE_FETCH_CONFIG.limit,
    });

    return result.data;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.prototype.home.blog.failed", { error });
    return [];
  }
}
