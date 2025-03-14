import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import { UserModel } from "@/lib/data/models";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import { ArtworkLean } from "@/lib/data/types/artworkTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { NextRequest, NextResponse } from "next/server";

type UserWithWatchlist = {
  _id: string;
  watchlist: ArtworkLean[];
};

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiArtworkListResult>> {
  const userId = await getUserIdFromSession();

  try {
    const userWithWatchlist = await UserModel.findById(userId)
      .select("watchlist")
      .populate("watchlist")
      .lean<UserWithWatchlist>();

    if (!userWithWatchlist) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    const artworks = userWithWatchlist.watchlist.map((artwork) =>
      transformArtwork.toFrontend(artwork)
    );

    return NextResponse.json({
      success: true,
      data: artworks,
      metadata: {
        total: artworks.length,
        page: 1,
        limit: artworks.length,
        totalPages: 1,
      },
    } satisfies ApiArtworkListResult);
  } catch (error) {
    console.error("Error fetching user watchlist:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user watchlist",
    } satisfies ApiErrorResponse);
  }
}
