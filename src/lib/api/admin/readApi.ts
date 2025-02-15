import { FrontendArticleWithArtworkAndAuthor } from "../../data/types/articleTypes";
import { FrontendArtwork } from "../../data/types/artworkTypes";
import { FrontendCollectionWithArtworks } from "../../data/types/collectionTypes";

export const readArtwork = async (
  artworkId: string
): Promise<FrontendArtwork> => {
  try {
    const response = await fetch(
      `/api/v2/admin/artwork/read/${encodeURIComponent(artworkId)}`
    );
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
    `/api/v2/admin/article/read/${encodeURIComponent(objectId)}`
  );
  const result: ApiResponse<FrontendArticleWithArtworkAndAuthor> =
    await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch article");
  }

  return result.data;
};

export const readCollection = async (
  collectionId: string
): Promise<FrontendCollectionWithArtworks> => {
  const response = await fetch(
    `/api/v2/admin/collection/read/${encodeURIComponent(collectionId)}`
  );
  const result: ApiResponse<FrontendCollectionWithArtworks> =
    await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch collection");
  }

  return result.data;
};

export const readArtworks = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}
): Promise<ApiSuccessResponse<FrontendArtwork[]>> => {
  const { page = 1, limit = 100, search = "" } = params;

  try {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search ? { search } : {}),
    });

    const response = await fetch(`/api/v2/admin/artwork/read?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: ApiResponse<FrontendArtwork[]> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch artworks");
    }

    return result;
  } catch (error) {
    throw new Error(
      `API Error: ${
        error instanceof Error ? error.message : "Unknown error occurred"
      }`
    );
  }
};
