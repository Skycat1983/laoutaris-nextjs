import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { ApiCollectionNavListResult } from "@/lib/api/public/navigation/fetchers";
import { CollectionModel } from "@/lib/data/models";
import { RouteResponse, CollectionSelectFieldsLean } from "@/lib/data/types";
import { transformCollectionNav } from "@/lib/transforms/navigation/transformNavData";
import dbConnect from "@/lib/db/mongodb";
import { NextRequest } from "next/server";
import { isNextError } from "@/lib/helpers/isNextError";

export const dynamic = "force-dynamic";

export const GET = async (
  _request: NextRequest
): Promise<RouteResponse<ApiCollectionNavListResult>> => {
  try {
    await dbConnect();

    const collectionsLean = await CollectionModel.find({
      section: "collections",
    })
      .select("title slug artworks")
      .sort({ updatedAt: 1 })
      .lean<CollectionSelectFieldsLean[]>()
      .maxTimeMS(30000); // Add maximum execution time

    if (!collectionsLean.length) {
      return apiErrorResponse({
        message: "No collections found",
        status: 404,
      });
    }

    const collectionNavData = collectionsLean.map((collection) => {
      return transformCollectionNav.toFrontend(collection);
    });

    return apiListResponse(collectionNavData, {
      total: collectionNavData.length,
      page: 1,
      limit: collectionNavData.length,
      totalPages: 1,
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error fetching collection navigation:", error);
    return apiErrorResponse({
      message: "Failed to fetch collection navigation",
      status: 500,
    });
  }
};
