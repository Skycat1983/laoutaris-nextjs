import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { NextRequest } from "next/server";

import { RouteResponse } from "@/lib/data/types";
import { ApiFavoritesItemResult } from "@/lib/api/user/favorites/fetchers";
import { getOwnFavouriteArtwork } from "@/lib/data/services/getOwnSavedArtwork";
import { isNextError } from "@/lib/helpers/isNextError";

export async function GET(
  request: NextRequest,
  { params }: { params: { artworkId: string } }
): Promise<RouteResponse<ApiFavoritesItemResult>> {
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  try {
    const { artworkId } = params;
    const result = await getOwnFavouriteArtwork(userGuard.userId, artworkId);

    if (result.status === "artwork-not-found") {
      return apiErrorResponse({
        message: "Artwork not found",
        status: 404,
      });
    }

    if (result.status === "not-in-favourites") {
      return apiErrorResponse({
        message: "Artwork not in favourites",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiFavoritesItemResult["data"]>(result.artwork);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error in GET /user/favourites/:artworkId:", error);
    return apiErrorResponse({
      message: "Failed to fetch favourite artwork",
      status: 500,
    });
  }
}
