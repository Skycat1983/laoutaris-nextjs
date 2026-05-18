import "server-only";

import { shopifyProductIdToGid } from "@/lib/api/shopify/productIds";
import { getProductById } from "@/lib/api/shopify/shopifyClient";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ShopifyProductLink } from "@/lib/data/types/shopifyTypes";
import { createServerLogger } from "@/lib/observability/logger";

const artworkShopProductsLogger = createServerLogger({
  surface: "data_service",
  operation: "shopify.artwork_shop_products",
});

export type ArtworkShopProducts = {
  original: SimpleProduct | null;
  prints: SimpleProduct[];
  books: SimpleProduct[];
};

const emptyArtworkShopProducts = (): ArtworkShopProducts => ({
  original: null,
  prints: [],
  books: [],
});

const isAvailableProduct = (
  product: SimpleProduct | null
): product is SimpleProduct => product !== null && product.availableForSale;

const getErrorForLog = (error: unknown) =>
  error instanceof Error
    ? error
    : new Error("Unknown Shopify linked product error");

const getLinkedProduct = async (
  link: ShopifyProductLink
): Promise<SimpleProduct | null> => {
  const gid = shopifyProductIdToGid(link.productId);

  if (!gid) {
    return null;
  }

  try {
    const product = await getProductById(gid);
    return isAvailableProduct(product) ? product : null;
  } catch (error) {
    artworkShopProductsLogger.error(
      "service.shopify.artwork_product_fetch.failed",
      {
        provider: "shopify",
        shopifyOperation: "getProductById",
        statusCategory: "linked_product_fetch_failed",
        publicProductId: link.productId,
        productLinkType: link.type,
        error: getErrorForLog(error),
      }
    );
    return null;
  }
};

export const getArtworkShopProducts = async (
  links: ShopifyProductLink[] | undefined
): Promise<ArtworkShopProducts> => {
  if (!links?.length) {
    return emptyArtworkShopProducts();
  }

  const productResults = await Promise.all(
    links.map(async (link) => ({
      type: link.type,
      product: await getLinkedProduct(link),
    }))
  );

  const grouped = emptyArtworkShopProducts();

  for (const result of productResults) {
    if (!result.product) {
      continue;
    }

    if (result.type === "original" && !grouped.original) {
      grouped.original = result.product;
      continue;
    }

    if (result.type === "print") {
      grouped.prints.push(result.product);
      continue;
    }

    if (result.type === "book") {
      grouped.books.push(result.product);
    }
  }

  return grouped;
};
