import { ArticleModel } from "@/lib/data/models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const article = await ArticleModel.findById(id).populate([
      "artwork",
      "author",
    ]);

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Error reading article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read article" },
      { status: 500 }
    );
  }
}
