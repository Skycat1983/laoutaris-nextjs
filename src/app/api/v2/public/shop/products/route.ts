import { ArtworkDB, ArtworkModel } from "@/lib/data/models";
import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/api/shopify/shopifyClient";
import { SimpleProduct } from "@/lib/data/types/shopify";
import { ShopifyProductLink } from "@/lib/data/types/shopifyTypes";
import dbConnect from "@/lib/db/mongodb";
import { isNextError } from "@/lib/helpers/isNextError";
import { ArtworkLean } from "@/lib/data/types/artworkTypes";
import { FilterQuery } from "mongoose";

/**
 * Shop Products API Route
 * Filters MongoDB artworks, extracts Shopify product IDs, and fetches products
 */
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = request.nextUrl;

    // Extract filter params (same as artwork route)
    const conditions = [];
    for (const key of ["decade", "artstyle", "medium", "surface"]) {
      const values = searchParams.getAll(key);
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

    console.log(
      "Shop products route - MongoDB query in route.ts: ",
      JSON.stringify(query, null, 2)
    );

    // Fetch matching artworks
    const artworks = await ArtworkModel.find(query)
      .select("shopifyProducts") // Only need shopifyProducts field
      .lean();

    console.log(
      "Shop products route - Found artworks with products in route.ts: ",
      artworks.length
    );

    // Extract all Shopify product links
    const allProductLinks: ShopifyProductLink[] = [];
    artworks.forEach((artwork) => {
      if (artwork.shopifyProducts) {
        allProductLinks.push(...artwork.shopifyProducts);
      }
    });

    console.log(
      "Shop products route - Total product links (with duplicates) in route.ts: ",
      allProductLinks.length
    );

    // Get product type filters from checkboxes
    const showOriginals = searchParams.get("showOriginals") !== "false";
    const showPrints = searchParams.get("showPrints") !== "false";
    const showBooks = searchParams.get("showBooks") !== "false";

    console.log("Shop products route - Product type filters in route.ts: ", {
      showOriginals,
      showPrints,
      showBooks,
    });

    // Filter by product type
    const filteredLinks = allProductLinks.filter((link) => {
      if (link.type === "original" && !showOriginals) return false;
      if (link.type === "print" && !showPrints) return false;
      if (link.type === "book" && !showBooks) return false;
      return true;
    });

    console.log(
      "Shop products route - Filtered links in route.ts: ",
      filteredLinks.length
    );

    // Deduplicate by productId
    const uniqueProductIds = Array.from(
      new Set(filteredLinks.map((link) => link.productId))
    );

    console.log(
      "Shop products route - Unique product IDs in route.ts: ",
      uniqueProductIds.length
    );

    // Batch fetch from Shopify
    const productPromises = uniqueProductIds.map((productId) => {
      // Convert numeric ID to GID format
      const gid = `gid://shopify/Product/${productId}`;
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

    console.log(
      "Shop products route - Successfully fetched products in route.ts: ",
      products.length
    );

    return NextResponse.json({
      success: true,
      data: products,
      metadata: {
        totalArtworks: artworks.length,
        totalProducts: products.length,
      },
    });
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }
    console.error("Error in shop products route in route.ts: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch shop products",
      },
      { status: 500 }
    );
  }
}
