import { CollectionModel } from "@/lib/data/models";
import { ApiSuccessResponse } from "@/lib/data/types/apiTypes";
import { NextRequest, NextResponse } from "next/server";
import { ApiCollectionResult } from "@/lib/api/public/collection/fetchers";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionResult>> => {
  try {
    const collection = await CollectionModel.findOne({
      slug: params.slug,
    });

    if (!collection) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
          statusCode: 404,
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: collection,
    } satisfies ApiSuccessResponse<ApiCollectionResult>);
  } catch (error) {
    console.error("Collection fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collection",
        statusCode: 500,
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
};
