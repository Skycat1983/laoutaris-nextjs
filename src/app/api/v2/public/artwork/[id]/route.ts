import { ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { PublicArtworkResult } from "@/lib/api/public/artwork/fetchers";
import { sanitizeImage } from "@/lib/transforms/sanitizeImage";
import {
  PublicArtworkImage,
  ArtworkImage,
  FrontendArtwork,
  PublicFrontendArtwork,
} from "@/lib/data/types";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<PublicArtworkResult>> {
  const { id } = params;
  const userId = await getUserIdFromSession();

  try {
    // 1. Get raw data and transform to FrontendArtwork
    const rawArtwork = await ArtworkModel.findById(id).lean();
    if (!rawArtwork) {
      return NextResponse.json({
        success: false,
        error: "Artwork not found",
      } satisfies ApiErrorResponse);
    }
    const artwork = transformMongooseDoc<FrontendArtwork>(rawArtwork);

    // 2. Sanitize the image
    const sanitizedImage = sanitizeImage(artwork.image);

    // 3. Calculate public properties
    const isWatchlisted = userId ? artwork.watcherlist.includes(userId) : false;
    const isFavourited = userId ? artwork.favourited.includes(userId) : false;
    const watchCount = artwork.watcherlist.length;
    const favouriteCount = artwork.favourited.length;

    // 4. Construct public artwork
    const publicArtwork: PublicFrontendArtwork = {
      _id: artwork._id,
      title: artwork.title,
      image: sanitizedImage,
      decade: artwork.decade,
      artstyle: artwork.artstyle,
      medium: artwork.medium,
      surface: artwork.surface,
      featured: artwork.featured,
      createdAt: artwork.createdAt,
      updatedAt: artwork.updatedAt,
      isWatchlisted,
      isFavourited,
      watchCount,
      favouriteCount,
    };

    return NextResponse.json({
      success: true,
      data: publicArtwork,
    } satisfies PublicArtworkResult);
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
