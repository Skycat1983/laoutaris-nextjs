import { FrontendArticleWithArtwork } from "../client/types/articleTypes";
import {
  ArticleViewWithArtworkTooltip,
  articleToView,
} from "../resolvers/articleToView";
import { fetchArticleArtwork } from "../server/article/data-fetching/fetchArticleArtwork";
import { fetchAndResolveObj } from "@/utils/fetchAndResolveObj";

export const getArticleView = async ({
  slug,
}: {
  slug: string;
}): Promise<ArticleViewWithArtworkTooltip> => {
  const fetcher = fetchArticleArtwork;
  const identifierKey = "slug";
  const identifierValue = slug;

  //* empty array = all fields
  const articleFields: string[] = [];

  const artworkFields: string[] = [
    "image.secure_url",
    "image.pixelHeight",
    "image.pixelWidth",
  ];

  const resolver = articleToView;

  const articleDetails = await fetchAndResolveObj<
    FrontendArticleWithArtwork,
    ArticleViewWithArtworkTooltip
  >(
    fetcher,
    identifierKey,
    identifierValue,
    articleFields,
    resolver,
    artworkFields
  )();

  return articleDetails;
};
