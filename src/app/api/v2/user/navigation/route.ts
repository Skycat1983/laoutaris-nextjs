import { ApiOwnUserNavResult } from "@/lib/api/user/navigation/fetchers";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import { requireApiUser } from "@/lib/api/requireApiUser";
import { UserModel } from "@/lib/data/models";
import { Prettify, RouteResponse } from "@/lib/data/types";
import { OwnUserSelectFieldsLean } from "@/lib/data/types/navigationTypes";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";
import { transformAccountNav } from "@/lib/transforms/navigation/transformNavData";
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
    await dbConnect();

    const leanUserData = await UserModel.findById(userGuard.userId)
      .select("favourites watchlist comments")
      .lean<OwnUserSelectFieldsLean>();

    if (!leanUserData) {
      return apiErrorResponse({
        message: "User not found",
        status: 404,
      });
    }

    const userNavData: Prettify<
      ReturnType<typeof transformAccountNav.toFrontend>
    > = transformAccountNav.toFrontend(leanUserData);

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
