import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { UserModel } from "@/lib/data/models";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import { ArtworkLean } from "@/lib/data/types/artworkTypes";
import { isNextError } from "@/lib/helpers/isNextError";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import dbConnect from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";

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
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error fetching user watchlist:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user watchlist",
    } satisfies ApiErrorResponse);
  }
}
