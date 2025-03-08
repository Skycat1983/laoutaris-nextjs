import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import { ArtworkModel } from "@/lib/data/models";
import { transformMongooseDoc } from "@/lib/transforms/transformMongooseDoc";
import { ReadArtworkResult } from "@/lib/api/admin/read/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadArtworkResult>> {
  const hasPermission = await isAdmin();
  if (!hasPermission) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }
  const { id } = params;

  try {
    const rawArtwork = await ArtworkModel.findById(id).lean().exec();

    if (!rawArtwork) {
      return NextResponse.json(
        {
          success: false,
          error: "Artwork not found",
        } satisfies ApiErrorResponse,
        {
          status: 404,
        }
      );
    }

    const artwork = transformMongooseDoc<FrontendArtwork>(rawArtwork);

    return NextResponse.json({
      success: true,
      data: artwork,
    } satisfies ReadArtworkResult);
  } catch (error) {
    console.error("Error reading artwork:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read artwork",
      } satisfies ApiErrorResponse,
      {
        status: 500,
      }
    );
  }
}
