export const readArtwork = async (artworkId: string) => {
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
