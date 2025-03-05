import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types";
import { UpdateCollectionResult } from "@/lib/api/admin/update/fetchers";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<ApiResponse<UpdateCollectionResult>> {
  try {
    const { artworksToAdd, artworksToRemove, ...updateData } =
      await request.json();

    // First update the basic collection data
    const collection = await CollectionModel.findById(params.id);
    if (!collection) {
      return NextResponse.json(
        {
          success: false,
          message: "Collection not found",
          error: "Collection not found",
        } satisfies ApiErrorResponse,
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

    return NextResponse.json({
      success: true,
      data: collection,
    } satisfies UpdateCollectionResult);
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update collection",
        error: "Failed to update collection",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
