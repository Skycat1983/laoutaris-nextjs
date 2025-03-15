import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/data/models";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import {
  CollectionLeanPopulated,
  CollectionFrontendPopulated,
} from "@/lib/data/types";
import { transformCollectionPopulated } from "@/lib/transforms";

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionPopulatedResult>> => {
  try {
    const rawCollection: CollectionLeanPopulated =
      (await CollectionModel.findOne({
        slug: params.slug,
      })
        .populate<CollectionLeanPopulated>("artworks")
        .lean()) as CollectionLeanPopulated;

    if (!rawCollection) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
          statusCode: 404,
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const frontendCollection: CollectionFrontendPopulated =
      transformCollectionPopulated(rawCollection);
    return NextResponse.json({
      success: true,
      data: frontendCollection,
    } satisfies ApiCollectionPopulatedResult);
  } catch (error) {
    console.error("Collection fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collection with artworks",
        statusCode: 500,
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
};
