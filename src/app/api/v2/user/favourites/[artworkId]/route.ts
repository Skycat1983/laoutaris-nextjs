import { NextResponse } from "next/server";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { FrontendArtworkUnpopulated } from "@/lib/data/types/artworkTypes";
import {
  artworkToPublic,
  PublicArtwork,
} from "@/lib/transforms/artworkToPublic";

export async function GET(
  request: Request,
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

    if (!data.isFavourited) {
      return NextResponse.json({
        success: false,
        error: "Artwork not in favourites",
      } satisfies ApiErrorResponse);
    }

    return NextResponse.json({
      success: true,
      data: data,
    } satisfies ApiSuccessResponse<PublicArtwork>);
  } catch (error) {
    console.error("Error in GET /user/favourites/:artworkId:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
