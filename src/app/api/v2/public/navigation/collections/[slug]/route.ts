import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { NextRequest } from "next/server";
import { RouteResponse } from "@/lib/data/types";
import { ApiCollectionNavItemResult } from "@/lib/api/public/navigation/fetchers";
import { isNextError } from "@/lib/helpers/isNextError";
import { getCollectionNavigationItem } from "@/lib/data/services/getCollectionNavigationItem";

export const GET = async (
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<RouteResponse<ApiCollectionNavItemResult>> => {
  const { slug } = params;

  try {
    const collectionNavData = await getCollectionNavigationItem(slug);

    if (!collectionNavData) {
      return apiErrorResponse({
        message: "Collection not found",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiCollectionNavItemResult["data"]>(
      collectionNavData
    );
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
