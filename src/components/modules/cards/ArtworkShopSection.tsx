"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import { SimpleProduct } from "@/lib/data/types/shopify";
import {
  getShopifyProductsByType,
  hasShopifyProductType,
} from "@/lib/data/types/shopifyTypes";
import { ShoppingCart, BookOpen, Palette } from "lucide-react";

type ArtworkShopSectionProps = {
  artwork: ArtworkFrontend;
};

const ArtworkShopSection = ({ artwork }: ArtworkShopSectionProps) => {
  const [originalProduct, setOriginalProduct] = useState<SimpleProduct | null>(
    null
  );
  const [printProducts, setPrintProducts] = useState<SimpleProduct[]>([]);
  const [bookProducts, setBookProducts] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!artwork.shopifyProducts || artwork.shopifyProducts.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch original
        const originals = getShopifyProductsByType(
          artwork.shopifyProducts,
          "original"
        );
        if (originals.length > 0) {
          const res = await fetch(
            `/api/shopify/products/${encodeURIComponent(
              originals[0].productId
            )}`
          );
          if (res.ok) {
            const product = await res.json();
            setOriginalProduct(product);
          }
        }

        // Fetch prints
        const prints = getShopifyProductsByType(
          artwork.shopifyProducts,
          "print"
        );
        if (prints.length > 0) {
          const printData = await Promise.all(
            prints.map((p) =>
              fetch(
                `/api/shopify/products/${encodeURIComponent(p.productId)}`
              ).then((res) => (res.ok ? res.json() : null))
            )
          );
          setPrintProducts(printData.filter(Boolean));
        }

        // Fetch books
        const books = getShopifyProductsByType(artwork.shopifyProducts, "book");
        if (books.length > 0) {
          const bookData = await Promise.all(
            books.map((b) =>
              fetch(
                `/api/shopify/products/${encodeURIComponent(b.productId)}`
              ).then((res) => (res.ok ? res.json() : null))
            )
          );
          setBookProducts(bookData.filter(Boolean));
        }
      } catch (error) {
        console.error(
          "Error fetching Shopify products in ArtworkShopSection: ",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [artwork]);

  // Don't show section if no Shopify products
  if (!artwork.shopifyProducts || artwork.shopifyProducts.length === 0) {
    return null;
  }

  // Show quick badges while loading
  const hasOriginal = hasShopifyProductType(
    artwork.shopifyProducts,
    "original"
  );
  const hasPrints = hasShopifyProductType(artwork.shopifyProducts, "print");
  const hasBooks = hasShopifyProductType(artwork.shopifyProducts, "book");

  if (loading) {
    return (
      <div className="bg-gray-50 border-t border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-4">Available for Purchase</h3>
        <div className="flex gap-2">
          {hasOriginal && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Original Available
            </span>
          )}
          {hasPrints && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Prints Available
            </span>
          )}
          {hasBooks && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              Featured in Books
            </span>
          )}
        </div>
      </div>
    );
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
                href={`/shop/products/${originalProduct.handle}`}
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
                    href={`/shop/products/${print.handle}`}
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
                    href={`/shop/products/${book.handle}`}
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
