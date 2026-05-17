import type { Fetcher } from "@/lib/api/core/createFetcher";
import type { SingleResult } from "@/lib/data/types";
import type { SimpleProduct } from "@/lib/data/types/shopify";

export type ApiShopProductResult = SingleResult<SimpleProduct>;

export const createShopFetchers = (fetcher: Fetcher) => ({
  productById: async (productId: string) => {
    const normalizedProductId = productId.trim();

    return fetcher<ApiShopProductResult>(
      `/api/v2/public/shop/products/${encodeURIComponent(normalizedProductId)}`
    );
  },
});

export type ShopFetchers = ReturnType<typeof createShopFetchers>;
