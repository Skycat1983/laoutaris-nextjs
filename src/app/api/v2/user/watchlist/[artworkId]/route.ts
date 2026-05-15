import { ArtworkModel } from "@/lib/data/models";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { NextRequest } from "next/server";

import { RouteResponse } from "@/lib/data/types";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { ApiWatchlistItemResult } from "@/lib/api/user/watchlist/fetchers";
import { ArtworkLean, ArtworkFrontend } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { artworkId: string } }
): Promise<RouteResponse<ApiWatchlistItemResult>> {
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  const { artworkId } = params;

  try {
    await dbConnect();

    const leanArtwork = (await ArtworkModel.findById(
      artworkId
    ).lean()) as ArtworkLean | null;

    if (!leanArtwork) {
      return apiErrorResponse({
        message: "Artwork not found",
        status: 404,
      });
    }

    const artworkFrontend: ArtworkFrontend = transformArtwork.toFrontend(
      leanArtwork,
      userGuard.userId
    );

    if (!artworkFrontend.isWatchlisted) {
      return apiErrorResponse({
        message: "Artwork not in watchlist",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiWatchlistItemResult["data"]>(artworkFrontend);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error in GET /user/watchlist/:artworkId:", error);
    return apiErrorResponse({
      message: "Failed to fetch watchlist artwork",
      status: 500,
    });
  }
}
