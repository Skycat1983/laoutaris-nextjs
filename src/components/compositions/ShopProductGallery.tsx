"use client";

import { useState, useMemo } from "react";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import { ProductCard } from "@/components/modules/cards/ProductCard";
import ShopFilters from "@/components/modules/filters/ShopFilters";
import ShopResultsBar from "@/components/modules/filters/ShopResultsBar";
import type { ShopFiltersState, ShopSortOption } from "@/lib/data/types/shopTypes";

interface ShopProductGalleryProps {
  initialProducts: SimpleProduct[];
  initialFilters?: ShopFiltersState;
}

const PRODUCT_TYPE_SORT_ORDER: Record<string, number> = {
  book: 0,
  publication: 0,
  original: 1,
  "original artwork": 1,
  print: 2,
  "limited edition print": 2,
};

const normalizeProductType = (productType: string) =>
  productType.trim().toLowerCase().replace(/\s+/g, " ");

export const getShopProductTypeSortOrder = (product: SimpleProduct) => {
  const normalizedType = normalizeProductType(product.productType);

  return PRODUCT_TYPE_SORT_ORDER[normalizedType] ?? 3;
};

export const ShopProductGallery = ({
  initialProducts,
  initialFilters,
}: ShopProductGalleryProps) => {
  const [products, setProducts] = useState<SimpleProduct[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<ShopSortOption>(
    initialFilters?.sortBy || "type"
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
      sortBy: "type",
    }
  );

  // Sort products based on current sortBy value
  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price-high":
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "type":
      default:
        // Sort by explicit Shopify product type: books, originals, prints, then unknowns.
        return sorted.sort((a, b) => {
          return (
            getShopProductTypeSortOrder(a) - getShopProductTypeSortOrder(b)
          );
        });
    }
  }, [products, sortBy]);

  const handleSortChange = (newSortBy: ShopSortOption) => {
    setSortBy(newSortBy);
  };

  const handleFilterChange = async (newFilters: Partial<ShopFiltersState>) => {
    try {
      setIsLoading(true);

      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);

      // Build query params
      const params = new URLSearchParams();

      // Add artwork filters (skip "all" values)
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

      // Add product type filters
      params.append(
        "showOriginals",
        String(updatedFilters.showOriginals ?? true)
      );
      params.append("showPrints", String(updatedFilters.showPrints ?? true));
      params.append("showBooks", String(updatedFilters.showBooks ?? true));

      const response = await fetch(`/api/v2/public/shop/products?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch products");
      }

      setProducts(data.data);
    } catch {
      // Preserve the current product grid or empty state; loading is cleared in finally.
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      artstyle: "all-style",
      medium: "all-medium",
      surface: "all-surface",
      decade: "all-epochs",
      showOriginals: true,
      showPrints: true,
      showBooks: true,
      sortBy: "type",
    });
    setSortBy("type");
    setProducts(initialProducts);
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

      {/* Products Section */}
      <div className="px-8 py-12 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="text-lg">Loading...</div>
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="contain"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
