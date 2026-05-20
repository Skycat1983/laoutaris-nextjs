import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiErrorResponse, apiListResponse } from "@/lib/api/apiResponse";
import { ApiCollectionListResult } from "@/lib/api/public/collection/fetchers";
import { getCollectionList } from "@/lib/data/services/getCollectionList";
import type { ApiErrorResponse, RouteResponse } from "@/lib/data/types";
import {
  parsePublicCollectionSectionQuery,
  type PublicCollectionSectionQueryFieldErrors,
} from "@/lib/data/schemas/publicTaxonomySectionSchema";
import { isNextError } from "@/lib/helpers/isNextError";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

type CollectionListValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: PublicCollectionSectionQueryFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: PublicCollectionSectionQueryFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<CollectionListValidationErrorResponse>(
    {
      success: false,
      error: "Invalid collection query",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

export const GET = async (
  req: NextRequest
): Promise<RouteResponse<ApiCollectionListResult>> => {
  const requestContext = createRequestContext(req, "/api/v2/public/collection");
  const logger = createApiLogger(requestContext);

  try {
    const { searchParams } = req.nextUrl;
    const parsedSection = parsePublicCollectionSectionQuery({
      section: searchParams.get("section"),
    });

    if (!parsedSection.success) {
      const { fieldErrors, formErrors } = parsedSection.error.flatten();
      return validationErrorResponse(fieldErrors, formErrors);
    }

    const { section } = parsedSection.data;
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

    logger.error("api.public.collection_list.failed", {
      error,
      errorLabel: "collection_list_read_failed",
    });
    return apiErrorResponse({
      message: "Failed to fetch collections",
      status: 500,
      requestId: requestContext.requestId,
    });
  }
};
