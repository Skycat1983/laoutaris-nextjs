import { ArticleModel, CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";

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
      const total = await CollectionModel.countDocuments();

      const articles = await ArticleModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(["artwork", "author"]);

      return NextResponse.json({
        success: true,
        data: articles,
        metadata: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // If ID provided, return single item
    const collection = await CollectionModel.findById(id).populate([
      "artworks",
    ]);

    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error("[ARTICLE_READ]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article(s)" },
      { status: 500 }
    );
  }
}
