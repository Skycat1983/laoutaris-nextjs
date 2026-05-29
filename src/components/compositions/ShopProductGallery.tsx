"use client";

import { useCallback, useState } from "react";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import {
  ProductCard,
  ProductCardSkeleton,
} from "@/components/modules/cards/ProductCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { PaginationMetadata } from "@/lib/data/types/apiTypes";
import ShopFilters from "@/components/modules/filters/ShopFilters";
import ShopResultsBar from "@/components/modules/filters/ShopResultsBar";
import type { ShopFiltersState } from "@/lib/data/types/shopTypes";
import {
  SHOP_SORT_OPTIONS,
  type ShopSortOption,
} from "@/lib/data/options/shopSortOptions";

const LOADING_SKELETON_COUNT = 6;
const PRODUCT_PAGE_SIZE = 12;

interface ShopProductGalleryProps {
  initialProducts: SimpleProduct[];
  initialFilters?: ShopFiltersState;
  initialPaginationMetadata?: Required<PaginationMetadata>;
}

type ShopProductListResponse = {
  success: true;
  data: SimpleProduct[];
  metadata?: Required<PaginationMetadata>;
};

const isShopSortOption = (value: unknown): value is ShopSortOption =>
  typeof value === "string" &&
  (SHOP_SORT_OPTIONS as readonly string[]).includes(value);

export const ShopProductGallery = ({
  initialProducts,
  initialFilters,
  initialPaginationMetadata,
}: ShopProductGalleryProps) => {
  const initialSortBy = isShopSortOption(initialFilters?.sortBy)
    ? initialFilters.sortBy
    : "type";
  const initialPage = initialPaginationMetadata?.page ?? 1;
  const initialTotal = initialPaginationMetadata?.total ?? initialProducts.length;
  const initialHasMore = initialPaginationMetadata
    ? initialPaginationMetadata.page < initialPaginationMetadata.totalPages
    : false;
  const [products, setProducts] = useState<SimpleProduct[]>(initialProducts);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [sortBy, setSortBy] = useState<ShopSortOption>(initialSortBy);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [totalResults, setTotalResults] = useState(initialTotal);
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

  const queryParamsForFilters = useCallback((
    updatedFilters: ShopFiltersState,
    updatedSortBy: ShopSortOption,
    pageNumber?: number
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
    if (typeof pageNumber === "number") {
      params.set("page", String(pageNumber));
      params.set("limit", String(PRODUCT_PAGE_SIZE));
    }

    return params;
  }, []);

  const updateBrowserUrl = (
    updatedFilters: ShopFiltersState,
    updatedSortBy: ShopSortOption
  ) => {
    const params = queryParamsForFilters(updatedFilters, updatedSortBy);
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;

    window.history.replaceState(null, "", nextUrl);
  };

  const fetchProductsForFilters = useCallback(async (
    updatedFilters: ShopFiltersState,
    updatedSortBy: ShopSortOption,
    pageNumber = 1
  ): Promise<ShopProductListResponse> => {
    setFetchError(null);

    const params = queryParamsForFilters(
      updatedFilters,
      updatedSortBy,
      pageNumber
    );
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

    return data;
  }, [queryParamsForFilters]);

  const replaceProductsFromFirstPage = (data: ShopProductListResponse) => {
    const metadata = data.metadata;

    setProducts(data.data);
    setPage(metadata?.page ?? 1);
    setHasMore(metadata ? metadata.page < metadata.totalPages : false);
    setTotalResults(metadata?.total ?? data.data.length);
  };

  const handleSortChange = async (newSortBy: ShopSortOption) => {
    const updatedFilters = { ...filters, sortBy: newSortBy };
    setSortBy(newSortBy);
    setFilters(updatedFilters);
    updateBrowserUrl(updatedFilters, newSortBy);

    try {
      setIsFilterLoading(true);
      const data = await fetchProductsForFilters(updatedFilters, newSortBy);
      replaceProductsFromFirstPage(data);
    } catch {
      setFetchError(
        "Unable to update product sorting. The current products are still shown."
      );
    } finally {
      setIsFilterLoading(false);
    }
  };

  const handleFilterChange = async (newFilters: Partial<ShopFiltersState>) => {
    try {
      setIsFilterLoading(true);

      const updatedFilters = { ...filters, ...newFilters, sortBy };
      setFilters(updatedFilters);
      updateBrowserUrl(updatedFilters, sortBy);

      const data = await fetchProductsForFilters(updatedFilters, sortBy);
      replaceProductsFromFirstPage(data);
    } catch {
      setFetchError(
        "Unable to update product filters. The current products are still shown."
      );
    } finally {
      setIsFilterLoading(false);
    }
  };

  const retryProductFetch = async () => {
    try {
      setIsFilterLoading(true);
      const data = await fetchProductsForFilters(filters, sortBy);
      replaceProductsFromFirstPage(data);
    } catch {
      setFetchError(
        "Unable to update product filters. The current products are still shown."
      );
    } finally {
      setIsFilterLoading(false);
    }
  };

  const clearFilters = async () => {
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
    setFetchError(null);
    updateBrowserUrl(resetFilters, "type");

    try {
      setIsFilterLoading(true);
      const data = await fetchProductsForFilters(resetFilters, "type");
      replaceProductsFromFirstPage(data);
    } catch {
      setFetchError(
        "Unable to reset product filters. The current products are still shown."
      );
    } finally {
      setIsFilterLoading(false);
    }
  };

  const loadMoreProducts = useCallback(async () => {
    if (!hasMore || isFilterLoading) return;

    const nextPage = page + 1;
    const data = await fetchProductsForFilters(filters, sortBy, nextPage);
    const metadata = data.metadata;

    setProducts((currentProducts) => {
      const existingIds = new Set(
        currentProducts.map((product) => product.id)
      );
      const uniqueProducts = data.data.filter(
        (product) => !existingIds.has(product.id)
      );
      return uniqueProducts.length
        ? [...currentProducts, ...uniqueProducts]
        : currentProducts;
    });
    setPage(metadata?.page ?? nextPage);
    setHasMore(metadata ? metadata.page < metadata.totalPages : false);
    setTotalResults(metadata?.total ?? products.length + data.data.length);
  }, [
    fetchProductsForFilters,
    filters,
    hasMore,
    isFilterLoading,
    page,
    products.length,
    sortBy,
  ]);

  const {
    observerRef,
    isLoading: isScrollLoading,
    error: scrollError,
    retry: retryLoadMore,
  } = useInfiniteScroll({
    onLoadMore: loadMoreProducts,
    hasMore,
    rootMargin: "200px",
  });

  return (
    <>
      {/* Filters Section */}
      <ShopFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Results Bar */}
      <ShopResultsBar
        totalResults={totalResults}
        sortBy={sortBy}
        onSortChange={(newSortBy) => {
          void handleSortChange(newSortBy);
        }}
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
      <div className="px-8 py-12 relative" aria-busy={isFilterLoading}>
        {isFilterLoading && (
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

        {products.length === 0 && !isFilterLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No products match your filters.
            </p>
            <button
              onClick={() => {
                void clearFilters();
              }}
              className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        ) : !isFilterLoading ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="contain"
                />
              ))}
              {isScrollLoading &&
                Array.from({ length: LOADING_SKELETON_COUNT }).map(
                  (_, index) => (
                    <ProductCardSkeleton key={`load-more-${index}`} />
                  )
                )}
            </div>

            <div ref={observerRef} className="min-h-4">
              {scrollError && (
                <div
                  role="alert"
                  className="flex flex-col items-center gap-3 text-center text-red-600"
                >
                  <p>
                    Unable to load more products. The products already loaded
                    are still shown.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      void retryLoadMore();
                    }}
                    className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Try again
                  </button>
                </div>
              )}
              {isScrollLoading && (
                <div
                  role="status"
                  aria-label="Loading more product results"
                  className="sr-only"
                >
                  Loading more products
                </div>
              )}
              {!hasMore && products.length > 0 && (
                <p className="text-center text-sm text-gray-500">
                  All available products are shown.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
