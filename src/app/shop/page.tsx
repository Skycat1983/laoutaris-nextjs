import { getProducts } from "@/lib/api/shopify/shopifyClient";
import { SimpleProduct } from "@/lib/data/types/shopify";
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
    <main className="flex min-h-screen max-w-screen flex-col items-center justify-start p-8">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Shop</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Product Image */}
              {product.image ? (
                <div className="relative w-full aspect-square bg-gray-100">
                  <Image
                    src={product.image.url}
                    alt={product.image.altText || product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              {/* Product Info */}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                  {product.title}
                </h2>

                {product.vendor && (
                  <p className="text-sm text-gray-500 mb-2">{product.vendor}</p>
                )}

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold">
                    {parseFloat(product.price).toFixed(2)}{" "}
                    {product.currencyCode}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {parseFloat(product.compareAtPrice).toFixed(2)}{" "}
                      {product.currencyCode}
                    </span>
                  )}
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between">
                  {product.availableForSale ? (
                    <span className="text-sm text-green-600 font-medium">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
