import { FrontendArticleFull, FrontendArtworkFull } from "./populatedTypes";

type SelectedArticleFields = Pick<FrontendArticleFull, "author">;

type SelectedArtworkFields = Omit<
  FrontendArtworkFull,
  "watcherlist" | "favourited"
>;

export type ArticleArtworkToArticleViewBridge = SelectedArticleFields & {
  artwork: SelectedArtworkFields;
};

export const articleArtworkResolver = (
  articlePopulated: ArticleArtworkToArticleViewBridge
): ArticleArtworkToArticleViewBridge => articlePopulated;

// testing
