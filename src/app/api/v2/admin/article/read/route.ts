import { ArticleModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Article ID is required" },
        { status: 400 }
      );
    }

    const article = await ArticleModel.findById(_id)
      .populate("artwork")
      .populate("author")
      .lean()
      .exec();

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    const transformedArticle = transformMongooseDoc(article);
    console.log("API Response Structure:", {
      success: true,
      data: transformedArticle,
    });

    return NextResponse.json({
      success: true,
      data: transformedArticle,
    });
  } catch (error) {
    console.error("Error reading article:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read article" },
      { status: 500 }
    );
  }
}
