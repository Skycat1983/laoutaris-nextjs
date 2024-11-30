import { headers } from "next/headers";

export async function fetchUserWatchlists<T>(
  userKey: string,
  userValue: string,
  userFields?: string[],
  artworkFields?: string[]
): Promise<ApiResponse<T>> {
  const queryParams = new URLSearchParams({
    userKey,
    userValue,
  });

  if (userFields && userFields.length > 0) {
    queryParams.append("userFields", userFields.join(","));
  }

  if (artworkFields && artworkFields.length > 0) {
    queryParams.append("artworkFields", artworkFields.join(","));
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/user/watchlists?${queryParams.toString()}`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to fetch user data",
      };
    }

    return { success: true, data: result.data as T };
  } catch (error) {
    console.error("Error fetching user watchlist artwork:", error);
    return {
      success: false,
      message: "Failed to fetch user watchlist artwork",
    };
  }
}
