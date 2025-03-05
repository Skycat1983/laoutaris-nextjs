import { NextRequest, NextResponse } from "next/server";
import { ArticleModel } from "@/lib/data/models";
import { isAdmin } from "@/lib/session/isAdmin";
import { ApiErrorResponse, ApiResponse } from "@/lib/data/types/apiTypes";
import { DeleteDocumentResult } from "@/lib/api/admin/delete/fetchers";

export async function DELETE(
  request: NextRequest
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
  const { id } = await request.json();

  try {
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Article ID is required",
        } satisfies ApiErrorResponse,
        { status: 400 }
      );
    }

    const deletedArticle = await ArticleModel.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json(
        {
          success: false,
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
