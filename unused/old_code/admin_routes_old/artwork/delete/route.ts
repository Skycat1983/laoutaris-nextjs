import { NextRequest, NextResponse } from "next/server";
import { ArtworkModel } from "@/lib/data/models";

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Artwork ID is required" },
        { status: 400 }
      );
    }

    const deletedArtwork = await ArtworkModel.findByIdAndDelete(id);

    if (!deletedArtwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return NextResponse.json(
      { error: "Failed to delete artwork" },
      { status: 500 }
    );
  }
}
