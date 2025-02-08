import { FrontendArticleWithArtworkAndAuthor } from "../types/articleTypes";
import { FrontendArtwork } from "../types/artworkTypes";

export const readArtwork = async (
  artworkId: string
): Promise<FrontendArtwork> => {
  try {
    const response = await fetch(`/api/v2/admin/artwork/read?_id=${artworkId}`);
    const result: ApiResponse<FrontendArtwork> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch artwork");
    }

    return result.data;
  } catch (error) {
    throw new Error(
      `API Error: ${
        error instanceof Error ? error.message : "Unknown error occurred"
      }`
    );
  }
};

export const readArticle = async (
  objectId: string
): Promise<FrontendArticleWithArtworkAndAuthor> => {
  const response = await fetch(
    `/api/v2/admin/article/read?_id=${encodeURIComponent(objectId)}`
  );
  const result: ApiResponse<FrontendArticleWithArtworkAndAuthor> =
    await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch article");
  }

  return result.data;
};
