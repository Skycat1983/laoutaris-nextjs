import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/api/shopify/shopifyClient";

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

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Convert numeric ID to Shopify GID format
    const gid = `gid://shopify/Product/${decodeURIComponent(productId)}`;
    console.log(`Fetching product with numeric ID: ${productId}, GID: ${gid}`);

    const product = await getProductById(gid);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(
      "Error in GET /api/v2/public/shop/products/[productId]: ",
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
