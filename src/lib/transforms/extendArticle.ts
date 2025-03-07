import {
  ArticleExtended,
  ArticleExtendedPopulated,
  ArticleLean,
  ArticleLeanPopulated,
} from "@/lib/data/types";
import { extendArtwork } from "./extendArtwork";
import { extendUser } from "./extendUser";

export const extendArticle = (articleLean: ArticleLean): ArticleExtended => {
  return { ...articleLean };
};

export const extendArticlePopulated = (
  article: ArticleLeanPopulated
): ArticleExtendedPopulated => {
  const { author, artwork, ...rest } = article;

  return {
    ...rest, // Spread the remaining fields
    author: extendUser(author), // Ensure author is properly extended
    artwork: extendArtwork(artwork), // Extend artwork
  };
};
