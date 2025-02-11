"use server";

import type { FrontendArticle } from "@/lib/types/articleTypes";
import HomeBiographySection from "@/components/contentSections/HomeBiographySection";
import { fetchArticles } from "@/lib/api/articleApi";
import { transformToPick } from "@/lib/transforms/transformToPick";

// Config Constants
const BIOGRAPHY_FETCH_CONFIG = {
  section: "biography",
  fields: ["title", "subtitle", "slug", "imageUrl"] as const,
} as const;

// Type Definitions
// export type BiographyCardData = Pick<
//   FrontendArticle,
//   "title" | "subtitle" | "imageUrl" | "slug"
// >;

// Loader Function
export async function HomeBiographySectionLoader() {
  try {
    // Fetch data using API layer
    const articles = await fetchArticles({
      section: BIOGRAPHY_FETCH_CONFIG.section,
      fields: BIOGRAPHY_FETCH_CONFIG.fields,
    });

    // Transform data using transform layer
    const biographyCards = articles.map((article) =>
      transformToPick(article, BIOGRAPHY_FETCH_CONFIG.fields)
    );

    // Return component with transformed data
    return <HomeBiographySection articles={biographyCards} />;
  } catch (error) {
    console.error("Biography section loading failed:", error);
    return null;
  }
}
