"use server";

import { BiographySection } from "@/components/sections/BiographySection";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";
import { ArticleFrontend } from "@/lib/data/types/articleTypes";
import { ApiSuccessResponse } from "@/lib/data/types/apiTypes";
import { isNextError } from "@/lib/helpers/isNextError";
// import { HeroLayout as BiographySection } from "@/components/sections/BiographySectionVariations";
export async function BiographySectionLoader() {
  try {
    const result = await serverPublicApi.article.multiple({
      section: "biography",
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    const { data: articles } = result as ApiSuccessResponse<ArticleFrontend[]>;

    return <BiographySection articles={articles} />;
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Biography section loading failed:", error);
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
