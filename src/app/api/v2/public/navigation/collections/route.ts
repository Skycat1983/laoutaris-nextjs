import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { ApiCollectionNavListResult } from "@/lib/api/public/navigation/fetchers";
import { RouteResponse } from "@/lib/data/types";
import { getCollectionNavigationList } from "@/lib/data/services/getCollectionNavigationList";
import { NextRequest } from "next/server";
import { isNextError } from "@/lib/helpers/isNextError";

export const dynamic = "force-dynamic";

export const GET = async (
  _request: NextRequest
): Promise<RouteResponse<ApiCollectionNavListResult>> => {
  try {
    const result = await getCollectionNavigationList();

    if (!result) {
      return apiErrorResponse({
        message: "No collections found",
        status: 404,
      });
    }

    return apiListResponse(result.data, result.metadata);
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
