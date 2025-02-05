import type { FrontendArticle } from "@/lib/types/articleTypes";
import HomeBiographySection from "../homepageSections/HomeBiographySection";
import { fetchArticles } from "@/lib/api/articleApi";
import { transformToPick } from "@/lib/transforms/dataTransforms";

export type BiographyCardData = Pick<
  FrontendArticle,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

const BIOGRAPHY_FETCH_CONFIG = {
  section: "biography",
  fields: ["title", "subtitle", "slug", "imageUrl"] as const,
} as const;

export async function HomeBiographySectionLoader() {
  try {
    const articles = await fetchArticles({
      section: BIOGRAPHY_FETCH_CONFIG.section,
      fields: BIOGRAPHY_FETCH_CONFIG.fields,
    });

    const biographyCards = articles.map((article) =>
      transformToPick(article, BIOGRAPHY_FETCH_CONFIG.fields)
    );

    return <HomeBiographySection articles={biographyCards} />;
  } catch (error) {
    console.error("Biography section loading failed:", error);
    return null;
  }
}
