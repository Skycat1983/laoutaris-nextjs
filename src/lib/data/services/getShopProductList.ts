import "server-only";

import type { FilterQuery } from "mongoose";
import {
  normalizeShopifyProductId,
  shopifyProductIdToGid,
} from "@/lib/api/shopify/productIds";
import { getProductById } from "@/lib/api/shopify/shopifyClient";
import {
  ArtworkModel,
  ArtworkDB,
} from "@/lib/data/models/artworkModel";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ShopSortOption } from "@/lib/data/types/shopTypes";
import type { ShopifyProductLink } from "@/lib/data/types/shopifyTypes";
import { sortShopProducts } from "@/lib/data/utils/shopProductSorting";
import dbConnect from "@/lib/db/mongodb";
import { createServerLogger } from "@/lib/observability/logger";

const shopProductListLogger = createServerLogger({
  surface: "data_service",
  operation: "shopify.product_list",
});

const SHOP_ARTWORK_FILTER_KEYS = [
  "decade",
  "artstyle",
  "medium",
  "surface",
] as const;

export type GetShopProductListParams = {
  decade?: string[];
  artstyle?: string[];
  medium?: string[];
  surface?: string[];
  showOriginals?: boolean;
  showPrints?: boolean;
  showBooks?: boolean;
  sortBy?: ShopSortOption;
};

export type ShopProductListServiceResult = {
  success: true;
  data: SimpleProduct[];
  metadata: {
    totalArtworks: number;
    totalProducts: number;
  };
};

type ShopProductArtwork = {
  shopifyProducts?: ShopifyProductLink[];
};

const buildShopArtworkQuery = (
  filters: GetShopProductListParams
): FilterQuery<ArtworkDB> => {
  const filterConditions: FilterQuery<ArtworkDB>[] =
    SHOP_ARTWORK_FILTER_KEYS.flatMap((key) => {
      const values = filters[key];
      return values?.length ? [{ [key]: { $in: values } }] : [];
    });

  return {
    $and: [
      { shopifyProducts: { $exists: true, $ne: [] } },
      ...filterConditions,
    ],
  };
};

const shouldIncludeProductLink = (
  link: ShopifyProductLink,
  {
    showOriginals = true,
    showPrints = true,
    showBooks = true,
  }: GetShopProductListParams
) => {
  if (link.type === "original" && !showOriginals) return false;
  if (link.type === "print" && !showPrints) return false;
  if (link.type === "book" && !showBooks) return false;
  return true;
};

const getErrorForLog = (error: unknown) =>
  error instanceof Error
    ? error
    : new Error("Unknown Shopify product list error");

export const getShopProductList = async (
  params: GetShopProductListParams = {}
): Promise<ShopProductListServiceResult> => {
  await dbConnect();

  const query = buildShopArtworkQuery(params);
  const artworks = await ArtworkModel.find(query)
    .select("shopifyProducts")
    .lean<ShopProductArtwork[]>();

  const productLinks = artworks.flatMap(
    (artwork) => artwork.shopifyProducts ?? []
  );

  const uniqueProductIds = Array.from(
    new Set(
      productLinks
        .filter((link) => shouldIncludeProductLink(link, params))
        .map((link) => normalizeShopifyProductId(link.productId))
        .filter((productId): productId is string => productId !== null)
    )
  );

  const productResults = await Promise.all(
    uniqueProductIds.map((productId) => {
      const gid = shopifyProductIdToGid(productId);

      if (!gid) {
        return Promise.resolve(null);
      }

      return getProductById(gid).catch((error) => {
        shopProductListLogger.error("service.shopify.product_fetch.failed", {
          provider: "shopify",
          shopifyOperation: "getProductById",
          statusCategory: "product_fanout_failed",
          publicProductId: productId,
          error: getErrorForLog(error),
        });
        return null;
      });
    })
  );

  const products = productResults.filter(
    (product): product is SimpleProduct => product !== null
  );
  const sortedProducts = sortShopProducts(products, params.sortBy ?? "type");

  return {
    success: true,
    data: sortedProducts,
    metadata: {
      totalArtworks: artworks.length,
      totalProducts: sortedProducts.length,
    },
  };
};
