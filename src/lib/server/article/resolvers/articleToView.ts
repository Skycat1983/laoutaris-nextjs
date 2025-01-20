import { FrontendArticleWithArtwork } from "../../../types/articleTypes";
import { FrontendArtworkUnpopulated } from "../../../types/artworkTypes";

type SelectedArtworkFields = Omit<
  FrontendArtworkUnpopulated,
  "watcherlist" | "favourited"
>;
type SelectedArtworkImageFields = Pick<
  FrontendArtworkUnpopulated["image"],
  "secure_url" | "pixelHeight" | "pixelWidth"
>;

type TransformedArtworkFields = Omit<SelectedArtworkFields, "image"> & {
  image: SelectedArtworkImageFields;
};

export type ArticleViewWithArtworkTooltip = Omit<
  FrontendArticleWithArtwork,
  "artwork"
> & {
  artwork: TransformedArtworkFields;
};

export const articleToView = (
  article: FrontendArticleWithArtwork
): ArticleViewWithArtworkTooltip => {
  const { watcherlist, favourited, ...restArtwork } = article.artwork;
  const { secure_url, pixelHeight, pixelWidth } = article.artwork.image;

  return {
    ...article,
    artwork: {
      ...restArtwork,
      image: { secure_url, pixelHeight, pixelWidth },
    },
  };
};
