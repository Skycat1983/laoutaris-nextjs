"use client";

import { useState } from "react";
import { SimpleProduct } from "@/lib/data/types/shopify";
import { ProductCard } from "@/components/modules/cards/ProductCard";
import ShopFilters from "@/components/modules/filters/ShopFilters";
import ShopResultsBar from "@/components/modules/filters/ShopResultsBar";
import { ShopFiltersState } from "@/lib/data/types/shopTypes";

interface ShopProductGalleryProps {
  initialProducts: SimpleProduct[];
  initialFilters?: ShopFiltersState;
}

export const ShopProductGallery = ({
  initialProducts,
  initialFilters,
}: ShopProductGalleryProps) => {
  console.log("initialProducts in ShopProductGallery: ", initialProducts);
  console.log("initialFilters in ShopProductGallery: ", initialFilters);

  const [products, setProducts] = useState<SimpleProduct[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ShopFiltersState>(
    initialFilters || {
      artstyle: "all-style",
      medium: "all-medium",
      colour: "all-colours",
      surface: "all-surface",
      decade: "all-epochs",
      dimension: "all-dimensions",
      showOriginals: true,
      showPrints: true,
      showBooks: true,
    }
  );

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

      console.log(
        "ShopProductGallery - Fetching with params in ShopProductGallery.tsx: ",
        params.toString()
      );

      const response = await fetch(`/api/v2/shop/products?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch products");
      }

      console.log(
        "ShopProductGallery - Received products in ShopProductGallery.tsx: ",
        data.data.length
      );

      setProducts(data.data);
    } catch (error) {
      console.error(
        "ShopProductGallery - Error fetching products in ShopProductGallery.tsx: ",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      artstyle: "all-style",
      medium: "all-medium",
      colour: "all-colours",
      surface: "all-surface",
      decade: "all-epochs",
      dimension: "all-dimensions",
      showOriginals: true,
      showPrints: true,
      showBooks: true,
    });
    setProducts(initialProducts);
  };

  return (
    <>
      {/* Filters Section */}
      <ShopFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Results Bar */}
      <ShopResultsBar totalResults={products.length} />

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
            {products.map((product) => (
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
