interface DeleteArtworkResponse {
  success: boolean;
  message: string;
  articleId?: string; // for the conflict case
}

export const deleteArtwork = async (
  artworkId: string
): Promise<ApiResponse<DeleteArtworkResponse>> => {
  try {
    const response = await fetch(
      `/api/v2/admin/artwork/delete/${encodeURIComponent(artworkId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      // Handle specific error case where artwork is used in an article
      if (response.status === 409) {
        throw new Error(
          `Cannot delete: Artwork is used in article ${result.articleId}`
        );
      }
      throw new Error(result.message || "Failed to delete artwork");
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

interface DeleteArticleResponse {
  success: boolean;
  message: string;
}

export const deleteArticle = async (
  articleId: string
): Promise<ApiResponse<DeleteArticleResponse>> => {
  try {
    const response = await fetch(
      `/api/v2/admin/article/delete/${encodeURIComponent(articleId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete article");
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

interface DeleteBlogResponse {
  success: boolean;
  message: string;
}

export const deleteBlog = async (
  blogId: string
): Promise<ApiResponse<DeleteBlogResponse>> => {
  try {
    const response = await fetch(
      `/api/v2/admin/blog/delete/${encodeURIComponent(blogId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete blog");
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

interface DeleteCollectionResponse {
  success: boolean;
  message: string;
}

export const deleteCollection = async (
  collectionId: string
): Promise<ApiResponse<DeleteCollectionResponse>> => {
  try {
    const response = await fetch(
      `/api/v2/admin/collection/delete/${encodeURIComponent(collectionId)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to delete collection");
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
