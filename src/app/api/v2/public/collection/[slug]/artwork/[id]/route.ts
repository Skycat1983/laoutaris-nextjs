import { NextRequest } from "next/server";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import { ApiCollectionPopulatedResult } from "@/lib/api/public/collection/fetchers";
import { getCollectionArtwork } from "@/lib/data/services/getCollectionArtwork";
import { isNextError } from "@/lib/helpers/isNextError";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string; id: string } }
): Promise<RouteResponse<ApiCollectionPopulatedResult>> {
  try {
    const { slug, id } = params;
    const result = await getCollectionArtwork(slug, id);

    if (result.status === "collection-not-found") {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    if (result.status === "artwork-not-found") {
      return apiErrorResponse({
        message: "Artwork not found in this collection",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiCollectionPopulatedResult["data"]>(
      result.collection
    );
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error fetching collection artwork:", error);
    return apiErrorResponse({
      message: "Failed to fetch collection artwork",
      status: 500,
    });
  }
}
