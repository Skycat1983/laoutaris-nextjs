import { fetchAndResolve } from "@/utils/fetchAndResolve";
import { FrontendArticleWithArtwork } from "../client/types/articleTypes";
import {
  ArticleViewWithArtworkTooltip,
  articleToView,
} from "../resolvers/articleToView";
import { fetchArticleArtwork } from "../server/article/data-fetching/fetchArticleArtwork";

export const getArticleView = async ({ slug }: { slug: string }) => {
  const fetcher = fetchArticleArtwork;
  const identifierKey = "slug";
  const identifierValue = slug;

  // empty array = all fields
  const articleFields: string[] = [];

  const artworkFields: string[] = [
    "image.secure_url",
    "image.pixelHeight",
    "image.pixelWidth",
  ];

  const resolver = articleToView;

  const [articleDetails] = await fetchAndResolve<
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
