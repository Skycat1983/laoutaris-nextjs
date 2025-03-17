import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import { UserModel } from "@/lib/data/models";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import { ArtworkLean } from "@/lib/data/types/artworkTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { isNextError } from "@/lib/helpers/isNextError";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { NextRequest, NextResponse } from "next/server";

type UserWithFavourites = {
  _id: string;
  favourites: ArtworkLean[];
};

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiArtworkListResult>> {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }
    const userWithFavourites = await UserModel.findById(userId)
      .select("favourites")
      .populate("favourites")
      .lean<UserWithFavourites>();

    if (!userWithFavourites) {
      return NextResponse.json({
        success: false,
        error: "User not found",
      } satisfies ApiErrorResponse);
    }

    const artworks = userWithFavourites.favourites.map((artwork) =>
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
    console.error("Error fetching user favourites:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user favourites",
    } satisfies ApiErrorResponse);
  }
}
