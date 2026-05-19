import { NextRequest, NextResponse } from "next/server";
import { ApiSearchResult } from "@/lib/api/public/search/fetchers";
import type { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import {
  parsePublicSearchQuery,
  searchParamsToSearchQueryInput,
  type PublicSearchQueryFieldErrors,
} from "@/lib/data/schemas/searchSchema";
import { getPublicSearchResults } from "@/lib/data/services/getPublicSearchResults";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

type SearchValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: PublicSearchQueryFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: PublicSearchQueryFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<SearchValidationErrorResponse>(
    {
      success: false,
      error: "Invalid search query",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

export async function GET(
  request: NextRequest
): Promise<RouteResponse<ApiSearchResult>> {
  const requestContext = createRequestContext(request, "/api/v2/public/search");
  const logger = createApiLogger(requestContext);
  const parsedQuery = parsePublicSearchQuery(
    searchParamsToSearchQueryInput(request.nextUrl.searchParams)
  );

  if (!parsedQuery.success) {
    const { fieldErrors, formErrors } = parsedQuery.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    const result = await getPublicSearchResults(parsedQuery.data);
    return NextResponse.json(result satisfies ApiSearchResult);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("api.public.search.failed", {
      error,
      errorLabel: "public_search_failed",
    });
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error: "Failed to perform search",
        requestId: requestContext.requestId,
      },
      {
        status: 500,
        headers: requestContext.responseHeaders,
      }
    );
  }
}
