import { authOptions } from "@/lib/config/authOptions";
import { ArtworkModel } from "@/lib/data/models";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Get update data from request body
    const updateData = await request.json();

    // Update the article
    const updatedArtwork = await ArtworkModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!updatedArtwork) {
      return NextResponse.json(
        { success: false, message: "Artwork not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedArtwork,
    });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update artwork" },
      { status: 500 }
    );
  }
}
