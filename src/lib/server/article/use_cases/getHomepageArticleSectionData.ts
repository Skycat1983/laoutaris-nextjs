import { FrontendArticleUnpopulated } from "../../../types/articleTypes";
import { fetchArticles } from "../data-fetching/fetchArticles";

type HomeBiographySectionCardData = Pick<
  FrontendArticleUnpopulated,
  "title" | "subtitle" | "imageUrl" | "slug"
>;

export const getHomepageArticleSectionData = async (): Promise<
  HomeBiographySectionCardData[]
> => {
  const identifierKey = "section";
  const identifierValue = "biography";
  const fields = ["title", "subtitle", "slug", "imageUrl"];

  const response = await fetchArticles<HomeBiographySectionCardData[]>(
    identifierKey,
    identifierValue,
    fields
  );

  if (!response.success) {
    throw new Error(
      response.message || "Failed to fetch homepage biography data"
    );
  }

  return response.data;
};
