import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { CollectionModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import {
  CollectionLeanPopulated,
  CollectionFrontendPopulated,
} from "@/lib/data/types";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";
import { transformCollectionPopulated } from "@/lib/transforms";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionPopulatedResult>> => {
  try {
    await dbConnect();

    const rawCollection: CollectionLeanPopulated =
      (await CollectionModel.findOne({
        slug: params.slug,
      })
        .populate<CollectionLeanPopulated>("artworks")
        .lean()) as CollectionLeanPopulated;

    if (!rawCollection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    const frontendCollection: CollectionFrontendPopulated =
      transformCollectionPopulated(rawCollection);

    return apiSuccessResponse<ApiCollectionPopulatedResult["data"]>(
      frontendCollection
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error fetching collection artworks navigation:", error);
    return apiErrorResponse({
      message: "Failed to fetch collection artworks navigation",
      status: 500,
    });
  }
};
