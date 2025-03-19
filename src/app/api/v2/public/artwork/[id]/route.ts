import { ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { ArtworkLean, ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import { ApiArtworkResult } from "@/lib/api/public/artwork/fetchers";
import { transformArtwork } from "@/lib/transforms/artwork/transformArtwork";
import dbConnect from "@/lib/db/mongodb";
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ApiArtworkResult>> {
  await dbConnect();

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

    const artwork: ArtworkFrontend = transformArtwork.toFrontend(
      leanDoc,
      userId
    );

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
