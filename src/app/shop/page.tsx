import { getProducts } from "@/lib/api/shopify/shopifyClient";
import { SimpleProduct } from "@/lib/data/types/shopify";
import { ProductCard } from "@/components/modules/cards";
import ShopFilters from "@/components/modules/filters/ShopFilters";
import ShopResultsBar from "@/components/modules/filters/ShopResultsBar";
import Image from "next/image";

// TODO: Move Shopify credentials to .env.local before pushing to GitHub
// Credentials are in: src/lib/config/shopifyConfig.ts

export default async function Shop() {
  let products: SimpleProduct[] = [];
  let error: string | null = null;

  try {
    const result = await getProducts(20);
    products = result.products;
  } catch (err) {
    console.error("Error loading products in Shop page: ", err);
    error = err instanceof Error ? err.message : "Failed to load products";
  }

  if (error) {
    return (
      <main className="flex min-h-screen max-w-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Error Loading Products
          </h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            Check the console for more details
          </p>
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="flex min-h-screen max-w-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Shop</h1>
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen max-w-screen flex-col items-center justify-start">
      <div className="w-full max-w-7xl">
        {/* Banner Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-16">
          {/* Image Section */}
          <div className="relative w-full h-[400px] lg:h-[600px]">
            <Image
              src="https://res.cloudinary.com/dzncmfirr/image/upload/e_grayscale/v1706776928/studio-thumbnails/JRL_studio1_007_qacibz.jpg"
              alt="Art Sale Banner"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="bg-gray-50 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-20">
            <div className="max-w-xl">
              <h1 className="text-5xl lg:text-6xl mb-4 text-gray-900">
                Art for Sale
              </h1>
              <div className="w-24 h-1 bg-gray-900 mb-8"></div>

              <h2 className="text-2xl lg:text-3xl mb-6 text-gray-800">
                Supporting our mission
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We would like to reiterate that my grandfather&apos;s artwork
                  is freely available, long term, to any establishment that can
                  put it on display to the public.
                </p>
                <p>
                  However, even if you aren&apos;t a gallery curator, you can
                  still own a piece of his art. We have a selection of books,
                  prints, and original artworks for sale. Limited edition print
                  runs are fixed at 100 reproductions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <ShopFilters />

        {/* Results Bar */}
        <ShopResultsBar totalResults={products.length} />

        {/* Products Section */}
        <div className="px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="contain"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
