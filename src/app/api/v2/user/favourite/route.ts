import type { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { getOwnFavouriteArtworkList } from "@/lib/data/services/getOwnSavedArtwork";
import type { RouteResponse } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiArtworkListResult>> {
  const requestContext = createRequestContext(req, "/api/v2/user/favourite");
  const logger = createApiLogger(requestContext);
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  try {
    const result = await getOwnFavouriteArtworkList(userGuard.userId);

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
    logger.error("api.user.favourite_list.failed", {
      operation: "user_favourite_list",
      error,
      errorLabel: "user_favourite_list_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch user favourites",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}
