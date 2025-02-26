import { ArticleModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  console.log("Deleting article with ID:", id);

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const deletedArticle = await ArticleModel.findByIdAndDelete(id);

    console.log("Deleted article:", deletedArticle);

    if (!deletedArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
