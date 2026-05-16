import { NextRequest } from "next/server";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { ApiCollectionListResult } from "@/lib/api/public/collection/fetchers";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import { RouteResponse } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiCollectionListResult>> => {
  try {
    const { searchParams } = req.nextUrl;
    const section = searchParams.get("section");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getCollectionList({
      section,
      page,
      limit,
    });

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

    console.error("Collection fetch error:", error);
    return apiErrorResponse({
      message: "Failed to fetch collections",
      status: 500,
    });
  }
};
