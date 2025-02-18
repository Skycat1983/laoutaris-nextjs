import { FrontendArticleWithArtwork } from "../../../../src/lib/data/types/articleTypes";
import {
  FrontendArticleWithArtworkTooltip,
  articleToView,
} from "../../../../src/lib/transforms/articleToPublic";
import { fetchArticleArtwork } from "../data-fetching/fetchArticleArtwork";
import { fetchAndResolveObj } from "@/lib/utils/fetchAndResolveObj";

export const getArticle = async ({
  segment,
  slug,
}: {
  segment: string;
  slug: string;
}): Promise<FrontendArticleWithArtworkTooltip> => {
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

  return fetchAndResolveObj<
    FrontendArticleWithArtwork,
    FrontendArticleWithArtworkTooltip
  >(
    fetcher,
    identifierKey,
    identifierValue,
    articleFields,
    resolver,
    artworkFields
  )();

  // const articleDetails = await fetchAndResolveObj<
  //   FrontendArticleWithArtwork,
  //   FrontendArticleWithArtworkTooltip
  // >(
  //   fetcher,
  //   identifierKey,
  //   identifierValue,
  //   articleFields,
  //   resolver,
  //   artworkFields
  // )();

  // if (articleDetails.section !== segment) {
  //   throw new Error(
  //     `Article with slug "${slug}" does not belong to the "${segment}" section.`
  //   );
  // }

  // return articleDetails;
};
