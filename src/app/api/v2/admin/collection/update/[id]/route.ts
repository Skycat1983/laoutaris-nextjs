import { CollectionModel } from "@/lib/data/models";
import { NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { UpdateCollectionResult } from "@/lib/api/admin/update/fetchers";
import { isAdmin } from "@/lib/session/isAdmin";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<RouteResponse<UpdateCollectionResult>> {
  const { id } = params;

  const hasPermission = await isAdmin();
  if (!hasPermission) {
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
    const { artworksToAdd, artworksToRemove, ...updateData } =
      await request.json();

    // First update the basic collection data
    const collection = await CollectionModel.findById(id);
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
