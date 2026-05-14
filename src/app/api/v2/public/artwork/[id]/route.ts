import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { ApiArtworkResult } from "@/lib/api/public/artwork/fetchers";
import { getArtworkById } from "@/lib/data/services/getArtworkById";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ApiArtworkResult>> {
  const { id } = params;

  try {
    const userId = await getUserIdFromSession();
    const artwork = await getArtworkById(id, userId);

    if (!artwork)
      return NextResponse.json(
        {
          success: false,
          error: "Artwork not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
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
