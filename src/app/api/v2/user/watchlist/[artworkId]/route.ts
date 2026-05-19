import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { NextRequest } from "next/server";

import type { RouteResponse } from "@/lib/data/types";
import { ApiWatchlistItemResult } from "@/lib/api/user/watchlist/fetchers";
import { getOwnWatchlistArtwork } from "@/lib/data/services/getOwnSavedArtwork";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { artworkId: string } }
): Promise<RouteResponse<ApiWatchlistItemResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/user/watchlist/[artworkId]"
  );
  const logger = createApiLogger(requestContext);
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  const { artworkId } = params;

  try {
    const result = await getOwnWatchlistArtwork(userGuard.userId, artworkId);

    if (result.status === "artwork-not-found") {
      return apiErrorResponse({
        message: "Artwork not found",
        status: 404,
      });
    }

    if (result.status === "not-in-watchlist") {
      return apiErrorResponse({
        message: "Artwork not in watchlist",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiWatchlistItemResult["data"]>(result.artwork);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("api.user.watchlist_detail.failed", {
      operation: "user_watchlist_detail",
      artworkId,
      error,
      errorLabel: "user_watchlist_detail_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch watchlist artwork",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}
