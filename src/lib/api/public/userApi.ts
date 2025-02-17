import {
  FrontendUser,
  FrontendUserWithComments,
  FrontendUserWithFavourites,
  FrontendUserWithWatchlist,
} from "@/lib/data/types/userTypes";
import { headers } from "next/headers";

export async function fetchUserSettings(): Promise<ApiResponse<FrontendUser>> {
  try {
    const response = await fetch(`${process.env.BASEURL}/api/v2/user`, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const result = (await response.json()) as ApiResponse<FrontendUser>;

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch user");
    }

    return result;
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: "Failed to fetch user",
    } satisfies ApiErrorResponse;
  }
}

export async function fetchUserComments(): Promise<
  ApiResponse<FrontendUserWithComments>
> {
  try {
    const response = await fetch(
      `${process.env.BASEURL}/api/v2/user/comments`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user comments");
    }

    const result =
      (await response.json()) as ApiResponse<FrontendUserWithComments>;

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch user comments");
    }

    return result;
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return {
      success: false,
      error: "Failed to fetch user comments",
    } satisfies ApiErrorResponse;
  }
}

export async function fetchUserFavourites(): Promise<
  ApiResponse<FrontendUserWithFavourites>
> {
  try {
    const response = await fetch(
      `${process.env.BASEURL}/api/v2/user/favourites`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user favourites");
    }

    const result =
      (await response.json()) as ApiResponse<FrontendUserWithFavourites>;

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch user favourites");
    }

    return result;
  } catch (error) {
    console.error("Error fetching user favourites:", error);
    return {
      success: false,
      error: "Failed to fetch user favourites",
    } satisfies ApiErrorResponse;
  }
}

export async function fetchUserWatchlist(): Promise<
  ApiResponse<FrontendUserWithWatchlist>
> {
  try {
    const response = await fetch(
      `${process.env.BASEURL}/api/v2/user/watchlist`,
      {
        method: "GET",
        headers: headers(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user watchlist");
    }

    const result =
      (await response.json()) as ApiResponse<FrontendUserWithWatchlist>;

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch user watchlist");
    }

    return result;
  } catch (error) {
    console.error("Error fetching user watchlist:", error);
    return {
      success: false,
      error: "Failed to fetch user watchlist",
    } satisfies ApiErrorResponse;
  }
}
