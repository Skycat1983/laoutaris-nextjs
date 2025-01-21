/**
 * @fileoverview
 * This utility function fetches articles from the Article collection based on specified criteria.
 *
 * - **Purpose:**
 *   The `fetchArticles` function is designed to retrieve any number of articles from the Article collection in MongoDB.
 *   It leverages an identifier key and value to filter the articles and allows specifying which fields of each article
 *   should be returned. This flexibility enables efficient data fetching tailored to specific needs, reducing unnecessary data transfer.
 *
 * - **Parameters:**
 *   - `identifierKey` (string):
 *     The key used to identify and filter articles in the collection (e.g., "slug", "section").
 *   - `identifierValue` (string):
 *     The value corresponding to the `identifierKey` used for filtering (e.g., "biography", "tech").
 *   - `fields` (string[], optional):
 *     An array of field names specifying which properties of each article should be returned.
 *     If omitted or empty, all fields of the articles will be fetched.
 *
 * - **Returns:**
 *   - `Promise<ApiResponse<T[]>>`:
 *     A promise that resolves to an `ApiResponse` object containing either:
 *     - `success: true` and `data: T[]`:
 *       An array of articles matching the criteria, each containing only the specified fields.
 *     - `success: false` and `message: string`:
 *       An error message indicating the reason for the failure.
 *
 * - **Behavior:**
 *   1. **Construct Query Parameters:**
 *      Builds a query string using the provided `identifierKey`, `identifierValue`, and optional `fields`.
 *
 *   2. **Fetch Data:**
 *      Sends a GET request to the `/api/article` route handler with the constructed query parameters.
 *
 *   3. **Handle Response:**
 *      - If the response indicates success, it returns the fetched data.
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
 *
 * - **Notes:**
 *   - **Type Safety:**
 *     The generic type `T` allows for flexible typing based on the expected shape of the fetched articles.
 *     Ensure that the provided type aligns with the fields being requested to maintain type safety.
 *   - **Future Enhancements:**
 *     - Add support for additional query parameters (e.g., sorting, pagination).
 */

import { headers } from "next/headers";

export async function fetchArticles<T>(
  identifierKey: string,
  identifierValue: string,
  fields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({
    identifierKey,
    identifierValue,
  });

  if (fields && fields.length > 0) {
    queryParams.append("fields", fields.join(","));
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/article?${queryParams.toString()}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: result.data as T,
      statusCode: response.status,
    };
  } catch (error) {
    console.error("Error fetching article fields:", error);
    return {
      success: false,
      message: "Failed to fetch article fields",
      statusCode: 500,
    };
  }
}
