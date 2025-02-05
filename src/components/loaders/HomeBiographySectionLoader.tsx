import type { FrontendArticle } from "@/lib/types/articleTypes";
import HomeBiographySection from "../homepageSections/HomeBiographySection";
import { headers } from "next/headers";

export type BiographyCardData = Pick<
  FrontendArticle,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

async function fetchBiographyArticles(): Promise<BiographyCardData[]> {
  const selectedFields = ["title", "subtitle", "slug", "imageUrl"].join(",");
  const response = await fetch(
    `${process.env.BASEURL}/api/v2/article?section=biography&fields=${selectedFields}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  const result = await response.json();
  if (!result.success) {
    throw new Error("Failed to fetch biography articles");
  }

  return result.data;
}

export async function HomeBiographySectionLoader() {
  const biographyArticles = await fetchBiographyArticles();
  // resolvers go here if/when needed

  return <HomeBiographySection articles={biographyArticles} />;
}
