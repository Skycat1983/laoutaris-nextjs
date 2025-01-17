import { FrontendArticleFull } from "../client/types/articleTypes";
import { FrontendArtworkFull } from "../client/types/artworkTypes";
import { fetchArticleArtwork } from "../server/article/data-fetching/fetchArticleArtwork";

type SelectedArticleFields = Pick<FrontendArticleFull, "author">;

type SelectedArtworkFields = Omit<
  FrontendArtworkFull,
  "watcherlist" | "favourited"
>;

type BiographyArticleArtworkView = SelectedArticleFields & {
  artwork: SelectedArtworkFields;
};

export const getBiographyArticleArtwork = async ({
  slug,
}: {
  slug: string;
}) => {
  const identifierKey = "slug";
  const identifierValue = slug;

  const articleFields: string[] = [];

  const artworkFields: string[] = [
    "image.secure_url",
    "image.pixelHeight",
    "image.pixelWidth",
  ];

  return fetchArticleArtwork<BiographyArticleArtworkView>(
    identifierKey,
    identifierValue,
    articleFields,
    artworkFields
  );
};
