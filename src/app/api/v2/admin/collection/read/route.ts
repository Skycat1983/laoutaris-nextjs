import { ArticleModel, CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { transformMongooseDoc } from "@/lib/transforms/mongooseTransforms";
import { FrontendCollection } from "@/lib/data/types/collectionTypes";

// TODO: remove the 'return one item' logic

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

      const collections = await CollectionModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return NextResponse.json({
        success: true,
        data: collections,
        metadata: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }) satisfies NextResponse<ApiSuccessResponse<FrontendCollection[]>>;
    }

    // If ID provided, return single item
    const collection = await CollectionModel.findById(id).populate([
      "artworks",
    ]);

    if (!collection) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      ) satisfies NextResponse<ApiErrorResponse>;
    }

    return NextResponse.json({
      success: true,
      data: collection,
    }) satisfies NextResponse<ApiSuccessResponse<FrontendCollection>>;
  } catch (error) {
    console.error("[ARTICLE_READ]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article(s)" },
      { status: 500 }
    ) satisfies NextResponse<ApiErrorResponse>;
  }
}
