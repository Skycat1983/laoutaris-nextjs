"use server";

import { BiographySection } from "@/components/sections/BiographySection";
import { getArticleList } from "@/lib/data/services/getArticleList";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const logger = createServerLogger({
  component: "BiographySectionLoader",
  operation: "public.biography_section.loader",
  surface: "server_loader",
});

// import { HeroLayout as BiographySection } from "@/components/sections/BiographySectionVariations";
export async function BiographySectionLoader() {
  try {
    const result = await getArticleList({
      section: "biography",
    });

    if (!result) {
      throw new Error("No articles found");
    }

    return <BiographySection articles={result.data} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("loader.public.biography_section.failed", { error });
    return null;
  }
}

// Config Constants
// const BIOGRAPHY_FETCH_CONFIG = {
//   section: "biography",
//   fields: ["title", "subtitle", "slug", "imageUrl"] as const,
// } as const;

// // Type Definitions
// export type BiographyCardData = Pick<
//   FrontendArticle,
//   "title" | "subtitle" | "imageUrl" | "slug"
// >;
