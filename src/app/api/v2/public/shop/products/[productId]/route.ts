import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/api/shopify/shopifyClient";
import {
  normalizeShopifyProductIdParam,
  shopifyProductIdToGid,
} from "@/lib/api/shopify/productIds";
import { ApiErrorResponse, SingleResult } from "@/lib/data/types/apiTypes";
import { SimpleProduct } from "@/lib/data/types/shopify";

const errorResponse = (error: string, status: number) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
    },
    { status }
  );

/**
 * Fetch a single Shopify product by numeric ID
 * Converts numeric ID to GID format before fetching
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
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
    console.error(
      "Error in GET /api/v2/public/shop/products/[productId]: ",
      error
    );
    return errorResponse("Failed to fetch product", 502);
  }
}
