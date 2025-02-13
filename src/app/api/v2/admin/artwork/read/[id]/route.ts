import { ArtworkModel } from "@/lib/server/models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const artwork = await ArtworkModel.findById(id);

    if (!artwork) {
      return NextResponse.json(
        { success: false, message: "Artwork not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: artwork,
    });
  } catch (error) {
    console.error("Error reading artwork:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read artwork" },
      { status: 500 }
    );
  }
}
