import { ShopProductGallery } from "@/components/compositions/ShopProductGallery";
import { ShopFiltersState } from "@/lib/data/types/shopTypes";

interface ShopProductsLoaderProps {
  initialFilters?: ShopFiltersState;
}

export const ShopProductsLoader = async ({
  initialFilters,
}: ShopProductsLoaderProps) => {
  let products = [];
  let error: string | null = null;

  try {
    // Build query params from initialFilters
    const params = new URLSearchParams();

    if (initialFilters) {
      if (initialFilters.artstyle && initialFilters.artstyle !== "all-style") {
        params.append("artstyle", initialFilters.artstyle);
      }
      if (initialFilters.medium && initialFilters.medium !== "all-medium") {
        params.append("medium", initialFilters.medium);
      }
      if (initialFilters.surface && initialFilters.surface !== "all-surface") {
        params.append("surface", initialFilters.surface);
      }
      if (initialFilters.decade && initialFilters.decade !== "all-epochs") {
        params.append("decade", initialFilters.decade);
      }

      params.append(
        "showOriginals",
        String(initialFilters.showOriginals ?? true)
      );
      params.append("showPrints", String(initialFilters.showPrints ?? true));
      params.append("showBooks", String(initialFilters.showBooks ?? true));
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const queryString = params.toString();
    const url = queryString
      ? `${baseUrl}/api/v2/shop/products?${queryString}`
      : `${baseUrl}/api/v2/shop/products`;

    console.log(
      "ShopProductsLoader - Fetching from in ShopProductsLoader.tsx: ",
      url
    );

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch products");
    }

    products = data.data;

    console.log(
      "ShopProductsLoader - Received products in ShopProductsLoader.tsx: ",
      products.length
    );
  } catch (err) {
    console.error(
      "Error in ShopProductsLoader in ShopProductsLoader.tsx: ",
      err
    );
    error = err instanceof Error ? err.message : "Failed to load products";
  }

  if (error) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-gray-500">
          Check the console for more details
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
