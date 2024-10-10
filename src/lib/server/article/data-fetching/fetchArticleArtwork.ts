/**
 * @fileoverview
 * This utility function fetches a specific article from the Article collection and populates its associated artwork.
 *
 * - **Purpose:**
 *   The `fetchArticleArtwork` function is designed to retrieve a single article from the Article collection in MongoDB based on a specified identifier key and value.
 *   Additionally, it populates the `artwork` property of the fetched article, retrieving detailed information about the associated artwork from the Artwork collection.
 *   The function allows specifying which fields of both the article and the populated artwork should be returned, enabling efficient and tailored data retrieval.
 *
 * - **Parameters:**
 *   - `articleKey` (string):
 *     The key used to identify and filter the article in the collection (e.g., "slug", "id").
 *   - `articleValue` (string):
 *     The value corresponding to the `articleKey` used for filtering (e.g., "john-doe", "12345").
 *   - `articleFields` (string[], optional):
 *     An array of field names specifying which properties of the article should be returned.
 *     If omitted or empty, all fields of the article will be fetched.
 *   - `artworkFields` (string[], optional):
 *     An array of field names specifying which properties of the populated artwork should be returned.
 *     If omitted or empty, all fields of the artwork will be fetched.
 *
 * - **Returns:**
 *   - `Promise<ApiResponse<T>>`:
 *     A promise that resolves to an `ApiResponse` object containing either:
 *     - `success: true` and `data: T`:
 *       The fetched article with its populated artwork, containing only the specified fields.
 *     - `success: false` and `message: string`:
 *       An error message indicating the reason for the failure.
 *
 * - **Behavior:**
 *   1. **Construct Query Parameters:**
 *      Builds a query string using the provided `articleKey`, `articleValue`, and optional `articleFields` and `artworkFields`.
 *
 *   2. **Fetch Data:**
 *      Sends a GET request to the `/api/article/artwork` route handler with the constructed query parameters.
 *
 *   3. **Handle Response:**
 *      - If the response indicates success, it returns the fetched article data with the populated artwork.
 *      - If the response indicates failure or if an error occurs during the fetch operation, it returns an appropriate error message.
 *
 * - **Error Handling:**
 *   - **Fetch Errors:**
 *     Catches any network or server errors that occur during the fetch operation and logs them to the console.
 *     Returns a failure response with a generic error message.
 *   - **API Errors:**
 *     If the API responds with `success: false`, the function returns the provided error message.
 *
 * - **Dependencies:**
 *   - `next/headers`:
 *     Utilizes the `headers` function from Next.js to include necessary headers in the fetch request.
 *   - **API Route Handler:**
 *     Assumes the existence of an API route at `/api/article/artwork` that handles the incoming requests, interacts with the MongoDB Article and Artwork collections, and returns the populated article data.
 *
 * - **Notes:**
 *   - **Type Safety:**
 *     The generic type `T` allows for flexible typing based on the expected shape of the fetched article and artwork data.
 *     Ensure that the provided type aligns with the fields being requested to maintain type safety.
 *   - **Future Enhancements:**
 *     - Add support for additional query parameters (e.g., sorting, filtering based on artwork properties).
 */

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
