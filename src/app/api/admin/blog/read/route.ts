import { BlogModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const blogs = await BlogModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .exec();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
