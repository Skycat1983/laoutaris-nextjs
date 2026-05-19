import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/api/shopify/shopifyClient";
import {
  normalizeShopifyProductIdParam,
  shopifyProductIdToGid,
} from "@/lib/api/shopify/productIds";
import type { ApiErrorResponse, SingleResult } from "@/lib/data/types/apiTypes";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import { createApiLogger } from "@/lib/observability/logger";
import { createRequestContext } from "@/lib/observability/requestContext";

const errorResponse = (
  error: string,
  status: number,
  requestContext?: ReturnType<typeof createRequestContext>
) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
      ...(requestContext === undefined
        ? {}
        : { requestId: requestContext.requestId }),
    },
    {
      status,
      ...(requestContext === undefined
        ? {}
        : { headers: requestContext.responseHeaders }),
    }
  );

/**
 * Fetch a single Shopify product by numeric ID
 * Converts numeric ID to GID format before fetching
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const requestContext = createRequestContext(
    request,
    "/api/v2/public/shop/products/[productId]"
  );
  const logger = createApiLogger(requestContext);

  try {
    const { productId } = params;
    const normalizedProductId = normalizeShopifyProductIdParam(productId);

    if (!normalizedProductId) {
      return errorResponse(
        "Product ID must be a numeric Shopify product ID",
        400
      );
    }

    const gid = shopifyProductIdToGid(normalizedProductId);

    if (!gid) {
      return errorResponse(
        "Product ID must be a numeric Shopify product ID",
        400
      );
    }

    const product = await getProductById(gid);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return NextResponse.json<SingleResult<SimpleProduct>>({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error("api.public.shop_product_detail.failed", {
      error,
      errorLabel: "shop_product_detail_read_failed",
    });
    return errorResponse("Failed to fetch product", 502, requestContext);
  }
}
