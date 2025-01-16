import {
  HexColor,
  IFrontendArtwork,
  PredominantColors,
} from "../client/types/artworkTypes";
import {
  FrontendArticleFull,
  FrontendArtworkFull,
} from "../client/types/populatedTypes";

type SelectedArticleFields = Pick<FrontendArticleFull, "author">;

type SelectedArtworkFields = Omit<
  FrontendArtworkFull,
  "watcherlist" | "favourited"
>;

type TransitoryArticleArtwork = {
  article: SelectedArticleFields;
  artwork: SelectedArtworkFields;
};

// export const articleArtworkResolver = ({
// testing
