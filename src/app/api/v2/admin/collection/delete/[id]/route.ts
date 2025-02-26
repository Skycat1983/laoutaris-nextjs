import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/data/models";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  console.log("Deleting collection with ID:", id);

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Collection ID is required" },
        { status: 400 }
      );
    }

    const deletedCollection = await CollectionModel.findByIdAndDelete(id);

    console.log("Deleted collection:", deletedCollection);

    if (!deletedCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}
