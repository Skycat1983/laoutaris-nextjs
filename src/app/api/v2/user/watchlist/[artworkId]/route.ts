import { NextResponse } from "next/server";
import { ArtworkModel } from "@/lib/data/models";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { NextRequest } from "next/server";

import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { ApiFavoritesItemResult } from "@/lib/api/user/favorites/fetchers";
import { ArtworkLean, ArtworkFrontend } from "@/lib/data/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { artworkId: string } }
): Promise<RouteResponse<ApiFavoritesItemResult>> {
  const { artworkId } = params;

  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      } satisfies ApiErrorResponse);
    }

    const leanArtwork = (await ArtworkModel.findById(
      artworkId
    ).lean()) as ArtworkLean | null;

    if (!leanArtwork) {
      return NextResponse.json({
        success: false,
        error: "Artwork not found",
      } satisfies ApiErrorResponse);
    }

    const artworkFrontend: ArtworkFrontend = transformArtwork.toFrontend(
      leanArtwork,
      userId
    );

    if (!artworkFrontend.isWatchlisted) {
      return NextResponse.json({
        success: false,
        error: "Artwork not in watchlist",
      } satisfies ApiErrorResponse);
    }

    return NextResponse.json({
      success: true,
      data: artworkFrontend,
    } satisfies ApiFavoritesItemResult);
  } catch (error) {
    console.error("Error in GET /user/watchlist/:artworkId:", error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    } satisfies ApiErrorResponse);
  }
}
