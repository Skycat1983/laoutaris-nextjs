import { headers } from "next/headers";

export async function fetchUserFavourite<T>(
  userKey: string,
  userValue: string,
  artworkId: string,
  artworkFields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({
    userKey,
    userValue,
    artworkId,
  });

  // Append artworkFields if provided
  if (artworkFields && artworkFields.length > 0) {
    queryParams.append("artworkFields", artworkFields.join(","));
  }

  try {
    // Make the GET request to the 'favourites' validation API route
    const response = await fetch(
      `http://localhost:3000/api/user/favourite?${queryParams.toString()}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    // Parse the JSON response
    const result = await response.json();

    // Check if the response indicates success
    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to fetch data",
      };
    }

    // Return the successful response with the fetched data
    return { success: true, data: result.data as T };
  } catch (error) {
    console.error("Error fetching user favourite:", error);
    return { success: false, message: "Failed to fetch user favourite" };
  }
}
