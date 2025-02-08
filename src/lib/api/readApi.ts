import {
  FrontendArticle,
  FrontendArticleWithArtworkAndAuthor,
} from "../types/articleTypes";
import { FrontendArtwork } from "../types/artworkTypes";

export const readArtwork = async (
  artworkId: string
): Promise<FrontendArtwork> => {
  try {
    const response = await fetch(`/api/v2/admin/artwork/read?_id=${artworkId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch artwork");
    }

    return data;
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
  try {
    const response = await fetch(
      `/api/v2/admin/article/read?_id=${encodeURIComponent(objectId)}`
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch article");
    }

    return data;
  } catch (error) {
    throw new Error(
      `API Error: ${
        error instanceof Error ? error.message : "Unknown error occurred"
      }`
    );
  }
};
