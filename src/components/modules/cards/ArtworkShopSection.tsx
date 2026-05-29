import Link from "next/link";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import type { ArtworkShopProducts } from "@/lib/data/services/getArtworkShopProducts";
import { ShoppingCart, BookOpen, Palette } from "lucide-react";
import { productDetailPath } from "@/lib/routes/publicAppRoutes";

type ArtworkShopSectionProps = {
  artwork: ArtworkFrontend;
  shopProducts?: ArtworkShopProducts;
};

const ArtworkShopSection = ({
  artwork,
  shopProducts = { original: null, prints: [], books: [] },
}: ArtworkShopSectionProps) => {
  // Don't show section if no Shopify products
  if (!artwork.shopifyProducts || artwork.shopifyProducts.length === 0) {
    return null;
  }

  const { original: originalProduct, prints: printProducts, books: bookProducts } =
    shopProducts;

  if (!originalProduct && printProducts.length === 0 && bookProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-6">
      <h3 className="text-xl font-semibold mb-6">Available for Purchase</h3>

      <div className="space-y-6">
        {/* Original Artwork */}
        {originalProduct && (
          <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
            <Palette className="w-6 h-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-lg">Original Artwork</h4>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {originalProduct.currencyCode} {originalProduct.price}
              </p>
              <Link
                href={productDetailPath(originalProduct.handle)}
                className="inline-block mt-3 px-6 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        )}

        {/* Prints */}
        {printProducts.length > 0 && (
          <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
            <ShoppingCart className="w-6 h-6 text-green-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-lg">
                Prints ({printProducts.length})
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                From {printProducts[0].currencyCode}{" "}
                {Math.min(...printProducts.map((p) => parseFloat(p.price)))}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {printProducts.map((print) => (
                  <Link
                    key={print.id}
                    href={productDetailPath(print.handle)}
                    className="px-4 py-2 border-2 border-black rounded-md font-medium hover:bg-black hover:text-white transition-colors text-sm"
                  >
                    {print.title} - {print.currencyCode} {print.price}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Books */}
        {bookProducts.length > 0 && (
          <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
            <BookOpen className="w-6 h-6 text-purple-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-lg">Featured in Books</h4>
              <div className="space-y-2 mt-3">
                {bookProducts.map((book) => (
                  <Link
                    key={book.id}
                    href={productDetailPath(book.handle)}
                    className="block p-3 border border-gray-200 rounded-md hover:border-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-600">
                      {book.currencyCode} {book.price}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkShopSection;
