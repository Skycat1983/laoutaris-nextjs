import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import { ArtworkModel } from "@/lib/data/models";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { ApiResponse } from "@/lib/data/types/apiTypes";
import { ReadArtworkResult } from "@/lib/api/admin/read/fetchers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<ApiResponse<ReadArtworkResult>> {
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
