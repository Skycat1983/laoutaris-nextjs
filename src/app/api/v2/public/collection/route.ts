import { NextRequest, NextResponse } from "next/server";
import { CollectionModel } from "@/lib/data/models";
import { ApiCollectionListResult } from "@/lib/api/public/collection/fetchers";
import {
  ApiErrorResponse,
  CollectionLean,
  RouteResponse,
} from "@/lib/data/types";
import { transformCollection } from "@/lib/transforms/collection/transformCollection";
import dbConnect from "@/lib/db/mongodb";
export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiCollectionListResult>> => {
  await dbConnect();
  console.error("Collection fetch request received");
  // const { searchParams } = new URL(req.url);
  const { searchParams } = req.nextUrl;
  // Build query object
  const query: any = {};
  if (searchParams.get("section")) {
    query.section = searchParams.get("section");
  }

  console.error("query", query);

  // Handle field selection
  // Handle pagination
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  console.error("page", page);
  console.error("limit", limit);

  try {
    console.error("About to query MongoDB");

    // Split the Promise.all to identify where it's failing
    console.error("Starting find query");
    const findPromise = CollectionModel.find(query)
      // .select(fields)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<CollectionLean[]>();

    console.error("Starting count query");
    const countPromise = CollectionModel.countDocuments(query);

    console.error("Awaiting both promises");
    const [leanCollections, total] = await Promise.all([
      findPromise,
      countPromise,
    ]);

    console.error("Queries completed", {
      hasCollections: !!leanCollections,
      total,
    });

    console.log("leanCollections", leanCollections);

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

    console.log("collections", collections);

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
