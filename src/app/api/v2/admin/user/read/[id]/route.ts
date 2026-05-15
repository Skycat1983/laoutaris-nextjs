import { NextRequest } from "next/server";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import { UserModel } from "@/lib/data/models";
import { RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadUserResult } from "@/lib/api/admin/read/fetchers";
import type { UserLean, UserFrontend } from "@/lib/data/types";
import { transformUser } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadUserResult>> {
  const admin = await requireApiAdmin();
  if (!admin.ok) {
    return admin.response;
  }

  const { id } = params;
  if (!isValidObjectIdParam(id)) {
    return adminReadInvalidIdResponse("user", "Invalid user ID");
  }

  try {
    await dbConnect();

    const leanUser = await UserModel.findById(id).lean<UserLean>();

    if (!leanUser) {
      return apiErrorResponse({
        message: "User not found",
        status: 404,
      });
    }

    const user: UserFrontend = transformUser.toFrontend(leanUser);

    return apiSuccessResponse(user);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    console.error("Error reading user:", error);
    return apiErrorResponse({
      message: "Failed to read user",
      status: 500,
    });
  }
}
