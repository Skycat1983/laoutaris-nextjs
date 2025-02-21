"use server";

import type { FrontendArticle } from "@/lib/data/types/articleTypes";
import { transformToPick } from "@/lib/transforms/transformToPick";
import { BiographySection } from "@/components/sections/BiographySection";
import { delay } from "@/lib/utils/debug";
import { serverPublicApi } from "@/lib/api/public/serverPublicApi";

// Config Constants
const BIOGRAPHY_FETCH_CONFIG = {
  section: "biography",
  fields: ["title", "subtitle", "slug", "imageUrl"] as const,
} as const;

// Type Definitions
type BiographyCardData = Pick<
  FrontendArticle,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

// Loader Function
export async function BiographySectionLoader() {
  await delay(2000);
  try {
    // Fetch data using API layer
    const result: ApiResponse<FrontendArticle[]> =
      await serverPublicApi.article.fetchArticles({
        section: BIOGRAPHY_FETCH_CONFIG.section,
        fields: BIOGRAPHY_FETCH_CONFIG.fields,
      });

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch articles");
    }

    const { data: articles } = result as ApiSuccessResponse<FrontendArticle[]>;

    // Transform data using transform layer
    const biographyCards: BiographyCardData[] = articles.map((article) =>
      transformToPick(article, BIOGRAPHY_FETCH_CONFIG.fields)
    );

    // Return component with transformed data
    return <BiographySection articles={biographyCards} />;
  } catch (error) {
    console.error("Biography section loading failed:", error);
    return null;
  }
}
