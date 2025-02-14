import { headers } from "next/headers";

export async function fetchCollectionArtwork<T>(
  collectionKey: string,
  collectionValue: string,
  collectionFields?: string[],
  artworkFields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({
    collectionKey,
    collectionValue,
  });

  if (collectionFields && collectionFields.length > 0) {
    queryParams.append("collectionFields", collectionFields.join(","));
  }

  if (artworkFields && artworkFields.length > 0) {
    queryParams.append("artworkFields", artworkFields.join(","));
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/collection/artwork?${queryParams.toString()}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to fetch data",
      };
    }

    return { success: true, data: result.data as T };
  } catch (error) {
    console.error("Error fetching collection artworks:", error);
    return { success: false, message: "Failed to fetch collection artworks" };
  }
}
