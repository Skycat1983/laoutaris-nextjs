import { ArtworkModel } from "@/lib/data/models";
import { FrontendArtworkUnpopulated } from "@/lib/data/types/artworkTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import {
  artworkToPublic,
  PublicArtwork,
} from "@/lib/transforms/artworkToPublic";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { artworkId: string } }
) {
  try {
    console.log("params", params);
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      } satisfies ApiErrorResponse);
    }

    const { artworkId } = params;

    const rawArtwork = await ArtworkModel.findById(artworkId).lean();

    if (!rawArtwork) {
      return NextResponse.json({
        success: false,
        error: "Artwork not found",
      } satisfies ApiErrorResponse);
    }

    const artwork =
      transformMongooseDoc<FrontendArtworkUnpopulated>(rawArtwork);
    const data: PublicArtwork = artworkToPublic(artwork, userId);

    if (!data.isWatchlisted) {
      return NextResponse.json({
        success: false,
        error: "Artwork not in watchlist",
      } satisfies ApiErrorResponse);
    }

    console.log("data in watchlist route", data);

    return NextResponse.json({
      success: true,
      data: data,
    } satisfies ApiSuccessResponse<PublicArtwork>);
  } catch (error) {
    console.error("Error in GET /user/watchlist/:artworkId:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
