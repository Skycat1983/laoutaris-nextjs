import { fetchArticleArtwork } from "../server/article/data-fetching/fetchArticleArtwork";

export const getBiographyArticleArtwork = async ({
  slug,
}: {
  slug: string;
}) => {
  const fetcher = fetchArticleArtwork;
  const identifierKey = "slug";
  const identifierValue = slug;
  const articleFields = [];
  const artworkFields = [
    "image.secure_url",
    "image.pixelHeight",
    "image.pixelWidth",
  ];
  //   const resolver =
};
