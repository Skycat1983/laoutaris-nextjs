import { ApiProfileResult } from "@/lib/api/user/profile/fetchers";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { RouteResponse } from "@/lib/data/types";
import { getOwnUserProfile } from "@/lib/data/services/getOwnUserProfile";
import { isNextError } from "@/lib/helpers/isNextError";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest
): Promise<RouteResponse<ApiProfileResult>> {
  const userGuard = await requireApiUser();
  if (!userGuard.ok) {
    return userGuard.response;
  }

  try {
    const user = await getOwnUserProfile(userGuard.userId);

    if (!user) {
      return apiErrorResponse({
        message: "User not found",
        status: 404,
      });
    }

    return apiSuccessResponse<ApiProfileResult["data"]>(user);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error fetching user profile:", error);
    return apiErrorResponse({
      message: "Failed to fetch user profile",
      status: 500,
    });
  }
}
