import { ApiCollectionNavListResult } from "@/lib/api/public/navigation/fetchers";
import { CollectionModel } from "@/lib/data/models";
import {
  RouteResponse,
  ApiErrorResponse,
  CollectionSelectFieldsLean,
} from "@/lib/data/types";
import { transformCollectionNav } from "@/lib/transforms/transformNavData";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiCollectionNavListResult>> => {
  try {
    const collectionsLean = await CollectionModel.find({
      section: "collections",
    })
      .select("title slug artworks")
      .sort({ updatedAt: 1 })
      .lean<CollectionSelectFieldsLean[]>();

    if (!collectionsLean.length) {
      return NextResponse.json({
        success: false,
        error: "No collections found",
        statusCode: 404,
      } satisfies ApiErrorResponse);
    }

    const collectionNavData = collectionsLean.map((collection) => {
      return transformCollectionNav.toFrontend(collection);
    });

    return NextResponse.json({
      success: true,
      data: collectionNavData,
      metadata: {
        total: collectionNavData.length,
        page: 1,
        limit: collectionNavData.length,
        totalPages: 1,
      },
    } satisfies ApiCollectionNavListResult);
  } catch (error) {
    console.error("Error fetching collection navigation:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch collection navigation",
      statusCode: 500,
    } satisfies ApiErrorResponse);
  }
};
