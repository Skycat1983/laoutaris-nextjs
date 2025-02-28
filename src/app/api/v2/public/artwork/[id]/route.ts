import { ArtworkModel } from "@/lib/data/models";
import { FrontendArtwork } from "@/lib/data/types";
import { NextRequest, NextResponse } from "next/server";

type ArtworkApiResponse = ApiResponse<FrontendArtwork>;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ArtworkApiResponse>> {
  const { id } = params;

  try {
    const artwork = await ArtworkModel.findById(id);

    if (!artwork) {
      return NextResponse.json({
        success: false,
        error: "Artwork not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    return NextResponse.json(
      {
        success: true,
        data: artwork,
      } satisfies ApiSuccessResponse<FrontendArtwork>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
        statusCode: 500,
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
