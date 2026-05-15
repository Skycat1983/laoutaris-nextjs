import { NextRequest } from "next/server";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { CollectionModel } from "@/lib/data/models";
import { ApiCollectionListResult } from "@/lib/api/public/collection/fetchers";
import { CollectionLean, RouteResponse } from "@/lib/data/types";
import { transformCollection } from "@/lib/transforms/collection/transformCollection";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiCollectionListResult>> => {
  try {
    await dbConnect();

    const { searchParams } = req.nextUrl;
    const query: Record<string, string> = {};
    const section = searchParams.get("section");
    if (section) {
      query.section = section;
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const findPromise = CollectionModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<CollectionLean[]>();

    const countPromise = CollectionModel.countDocuments(query);

    const [leanCollections, total] = await Promise.all([
      findPromise,
      countPromise,
    ]);

    if (!leanCollections) {
      return apiErrorResponse({
        message: "No collections found",
        status: 404,
      });
    }

    const collections = leanCollections.map((collection) =>
      transformCollection.toFrontend(collection)
    );

    return apiListResponse(collections, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Collection fetch error:", error);
    return apiErrorResponse({
      message: "Failed to fetch collections",
      status: 500,
    });
  }
};
