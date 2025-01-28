import type {
  FrontendArticleUnpopulated,
  FrontendArticleWithArtwork,
} from "@/lib/types/articleTypes";

export async function fetchArticleFeed(): Promise<
  FrontendArticleWithArtwork[]
> {
  const response = await fetch("http://localhost:3000/api/admin/article/read");

  if (!response.ok) {
    throw new Error("Failed to fetch article feed");
  }

  return response.json();
}
