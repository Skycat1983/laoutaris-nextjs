import { NextRequest, NextResponse } from "next/server";
import { isNextError } from "@/lib/helpers/isNextError";
import type { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import {
  parseShopProductListQuery,
  searchParamsToShopProductListQueryInput,
  type ShopProductListQueryFieldErrors,
} from "@/lib/data/schemas/shopProductListQuerySchema";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

type ShopProductsValidationErrorResponse = ApiErrorResponse & {
  fieldErrors: ShopProductListQueryFieldErrors;
  formErrors: string[];
};

const validationErrorResponse = (
  fieldErrors: ShopProductListQueryFieldErrors,
  formErrors: string[] = []
) =>
  NextResponse.json<ShopProductsValidationErrorResponse>(
    {
      success: false,
      error: "Invalid shop products query",
      fieldErrors,
      formErrors,
    },
    { status: 400 }
  );

/**
 * Shop Products API Route
 * Validates request query params and adapts shared shop product listing data.
 */
export async function GET(request: NextRequest) {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/shop/products"
  );
  const logger = createApiLogger(requestContext);
  const parsedQuery = parseShopProductListQuery(
    searchParamsToShopProductListQueryInput(request.nextUrl.searchParams)
  );

  if (!parsedQuery.success) {
    const { fieldErrors, formErrors } = parsedQuery.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    const result = await getShopProductList(parsedQuery.data);

    return NextResponse.json(result);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    logger.error("api.public.shop_products.failed", {
      error,
      errorLabel: "shop_products_read_failed",
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shop products",
        requestId: requestContext.requestId,
      } satisfies ApiErrorResponse,
      {
        status: 500,
        headers: requestContext.responseHeaders,
      }
    );
  }
}
