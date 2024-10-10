import { headers } from "next/headers";

export async function fetchArticleArtwork<T>(
  articleKey: string,
  articleValue: string,
  articleFields?: string[],
  artworkFields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({
    articleKey,
    articleValue,
  });

  if (articleFields && articleFields.length > 0) {
    queryParams.append("articleFields", articleFields.join(","));
  }

  if (artworkFields && artworkFields.length > 0) {
    queryParams.append("artworkFields", artworkFields.join(","));
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/article/artwork?${queryParams.toString()}`,
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
    console.error("Error fetching article artwork:", error);
    return { success: false, message: "Failed to fetch article artwork" };
  }
}
