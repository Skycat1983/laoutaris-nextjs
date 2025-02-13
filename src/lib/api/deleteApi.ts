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
      // Handle specific error cases
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
