import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/data/models";
import { isAdmin } from "@/lib/session/isAdmin";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { ApiResponse } from "@/lib/data/types/apiTypes";
import { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<ApiResponse<DeleteDocumentResult>> {
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
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection ID is required",
        } satisfies ApiErrorResponse,
        { status: 400 }
      );
    }

    const deletedCollection = await CollectionModel.findByIdAndDelete(id);

    console.log("Deleted collection:", deletedCollection);

    if (!deletedCollection) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Collection deleted successfully",
      data: null,
    } satisfies DeleteDocumentResult);
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete collection",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
