import { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types/apiTypes";
import { ArticleModel } from "@/lib/data/models";
import { isAdmin } from "@/lib/session/isAdmin";
import { NextRequest, NextResponse } from "next/server";

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

  console.log("Deleting article with ID:", id);

  try {
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Article ID is required",
          error: "Article ID is required",
        } satisfies ApiErrorResponse,
        { status: 400 }
      );
    }

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
