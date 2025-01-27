import type { FrontendArticleUnpopulated } from "@/lib/types/articleTypes";
import { fetchArticleFeed } from "../data-fetching/fetchArticleFeed";

export const getArticleFeed = async () => {
  return await fetchArticleFeed();
};
