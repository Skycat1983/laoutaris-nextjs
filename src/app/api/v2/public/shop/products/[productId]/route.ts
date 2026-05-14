import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/api/shopify/shopifyClient";
import { ApiErrorResponse, SingleResult } from "@/lib/data/types/apiTypes";
import { SimpleProduct } from "@/lib/data/types/shopify";

const SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN = /^\d+$/;

const errorResponse = (error: string, status: number) =>
  NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
    },
    { status }
  );

const decodeProductId = (productId: string) => {
  try {
    return decodeURIComponent(productId);
  } catch {
    return null;
  }
};

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
    const decodedProductId = productId ? decodeProductId(productId) : null;

    if (
      !decodedProductId ||
      !SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN.test(decodedProductId)
    ) {
      return errorResponse(
        "Product ID must be a numeric Shopify product ID",
        400
      );
    }

    const gid = `gid://shopify/Product/${decodedProductId}`;
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
