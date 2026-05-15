import { ArtworkModel } from "@/lib/data/models";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { NextRequest } from "next/server";

import { RouteResponse } from "@/lib/data/types";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { ApiFavoritesItemResult } from "@/lib/api/user/favorites/fetchers";
import { ArtworkLean, ArtworkFrontend } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";
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
    await dbConnect();

    const { artworkId } = params;

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

    if (!artworkFrontend.isFavourited) {
      return apiErrorResponse({
        message: "Artwork not in favourites",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiFavoritesItemResult["data"]>(artworkFrontend);
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
