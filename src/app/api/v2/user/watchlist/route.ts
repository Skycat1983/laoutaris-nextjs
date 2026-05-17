import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { getOwnWatchlistArtworkList } from "@/lib/data/services/getOwnSavedArtwork";
import { RouteResponse } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiArtworkListResult>> {
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  try {
    const result = await getOwnWatchlistArtworkList(userGuard.userId);

    if (!result) {
      return apiErrorResponse({
        message: "User not found",
        status: 404,
      });
    }

    return apiListResponse(result.artworks, result.metadata);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error fetching user watchlist:", error);
    return apiErrorResponse({
      message: "Failed to fetch user watchlist",
      status: 500,
    });
  }
}
