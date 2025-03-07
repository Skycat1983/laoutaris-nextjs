import { ArticleLeanPopulated } from "@/lib/data/types";

export const extendArticlePopulated = (
  article: ArticleLeanPopulated
): ArticleFrontendPopulated => {
  return { ...article, author: article.author, artwork: article.artwork };
};
