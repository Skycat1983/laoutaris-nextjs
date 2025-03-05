import { authOptions } from "@/lib/config/authOptions";
import { ArtworkModel } from "@/lib/data/models";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types";
import { UpdateArtworkResult } from "@/lib/api/admin/update/fetchers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<ApiResponse<UpdateArtworkResult>> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        error: "Unauthorized",
      } satisfies ApiErrorResponse,
      { status: 401 }
    );
  }
  try {
    const { id } = params;

    const updateData = await request.json();

    const updatedArtwork = await ArtworkModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!updatedArtwork) {
      return NextResponse.json(
        {
          success: false,
          message: "Artwork not found",
          error: "Artwork not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedArtwork,
    } satisfies UpdateArtworkResult);
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update artwork",
        error: "Failed to update artwork",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
