import { ArtworkModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Artwork ID is required" },
        { status: 400 }
      );
    }

    const artwork = await ArtworkModel.findById(_id);

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
