import { CollectionModel } from "@/lib/server/models";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { artworksToAdd, artworksToRemove, ...updateData } =
      await request.json();

    // First update the basic collection data
    const collection = await CollectionModel.findById(params.id);
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Collection not found" },
        { status: 404 }
      );
    }

    // Update the artworks array
    if (artworksToAdd?.length > 0) {
      collection.artworks.push(...artworksToAdd);
    }
    if (artworksToRemove?.length > 0) {
      collection.artworks = collection.artworks.filter(
        (id: any) => !artworksToRemove.includes(id.toString())
      );
    }

    // Update other fields
    Object.assign(collection, updateData);
    await collection.save();

    return NextResponse.json({ success: true, data: collection });
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update collection" },
      { status: 500 }
    );
  }
}
