import { ApiOwnUserNavResult } from "@/lib/api/user/navigation/fetchers";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { getOwnUserNavigation } from "@/lib/data/services/getOwnUserNavigation";
import { RouteResponse } from "@/lib/data/types";
import { isNextError } from "@/lib/helpers/isNextError";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiOwnUserNavResult>> {
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  try {
    const userNavData = await getOwnUserNavigation(userGuard.userId);

    if (!userNavData) {
      return apiErrorResponse({
        message: "User not found",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiOwnUserNavResult["data"]>(userNavData);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    return apiErrorResponse({
      message: "Failed to fetch user navigation",
      status: 500,
    });
  }
}
