import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/data/models";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import dbConnect from "@/lib/db/mongodb";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/delete/routeValidation";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<DeleteDocumentResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminDeleteInvalidIdResponse("collection", "Invalid collection ID");
  }

  try {
    await dbConnect();

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
