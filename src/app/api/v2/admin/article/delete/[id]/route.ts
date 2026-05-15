import { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import { ArticleModel } from "@/lib/data/models";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { NextRequest, NextResponse } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
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
    return adminDeleteInvalidIdResponse("article", "Invalid article ID");
  }

  console.log("Deleting article with ID:", id);

  try {
    await dbConnect();

    const deletedArticle = await ArticleModel.findByIdAndDelete(id);

    console.log("Deleted article:", deletedArticle);

    if (!deletedArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
          error: "Article not found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "Article deleted successfully",
    } satisfies DeleteDocumentResult);
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete article",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
