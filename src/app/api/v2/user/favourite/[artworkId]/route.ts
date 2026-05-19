import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { NextRequest } from "next/server";

import type { RouteResponse } from "@/lib/data/types";
import { ApiFavoritesItemResult } from "@/lib/api/user/favorites/fetchers";
import { getOwnFavouriteArtwork } from "@/lib/data/services/getOwnSavedArtwork";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function GET(
  request: NextRequest,
  { params }: { params: { artworkId: string } }
): Promise<RouteResponse<ApiFavoritesItemResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/user/favourite/[artworkId]"
  );
  const logger = createApiLogger(requestContext);
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
    logger.error("api.user.favourite_detail.failed", {
      operation: "user_favourite_detail",
      artworkId: params.artworkId,
      error,
      errorLabel: "user_favourite_detail_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch favourite artwork",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}
