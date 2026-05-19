import type { NextRequest } from "next/server";
import { requireApiAdmin } from "@/lib/api/requireApiAdmin";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import {
  adminReadInvalidIdResponse,
  isValidObjectIdParam,
} from "@/lib/api/admin/read/routeValidation";
import { UserModel } from "@/lib/data/models";
import type { RouteResponse } from "@/lib/data/types/apiTypes";
import type { ReadUserResult } from "@/lib/api/admin/read/fetchers";
import type { UserLean, UserFrontend } from "@/lib/data/types";
import { transformUser } from "@/lib/transforms";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<RouteResponse<ReadUserResult>> {
  const requestContext = createRequestContext(
    request,
    "/api/v2/admin/user/read/[id]"
  );
  const logger = createApiLogger(requestContext);

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

    logger.error("api.admin.user_read.failed", {
      operation: "admin.user.read.detail",
      error,
      errorLabel: "admin_user_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to read user",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
}
