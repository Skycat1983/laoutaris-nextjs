import { FrontendArticleWithArtworkAndAuthor } from "../src/lib/data/types/articleTypes";
import { FrontendArtwork } from "../src/lib/data/types/artworkTypes";
import { FrontendCollectionWithArtworks } from "../src/lib/data/types/collectionTypes";

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

type FilterParams = {
  key: "decade" | "artstyle" | "medium" | "surface" | null;
  value: string | null;
};

export const readArtworks = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    filter?: FilterParams;
  } = {}
): Promise<ApiSuccessResponse<FrontendArtwork[]>> => {
  const { page = 1, limit = 100, search = "", filter } = params;

  try {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search ? { search } : {}),
      ...(filter?.key && filter?.value
        ? {
            filterKey: filter.key,
            filterValue: filter.value,
          }
        : {}),
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
