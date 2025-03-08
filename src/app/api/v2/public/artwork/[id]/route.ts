import { ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { Artwork, ArtworkLean } from "@/lib/data/types/artworkTypes";
import { ApiArtworkResult } from "@/lib/api/public/artwork/fetchers";
import { transformArtwork } from "@/lib/transforms/transformArtwork";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ApiArtworkResult>> {
  const { id } = params;
  const userId = await getUserIdFromSession();

  try {
    const leanDoc = await ArtworkModel.findById(id).lean<ArtworkLean>();
    if (!leanDoc)
      return NextResponse.json(
        {
          success: false,
          error: "Artwork not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );

    const artwork: Artwork = transformArtwork(leanDoc, userId);

    return NextResponse.json({
      success: true,
      data: artwork,
    } satisfies ApiArtworkResult);
  } catch (error) {
    console.error("Error fetching public artwork:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}

// 3. Calculate public properties
// const isWatchlisted = userId ? artwork.watcherlist.includes(userId) : false;
// const isFavourited = userId ? artwork.favourited.includes(userId) : false;
// const watchCount = artwork.watcherlist.length;
// const favouriteCount = artwork.favourited.length;

// // 4. Construct public artwork
// const publicArtwork: PublicFrontendArtwork = {
//   _id: artwork._id,
//   title: artwork.title,
//   image: sanitizedImage,
//   decade: artwork.decade,
//   artstyle: artwork.artstyle,
//   medium: artwork.medium,
//   surface: artwork.surface,
//   featured: artwork.featured,
//   createdAt: artwork.createdAt,
//   updatedAt: artwork.updatedAt,
//   isWatchlisted,
//   isFavourited,
//   watchCount,
//   favouriteCount,
// };
