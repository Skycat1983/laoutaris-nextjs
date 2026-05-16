import { NextRequest } from "next/server";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { getCollectionWithArtworks } from "@/lib/data/services/getCollectionWithArtworks";
import { isNextError } from "@/lib/helpers/isNextError";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionPopulatedResult>> => {
  try {
    const collection = await getCollectionWithArtworks(params.slug);

    if (!collection) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiCollectionPopulatedResult["data"]>(
      collection
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Collection fetch error:", error);
    return apiErrorResponse({
      message: "Failed to fetch collection with artworks",
      status: 500,
    });
  }
};
