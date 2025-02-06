import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/server/models";
import type { FrontendCollection } from "@/lib/types/collectionTypes";

type CollectionApiResponse = ApiResponse<FrontendCollection[]>;

export const GET = async (
  req: NextRequest
): Promise<NextResponse<CollectionApiResponse>> => {
  try {
    const { searchParams } = new URL(req.url);

    const query: any = {};

    const section = searchParams.get("section");
    if (section) {
      query.section = section;
    }

    // Handle pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const [collections, total] = await Promise.all([
      CollectionModel.find(query)
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
