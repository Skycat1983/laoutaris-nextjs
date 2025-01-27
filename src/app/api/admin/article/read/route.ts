import { NextRequest, NextResponse } from "next/server";
import { ArticleModel } from "@/lib/server/models";

export async function GET(request: NextRequest) {
  try {
    const articles = await ArticleModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Failed to fetch article feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch article feed" },
      { status: 500 }
    );
  }
}
