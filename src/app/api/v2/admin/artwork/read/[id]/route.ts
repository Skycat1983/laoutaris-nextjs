import { ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import type { ReadSingleResponse } from "@/lib/api/admin/read/fetchers";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    } satisfies ReadSingleResponse<FrontendArtwork>);
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
