import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/data/models";
import { ApiCollectionListResult } from "@/lib/api/public/collection/fetchers";
import {
  ApiErrorResponse,
  CollectionLean,
  RouteResponse,
} from "@/lib/data/types";
import { transformCollection } from "@/lib/transforms/transformCollection";
export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiCollectionListResult>> => {
  // const { searchParams } = new URL(req.url);
  const { searchParams } = req.nextUrl;
  // Build query object
  const query: any = {};
  if (searchParams.get("section")) {
    query.section = searchParams.get("section");
  }

  // Handle field selection
  // Handle pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const [leanCollections, total] = await Promise.all([
      CollectionModel.find(query)
        // .select(fields)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<CollectionLean[]>(),
      CollectionModel.countDocuments(query),
    ]);

    if (!leanCollections) {
      return NextResponse.json(
        {
          success: false,
          error: "No collections found",
        } satisfies ApiErrorResponse,
        { status: 404 }
      );
    }

    const collections = leanCollections.map((collection) =>
      transformCollection.toFrontend(collection)
    );

    return NextResponse.json({
      success: true,
      data: collections,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    } satisfies ApiCollectionListResult);
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
