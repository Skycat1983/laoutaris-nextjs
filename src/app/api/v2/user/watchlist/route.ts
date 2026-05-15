import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { UserModel } from "@/lib/data/models";
import { RouteResponse } from "@/lib/data/types";
import { ArtworkLean } from "@/lib/data/types/artworkTypes";
import { isNextError } from "@/lib/helpers/isNextError";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import dbConnect from "@/lib/db/mongodb";
import { NextRequest } from "next/server";

type UserWithWatchlist = {
  _id: string;
  watchlist: ArtworkLean[];
};

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiArtworkListResult>> {
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  try {
    await dbConnect();

    const userWithWatchlist = await UserModel.findById(userGuard.userId)
      .select("watchlist")
      .populate("watchlist")
      .lean<UserWithWatchlist>();

    if (!userWithWatchlist) {
      return apiErrorResponse({
        message: "User not found",
        status: 404,
      });
    }

    const artworks = userWithWatchlist.watchlist.map((artwork) =>
      transformArtwork.toFrontend(artwork)
    );

    return apiListResponse(artworks, {
      total: artworks.length,
      page: 1,
      limit: artworks.length,
      totalPages: 1,
    });
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
