"use server";

import { FrontendArticleWithArtwork } from "@/lib/types/articleTypes";
import { fetchArticleFeed } from "../data-fetching/fetchArticleFeed";

export async function getArticleFeed() {
  try {
    const articles: FrontendArticleWithArtwork[] = await fetchArticleFeed();
    return articles;
  } catch (error) {
    console.error("Article feed error:", error);
    throw new Error("Failed to get article feed");
  }
}
