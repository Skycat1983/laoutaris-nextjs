import { ArtworkDB, ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/api/shopify/shopifyClient";
import {
  normalizeShopifyProductId,
  shopifyProductIdToGid,
} from "@/lib/api/shopify/productIds";
import { SimpleProduct } from "@/lib/data/types/shopify";
import { ShopifyProductLink } from "@/lib/data/types/shopifyTypes";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";
import { ApiErrorResponse } from "@/lib/data/types/apiTypes";
import {
  parseShopProductListQuery,
  searchParamsToShopProductListQueryInput,
  type ShopProductListQueryFieldErrors,
} from "@/lib/data/schemas/shopProductListQuerySchema";
import type { FilterQuery } from "mongoose";

type ShopProductsListResult = {
  success: true;
  data: SimpleProduct[];
  metadata: {
    totalArtworks: number;
    totalProducts: number;
  };
};

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
 * Filters MongoDB artworks, extracts Shopify product IDs, and fetches products
 */
export async function GET(request: NextRequest) {
  const parsedQuery = parseShopProductListQuery(
    searchParamsToShopProductListQueryInput(request.nextUrl.searchParams)
  );

  if (!parsedQuery.success) {
    const { fieldErrors, formErrors } = parsedQuery.error.flatten();
    return validationErrorResponse(fieldErrors, formErrors);
  }

  try {
    await dbConnect();

    // Extract filter params (same as artwork route)
    const conditions: FilterQuery<ArtworkDB>[] = [];
    for (const key of ["decade", "artstyle", "medium", "surface"] as const) {
      const values = parsedQuery.data[key];
      if (values.length) {
        conditions.push({ [key]: { $in: values } });
      }
    }

    // Build MongoDB query - only artworks with Shopify products
    const baseConditions: FilterQuery<ArtworkDB>[] = [
      { shopifyProducts: { $exists: true, $ne: [] } }, // Must have products
    ];

    if (conditions.length > 0) {
      baseConditions.push(...conditions);
    }

    const query = { $and: baseConditions };

    // Fetch matching artworks
    const artworks = await ArtworkModel.find(query)
      .select("shopifyProducts") // Only need shopifyProducts field
      .lean();

    // Extract all Shopify product links
    const allProductLinks: ShopifyProductLink[] = [];
    artworks.forEach((artwork) => {
      if (artwork.shopifyProducts) {
        allProductLinks.push(...artwork.shopifyProducts);
      }
    });

    // Get product type filters from checkboxes
    const { showOriginals, showPrints, showBooks } = parsedQuery.data;

    // Filter by product type
    const filteredLinks = allProductLinks.filter((link) => {
      if (link.type === "original" && !showOriginals) return false;
      if (link.type === "print" && !showPrints) return false;
      if (link.type === "book" && !showBooks) return false;
      return true;
    });

    // Normalize and deduplicate product IDs before Shopify requests.
    const uniqueProductIds = Array.from(
      new Set(
        filteredLinks
          .map((link) => normalizeShopifyProductId(link.productId))
          .filter((productId): productId is string => productId !== null)
      )
    );

    // Batch fetch from Shopify
    const productPromises = uniqueProductIds.map((productId) => {
      const gid = shopifyProductIdToGid(productId);

      if (!gid) {
        return Promise.resolve(null);
      }

      return getProductById(gid).catch((error) => {
        console.error(
          `Shop products route - Failed to fetch product ${productId} in route.ts: `,
          error
        );
        return null; // Return null for failed fetches
      });
    });

    const productsResults = await Promise.all(productPromises);

    // Filter out null results (failed fetches)
    const products: SimpleProduct[] = productsResults.filter(
      (p): p is SimpleProduct => p !== null
    );

    return NextResponse.json({
      success: true,
      data: products,
      metadata: {
        totalArtworks: artworks.length,
        totalProducts: products.length,
      },
    } satisfies ShopProductsListResult);
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error in shop products route in route.ts: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shop products",
      } satisfies ApiErrorResponse,
      { status: 500 }
    );
  }
}
