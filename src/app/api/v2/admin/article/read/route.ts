import { ArticleModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

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
      .populate("author");

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
