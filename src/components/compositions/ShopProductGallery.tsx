"use client";

import { useState, useMemo } from "react";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/modules/cards/ProductCard";
import ShopFilters from "@/components/modules/filters/ShopFilters";
import ShopResultsBar from "@/components/modules/filters/ShopResultsBar";
import type { ShopFiltersState } from "@/lib/data/types/shopTypes";
import {
  SHOP_SORT_OPTIONS,
  type ShopSortOption,
} from "@/lib/data/options/shopSortOptions";
import { sortShopProducts } from "@/lib/data/utils/shopProductSorting";

const INITIAL_VISIBLE_PRODUCT_COUNT = 12;
const PRODUCT_BATCH_SIZE = 12;
const LOADING_SKELETON_COUNT = 6;

interface ShopProductGalleryProps {
  initialProducts: SimpleProduct[];
  initialFilters?: ShopFiltersState;
}

const isShopSortOption = (value: unknown): value is ShopSortOption =>
  typeof value === "string" &&
  (SHOP_SORT_OPTIONS as readonly string[]).includes(value);

export const ShopProductGallery = ({
  initialProducts,
  initialFilters,
}: ShopProductGalleryProps) => {
  const initialSortBy = isShopSortOption(initialFilters?.sortBy)
    ? initialFilters.sortBy
    : "type";
  const [products, setProducts] = useState<SimpleProduct[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<ShopSortOption>(initialSortBy);
  const [visibleProductCount, setVisibleProductCount] = useState(
    INITIAL_VISIBLE_PRODUCT_COUNT
  );
  const [filters, setFilters] = useState<ShopFiltersState>(
    initialFilters || {
      artstyle: "all-style",
      medium: "all-medium",
      surface: "all-surface",
      decade: "all-epochs",
      showOriginals: true,
      showPrints: true,
      showBooks: true,
      sortBy: initialSortBy,
    }
  );
  const [fetchError, setFetchError] = useState<string | null>(null);

  const queryParamsForFilters = (
    updatedFilters: ShopFiltersState,
    updatedSortBy: ShopSortOption
  ) => {
    const params = new URLSearchParams();

    if (updatedSortBy !== "type") {
      params.set("sortBy", updatedSortBy);
    }

    if (updatedFilters.artstyle && updatedFilters.artstyle !== "all-style") {
      params.append("artstyle", updatedFilters.artstyle);
    }
    if (updatedFilters.medium && updatedFilters.medium !== "all-medium") {
      params.append("medium", updatedFilters.medium);
    }
    if (updatedFilters.surface && updatedFilters.surface !== "all-surface") {
      params.append("surface", updatedFilters.surface);
    }
    if (updatedFilters.decade && updatedFilters.decade !== "all-epochs") {
      params.append("decade", updatedFilters.decade);
    }

    if (updatedFilters.showOriginals === false) {
      params.set("showOriginals", "false");
    }
    if (updatedFilters.showPrints === false) {
      params.set("showPrints", "false");
    }
    if (updatedFilters.showBooks === false) {
      params.set("showBooks", "false");
    }

    return params;
  };

  const updateBrowserUrl = (
    updatedFilters: ShopFiltersState,
    updatedSortBy: ShopSortOption
  ) => {
    const params = queryParamsForFilters(updatedFilters, updatedSortBy);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;

    window.history.replaceState(null, "", nextUrl);
  };

  const fetchProductsForFilters = async (
    updatedFilters: ShopFiltersState,
    updatedSortBy: ShopSortOption
  ) => {
    setFetchError(null);

    const params = queryParamsForFilters(updatedFilters, updatedSortBy);
    const query = params.toString();
    const requestUrl = `/api/v2/public/shop/products${query ? `?${query}` : ""}`;

    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch products");
    }

    setProducts(data.data);
    setVisibleProductCount(INITIAL_VISIBLE_PRODUCT_COUNT);
  };

  // Sort products based on current sortBy value
  const sortedProducts = useMemo(() => {
    return sortShopProducts(products, sortBy);
  }, [products, sortBy]);
  const visibleProducts = sortedProducts.slice(0, visibleProductCount);
  const hiddenProductCount = Math.max(
    sortedProducts.length - visibleProductCount,
    0
  );

  const handleSortChange = (newSortBy: ShopSortOption) => {
    setSortBy(newSortBy);
    setVisibleProductCount(INITIAL_VISIBLE_PRODUCT_COUNT);
    setFilters((currentFilters) => {
      const updatedFilters = { ...currentFilters, sortBy: newSortBy };
      updateBrowserUrl(updatedFilters, newSortBy);
      return updatedFilters;
    });
  };

  const handleFilterChange = async (newFilters: Partial<ShopFiltersState>) => {
    try {
      setIsLoading(true);

      const updatedFilters = { ...filters, ...newFilters, sortBy };
      setFilters(updatedFilters);
      updateBrowserUrl(updatedFilters, sortBy);

      await fetchProductsForFilters(updatedFilters, sortBy);
    } catch {
      setFetchError(
        "Unable to update product filters. The current products are still shown."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const retryProductFetch = async () => {
    try {
      setIsLoading(true);
      await fetchProductsForFilters(filters, sortBy);
    } catch {
      setFetchError(
        "Unable to update product filters. The current products are still shown."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    const resetFilters = {
      artstyle: "all-style",
      medium: "all-medium",
      surface: "all-surface",
      decade: "all-epochs",
      showOriginals: true,
      showPrints: true,
      showBooks: true,
      sortBy: "type",
    };
    setFilters(resetFilters);
    setSortBy("type");
    setProducts(initialProducts);
    setVisibleProductCount(INITIAL_VISIBLE_PRODUCT_COUNT);
    setFetchError(null);
    updateBrowserUrl(resetFilters, "type");
  };

  const showMoreProducts = () => {
    setVisibleProductCount((currentCount) =>
      Math.min(currentCount + PRODUCT_BATCH_SIZE, sortedProducts.length)
    );
  };

  return (
    <>
      {/* Filters Section */}
      <ShopFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Results Bar */}
      <ShopResultsBar
        totalResults={products.length}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      {fetchError && (
        <div
          role="alert"
          className="mx-8 mt-8 flex flex-col items-center gap-3 border border-red-200 bg-red-50 px-4 py-4 text-center text-red-700"
        >
          <p>{fetchError}</p>
          <button
            type="button"
            onClick={retryProductFetch}
            className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
          >
            Retry filters
          </button>
        </div>
      )}

      {/* Products Section */}
      <div className="px-8 py-12 relative" aria-busy={isLoading}>
        {isLoading && (
          <div>
            <div
              role="status"
              aria-label="Updating product results"
              className="sr-only"
            >
              Updating products
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
              {Array.from({ length: LOADING_SKELETON_COUNT }).map(
                (_, index) => (
                  <ProductCardSkeleton key={index} />
                )
              )}
            </div>
          </div>
        )}

        {products.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No products match your filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        ) : !isLoading ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="contain"
                />
              ))}
            </div>

            {hiddenProductCount > 0 && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={showMoreProducts}
                  className="border border-gray-900 px-6 py-3 text-sm uppercase tracking-[0.08em] text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
                >
                  Show more ({hiddenProductCount})
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};
