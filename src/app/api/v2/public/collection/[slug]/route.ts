import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { CollectionModel } from "@/lib/data/models";
import { NextRequest } from "next/server";
import { ApiCollectionResult } from "@/lib/api/public/collection/fetchers";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionResult>> => {
  try {
    await dbConnect();

    const collection = await CollectionModel.findOne({
      slug: params.slug,
    });

    if (!collection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiCollectionResult["data"]>(
      collection as ApiCollectionResult["data"]
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Collection fetch error:", error);
    return apiErrorResponse({
      message: "Failed to fetch collection",
      status: 500,
    });
  }
};
