"use server";

import { getShopProductList } from "@/lib/data/services/getShopProductList";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import { isNextError } from "@/lib/helpers/isNextError";
import { createServerLogger } from "@/lib/observability/logger";

const SHOP_PROTOTYPE_PRODUCT_LIMIT = 8;

const logger = createServerLogger({
  component: "ShopPrototypeLoader",
  operation: "prototype.home.shop.loader",
  surface: "server_loader",
});

export type ShopPrototypeData = {
  products: SimpleProduct[];
  hasLoadError: boolean;
};

export async function getShopPrototypeProducts(): Promise<ShopPrototypeData> {
  try {
    const result = await getShopProductList({
      showOriginals: true,
      showPrints: true,
      showBooks: true,
    });

    return {
      products: result.data.slice(0, SHOP_PROTOTYPE_PRODUCT_LIMIT),
      hasLoadError: false,
    };
  } catch (error) {
    if (isNextError(error)) {
      throw error;
    }

    logger.error("loader.prototype.home.shop.failed", { error });
    return {
      products: [],
      hasLoadError: true,
    };
  }
}
