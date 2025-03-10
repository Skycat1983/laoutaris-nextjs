import { NextResponse } from "next/server";
import { ArtworkModel } from "@/lib/data/models";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  Artwork,
} from "@/lib/data/types";
import { transformArtwork } from "@/lib/transforms/transformArtwork";
import { NextRequest } from "next/server";
import { ArtworkTransformations } from "@/lib/data/types/artworkTypes";
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

    const leanArtwork = (await ArtworkModel.findById(artworkId).lean()) as
      | ArtworkTransformations["Lean"]
      | null;

    if (!leanArtwork) {
      return NextResponse.json({
        success: false,
        error: "Artwork not found",
      } satisfies ApiErrorResponse);
    }

    const data: Artwork = transformArtwork(leanArtwork, userId);

    if (!data.isFavourited) {
      return NextResponse.json({
        success: false,
        error: "Artwork not in favourites",
      } satisfies ApiErrorResponse);
    }

    return NextResponse.json({
      success: true,
      data: data,
    } satisfies ApiSuccessResponse<Artwork>);
  } catch (error) {
    console.error("Error in GET /user/favourites/:artworkId:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
