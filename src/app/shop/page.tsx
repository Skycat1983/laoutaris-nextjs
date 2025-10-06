import { getProducts } from "@/lib/api/shopify/shopifyClient";
import { SimpleProduct } from "@/lib/data/types/shopify";
import { ProductCard } from "@/components/modules/cards";

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

        {/* Product Grid - Change variant prop to "contain" to show full images without cropping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="contain" />
          ))}
        </div>
      </div>
    </main>
  );
}
