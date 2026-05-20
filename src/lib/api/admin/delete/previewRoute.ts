import type { SingleResult, RouteResponse } from "@/lib/data/types/apiTypes";
import { apiErrorResponse, apiSuccessResponse } from "@/lib/api/apiResponse";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";
import type { AdminDeletePreview } from "./previewTypes";

type AdminDeletePreviewResponseOptions = {
  request: Request;
  route: string;
  id: string;
  adminUserId: string;
  notFoundMessage: string;
  failureMessage: string;
  operation: string;
  errorLabel: string;
  getPreview: (
    id: string,
    adminUserId: string
  ) => Promise<AdminDeletePreview | null>;
};

export const adminDeletePreviewResponse = async ({
  request,
  route,
  id,
  adminUserId,
  notFoundMessage,
  failureMessage,
  operation,
  errorLabel,
  getPreview,
}: AdminDeletePreviewResponseOptions): Promise<
  RouteResponse<SingleResult<AdminDeletePreview>>
> => {
  const requestContext = createRequestContext(request, route);
  const logger = createApiLogger(requestContext);

  try {
    await dbConnect();

    const preview = await getPreview(id, adminUserId);
    if (!preview) {
      return apiErrorResponse({
        message: notFoundMessage,
        status: 404,
      });
    }

    return apiSuccessResponse(preview, {
      message: "Delete preview generated successfully",
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error(`api.${operation}.preview_failed`, {
      operation,
      error,
      errorLabel,
    });

    return apiErrorResponse({
      message: failureMessage,
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};
