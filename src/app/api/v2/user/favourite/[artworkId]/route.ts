import { NextResponse } from "next/server";
import { ArtworkModel } from "@/lib/data/models";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { NextRequest } from "next/server";

import { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import { ApiFavoritesItemResult } from "@/lib/api/user/favorites/fetchers";
import { ArtworkLean, ArtworkFrontend } from "@/lib/data/types";
import dbConnect from "@/lib/db/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { artworkId: string } }
): Promise<RouteResponse<ApiFavoritesItemResult>> {
  const userId = await getUserIdFromSession();

  try {
    await dbConnect();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      } satisfies ApiErrorResponse);
    }

    const { artworkId } = params;

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

    if (!artworkFrontend.isFavourited) {
      return NextResponse.json({
        success: false,
        error: "Artwork not in favourites",
      } satisfies ApiErrorResponse);
    }

    return NextResponse.json({
      success: true,
      data: artworkFrontend,
    } satisfies ApiFavoritesItemResult);
  } catch (error) {
    console.error("Error in GET /user/favourites/:artworkId:", error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
    } satisfies ApiErrorResponse);
  }
}
