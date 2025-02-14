"use server";

import { FrontendArticleWithArtwork } from "@/lib/data/types/articleTypes";
import { fetchArticleFeed } from "../../lib/server/admin/data-fetching/fetchArticleFeed";

export async function getArticleFeed() {
  try {
    const articles: FrontendArticleWithArtwork[] = await fetchArticleFeed();
    return articles;
  } catch (error) {
    console.error("Article feed error:", error);
    throw new Error("Failed to get article feed");
  }
}
