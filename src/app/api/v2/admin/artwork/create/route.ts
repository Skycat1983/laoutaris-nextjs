import { ArtworkModel } from "@/lib/data/models";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/config/authOptions";
import { FrontendArtwork } from "@/lib/data/types/artworkTypes";
import { createArtworkSchema } from "@/lib/data/schemas";
import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from "@/lib/data/types";
import { CreateArtworkResult } from "@/lib/api/admin/create/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";

export async function POST(
  request: NextRequest
): Promise<ApiResponse<CreateArtworkResult>> {
  const hasPermission = await isAdmin();
  const userId = await getUserIdFromSession();
  if (!hasPermission || !userId) {
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = createArtworkSchema.parse(body);

    // Ensure image data is properly structured
    const artworkData = {
      ...validatedData,
      author: userId,
      image: {
        format: validatedData.image.format,
        pixelWidth: validatedData.image.pixelWidth,
        pixelHeight: validatedData.image.pixelHeight,
        bytes: validatedData.image.bytes,
        public_id: validatedData.image.public_id,
        secure_url: validatedData.image.secure_url,
        hexColors: validatedData.image.hexColors,
        predominantColors: validatedData.image.predominantColors,
      },
    };

    // Create new artwork document
    const artwork = new ArtworkModel(artworkData);
    await artwork.save();

    return NextResponse.json<ApiSuccessResponse<FrontendArtwork>>({
      success: true,
      data: artwork,
    } satisfies CreateArtworkResult);
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create artwork",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
