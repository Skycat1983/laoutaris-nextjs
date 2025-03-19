import { CollectionModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import {
  CollectionLeanPopulated,
  CollectionFrontendPopulated,
} from "@/lib/data/types";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";
import { transformCollectionPopulated } from "@/lib/transforms";

// ! did i break this?

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionPopulatedResult>> => {
  const { slug } = params;

  try {
    const rawCollection: CollectionLeanPopulated =
      (await CollectionModel.findOne({
        slug: params.slug,
      })
        .populate<CollectionLeanPopulated>("artworks")
        .lean()) as CollectionLeanPopulated;

    if (!rawCollection) {
      return NextResponse.json({
        success: false,
        error: "Collection not found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const frontendCollection: CollectionFrontendPopulated =
      transformCollectionPopulated(rawCollection);

    return NextResponse.json({
      success: true,
      data: frontendCollection,
    } satisfies ApiCollectionPopulatedResult);
  } catch (error) {
    console.error("Error fetching collection artworks navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch collection artworks navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};
