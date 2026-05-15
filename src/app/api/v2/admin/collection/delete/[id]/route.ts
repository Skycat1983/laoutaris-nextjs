import { NextRequest } from "next/server";
import { CollectionModel } from "@/lib/data/models";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import type { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import dbConnect from "@/lib/db/mongodb";
import {
  adminDeleteInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/delete/routeValidation";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { isNextError } from "@/lib/helpers/isNextError";

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

    if (!deletedCollection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    return apiSuccessResponse(null, {
      message: "Collection deleted successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error deleting collection:", error);
    return apiErrorResponse({
      message: "Failed to delete collection",
      status: 500,
    });
  }
}
