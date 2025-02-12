import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/server/models";
import type { FrontendCollection } from "@/lib/types/collectionTypes";

type CollectionApiResponse = ApiResponse<FrontendCollection[]>;

export const GET = async (
  req: NextRequest
): Promise<NextResponse<CollectionApiResponse>> => {
  try {
    const { searchParams } = new URL(req.url);

    // Build query object
    const query: any = {};
    if (searchParams.get("section")) {
      query.section = searchParams.get("section");
    }

    // Handle field selection
    const fields = searchParams.get("fields")?.split(",").join(" ") || "";

    // Handle pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const [collections, total] = await Promise.all([
      CollectionModel.find(query)
        .select(fields)
        .skip((page - 1) * limit)
        .limit(limit),
      CollectionModel.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: collections,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies PaginatedResponse<FrontendCollection[]>);
  } catch (error) {
    console.error("Collection fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collections",
        statusCode: 500,
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
};
