import { BlogModel } from "@/lib/server/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await BlogModel.countDocuments();

    // Get paginated blogs
    const blogs = await BlogModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    //   .populate(["author"]);

    return NextResponse.json({
      success: true,
      data: blogs,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[BLOG_LIST]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}
