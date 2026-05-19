import { ShopProductGallery } from "@/components/compositions/ShopProductGallery";
import type { ShopFiltersState } from "@/lib/data/types/shopTypes";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import {
  parseShopProductListQuery,
  type ShopProductListQueryInput,
} from "@/lib/data/schemas/shopProductListQuerySchema";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import { createServerLogger } from "@/lib/observability/logger";

interface ShopProductsLoaderProps {
  initialFilters?: ShopFiltersState;
}

const logger = createServerLogger({
  component: "ShopProductsLoader",
  operation: "public.shop.products_loader",
  surface: "server_loader",
});

const filterValueToQueryArray = (value: string | undefined, allValue: string) =>
  value && value !== allValue ? [value] : [];

const filtersToShopProductListQueryInput = (
  initialFilters?: ShopFiltersState
): ShopProductListQueryInput => ({
  artstyle: filterValueToQueryArray(initialFilters?.artstyle, "all-style"),
  medium: filterValueToQueryArray(initialFilters?.medium, "all-medium"),
  surface: filterValueToQueryArray(initialFilters?.surface, "all-surface"),
  decade: filterValueToQueryArray(initialFilters?.decade, "all-epochs"),
  showOriginals:
    initialFilters?.showOriginals == null
      ? undefined
      : String(initialFilters.showOriginals),
  showPrints:
    initialFilters?.showPrints == null
      ? undefined
      : String(initialFilters.showPrints),
  showBooks:
    initialFilters?.showBooks == null
      ? undefined
      : String(initialFilters.showBooks),
});

export const ShopProductsLoader = async ({
  initialFilters,
}: ShopProductsLoaderProps) => {
  let products: SimpleProduct[] = [];
  let error: string | null = null;

  try {
    const parsedQuery = parseShopProductListQuery(
      filtersToShopProductListQueryInput(initialFilters)
    );

    if (!parsedQuery.success) {
      throw new Error("Invalid shop products query");
    }

    const result = await getShopProductList(parsedQuery.data);
    products = result.data;
  } catch (err) {
    logger.error("loader.public.shop_products.failed", {
      error: err,
      hasInitialFilters: Boolean(initialFilters),
    });
    error = err instanceof Error ? err.message : "Failed to load products";
  }

  if (error) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-gray-500">
          Please try again later or contact the gallery if the problem
          continues.
        </p>
      </div>
    );
  }

  return (
    <ShopProductGallery
      initialProducts={products}
      initialFilters={initialFilters}
    />
  );
};
