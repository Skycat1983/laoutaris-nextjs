import { NextResponse } from "next/server";
import { ArtworkModel } from "@/lib/data/models";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { NextRequest } from "next/server";

import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { ApiFavoritesItemResult } from "@/lib/api/user/favorites/fetchers";
import { ArtworkLean, ArtworkFrontend } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { artworkId: string } }
): Promise<RouteResponse<ApiFavoritesItemResult>> {
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
      return NextResponse.json({
        success: false,
        error: "Artwork not found",
      } satisfies ApiErrorResponse);
    }

    const artworkFrontend: ArtworkFrontend = transformArtwork.toFrontend(
      leanArtwork,
      userGuard.userId
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
