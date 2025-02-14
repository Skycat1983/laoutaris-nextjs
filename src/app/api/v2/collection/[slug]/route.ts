import { CollectionModel } from "@/lib/data/models";
import { FrontendCollection } from "@/lib/data/types/collectionTypes";
import { NextRequest, NextResponse } from "next/server";

type SingleCollectionResponse = ApiResponse<FrontendCollection>;

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<SingleCollectionResponse>> => {
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
    } satisfies ApiSuccessResponse<FrontendCollection>);
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
