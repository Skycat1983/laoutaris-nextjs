import { headers } from "next/headers";

export async function fetchUserFavourites<T>(
  userKey: string,
  userValue: string,
  userFields?: string[],
  favouritedArtworkFields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({
    userKey,
    userValue,
  });

  if (userFields && userFields.length > 0) {
    queryParams.append("userFields", userFields.join(","));
  }

  if (favouritedArtworkFields && favouritedArtworkFields.length > 0) {
    queryParams.append(
      "favouritedArtworkFields",
      favouritedArtworkFields.join(",")
    );
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/user/favourites?${queryParams.toString()}`,
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
    console.error("Error fetching user favourites:", error);
    return { success: false, message: "Failed to fetch user favourites" };
  }
}
