import { NextRequest, NextResponse } from "next/server";
import { ApiArtworkListResult } from "@/lib/api/public/artwork/fetchers";
import type { ApiErrorResponse, RouteResponse } from "@/lib/data/types/apiTypes";
import {
  parseArtworkListQuery,
  searchParamsToArtworkListQueryInput,
  type ArtworkListQueryFieldErrors,
} from "@/lib/data/schemas/artworkListQuerySchema";
import { getArtworkList } from "@/lib/data/services/getArtworkList";
import { isNextError } from "@/lib/helpers/isNextError";
import { getUserIdFromSession } from "@/lib/session/getUserIdFromSession";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

type ArtworkListValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: ArtworkListQueryFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: ArtworkListQueryFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<ArtworkListValidationErrorResponse>(
    {
      success: false,
      error: "Invalid artwork query",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ApiArtworkListResult>> {
  const requestContext = createRequestContext(request, "/api/v2/public/artwork");
  const logger = createApiLogger(requestContext);
  const parsedQuery = parseArtworkListQuery(
    searchParamsToArtworkListQueryInput(request.nextUrl.searchParams)
  );

  if (!parsedQuery.success) {
    const { fieldErrors, formErrors } = parsedQuery.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    const userId = await getUserIdFromSession();
    const result = await getArtworkList({
      ...parsedQuery.data,
      userId,
    });

    return NextResponse.json(result satisfies ApiArtworkListResult);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.public.artwork_list.failed", {
      error,
      errorLabel: "artwork_list_read_failed",
    });
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        requestId: requestContext.requestId,
      } satisfies ApiErrorResponse,
      {
        status: 500,
        headers: requestContext.responseHeaders,
      }
    );
  }
}
