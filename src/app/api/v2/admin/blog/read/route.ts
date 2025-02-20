import { BlogModel, CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";

// TODO: why are timestamps not being created? therefore we sort by displaydate instead
export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split("/");
    const id = segments[segments.length - 1];

    // If no ID, return paginated list
    if (id === "read") {
      const limit = parseInt(searchParams.get("limit") || "10");
      const page = parseInt(searchParams.get("page") || "1");
      const skip = (page - 1) * limit;
      const total = await BlogModel.countDocuments();

      const blogs = await BlogModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      // .populate([ "author"]);

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
    }

    // If ID provided, return single item
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("[ARTICLE_READ]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article(s)" },
      { status: 500 }
    );
  }
}
