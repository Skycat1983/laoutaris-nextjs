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

    // Get query parameters for pagination/filtering if needed
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;

    const articles = await ArticleModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate(["artwork", "author"]);

    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("Error listing articles:", error);
    return NextResponse.json(
      { success: false, message: "Failed to list articles" },
      { status: 500 }
    );
  }
}
