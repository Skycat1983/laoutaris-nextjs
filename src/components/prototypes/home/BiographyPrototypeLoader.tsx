"use server";

import { getArticleList } from "@/lib/data/services/getArticleList";
import type { ArticleFrontend } from "@/lib/data/types/articleTypes";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "BiographyPrototypeLoader",
  operation: "prototype.home.biography.loader",
  surface: "server_loader",
});

const BIOGRAPHY_PROTOTYPE_FETCH_CONFIG = {
  section: "biography",
  fields: "title subtitle imageUrl slug",
  limit: 5,
} as const;

export async function getBiographyPrototypeArticles(): Promise<
  ArticleFrontend[]
> {
  try {
    const result = await getArticleList(BIOGRAPHY_PROTOTYPE_FETCH_CONFIG);

    return result?.data ?? [];
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.prototype.home.biography.failed", { error });
    return [];
  }
}
