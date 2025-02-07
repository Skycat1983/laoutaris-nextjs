import type { FrontendArticleWithArtwork } from "@/lib/types/articleTypes";
import { headers } from "next/headers";

export async function fetchArticleFeed(): Promise<
  PaginatedResponse<FrontendArticleWithArtwork[]>
> {
  const response = await fetch(
    "http://localhost:3000/api/v2/admin/article/list",
    {
      method: "GET",
      headers: headers(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch article feed");
  }

  return response.json();
}
