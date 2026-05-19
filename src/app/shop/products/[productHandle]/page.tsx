import { Suspense } from "react";
import { Metadata } from "next";
import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { ProductStructuredData } from "@/components/metadata/PublicDetailJsonLd";
import {
  buildMissingPublicDetailMetadata,
  buildProductDetailMetadata,
  buildUnavailablePublicDetailMetadata,
} from "@/lib/metadata/publicDetailMetadata";
import { createServerLogger } from "@/lib/observability/logger";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

const logger = createServerLogger({
  route: "/shop/products/[productHandle]",
  surface: "public_page",
});

type PageProps = {
  params: {
    productHandle: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const product = await getProductByHandle(params.productHandle);

    if (!product) {
      return buildMissingPublicDetailMetadata("Product");
    }

    return buildProductDetailMetadata(product);
  } catch {
    return buildUnavailablePublicDetailMetadata("Product");
  }
}

const fetchArtworkIfLinked = async (
  product: SimpleProduct
): Promise<ArtworkFrontend | null> => {
  if (!product.mongodbArtworkId) return null;

  try {
    return await getArtworkById(product.mongodbArtworkId);
  } catch (error) {
    logger.error("page.public.shop_product.linked_artwork_failed", {
      error,
      productHandle: product.handle,
      operation: "public.shop_product.linked_artwork",
    });
    return null;
  }
};

const fetchArtworksInBook = async (
  artworkIds: string[],
  productHandle: string
): Promise<ArtworkFrontend[]> => {
  const artworks = await Promise.all(
    artworkIds.map(async (id) => {
      try {
        return await getArtworkById(id);
      } catch (error) {
        logger.error("page.public.shop_product.book_artwork_failed", {
          error,
          productHandle,
          operation: "public.shop_product.book_artwork",
        });
        return null;
      }
    })
  );

  return artworks.filter(
    (artwork): artwork is ArtworkFrontend => artwork !== null
  );
};

const hasFeaturedArtworkIds = (
  featuredArtworkIds: SimpleProduct["featuredArtworkIds"]
): featuredArtworkIds is string[] => {
  return Array.isArray(featuredArtworkIds) && featuredArtworkIds.length > 0;
};

export default async function ProductPage({ params }: PageProps) {
  const { productHandle } = params;

  // Fetch Shopify product
  const product = await getProductByHandle(productHandle);

  if (!product) {
    notFound();
  }

  // Determine product type and fetch related data
  const featuredArtworkIds = hasFeaturedArtworkIds(product.featuredArtworkIds)
    ? product.featuredArtworkIds
    : [];
  const isBook = featuredArtworkIds.length > 0;
  const linkedArtwork = isBook ? null : await fetchArtworkIfLinked(product);
  const bookArtworks = isBook
    ? await fetchArtworksInBook(featuredArtworkIds, product.handle)
    : [];

  return (
    <>
      <Suspense fallback={null}>
        <ProductStructuredData productHandle={productHandle} />
      </Suspense>
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square">
            {product.image ? (
              <Image
                src={product.image.url}
                alt={product.image.altText || product.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 576px"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              <p className="text-sm text-gray-500 uppercase">{product.vendor}</p>
            </div>

            <div className="text-3xl font-semibold">
              {product.currencyCode} {product.price}
              {product.compareAtPrice && (
                <span className="ml-4 text-xl text-gray-400 line-through">
                  {product.currencyCode} {product.compareAtPrice}
                </span>
              )}
            </div>

            {product.description && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {product.availableForSale ? (
              <div className="rounded-md border border-gray-200 p-4">
                <Link
                  href={`/project/contact?product=${encodeURIComponent(
                    product.handle
                  )}`}
                  className="block w-full rounded-md bg-black px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  Enquire About This Product
                </Link>
                <p className="mt-3 text-sm text-gray-600">
                  Contact the archive team to confirm availability and purchase
                  details.
                </p>
              </div>
            ) : (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">
                  Currently Unavailable
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  This product cannot currently be purchased.
                </p>
              </div>
            )}

            {/* Link to Artwork Page (if single artwork) */}
            {linkedArtwork && (
              <div className="border-t pt-6">
                <Link
                  href={`/artwork/${linkedArtwork._id}`}
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  View Full Artwork Details →
                </Link>
                <p className="text-sm text-gray-600 mt-2">
                  See comprehensive information, colors, collection context, and
                  more
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Book: Show Featured Artworks */}
        {isBook && bookArtworks.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">
              Features {bookArtworks.length} Artworks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bookArtworks.map((artwork) => (
                <Link
                  key={artwork._id}
                  href={`/artwork/${artwork._id}`}
                  className="group"
                >
                  <div className="relative aspect-square mb-2 overflow-hidden rounded-md">
                    <Image
                      src={artwork.image.secure_url}
                      alt={artwork.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 288px"
                    />
                  </div>
                  <p className="text-sm font-medium group-hover:underline">
                    {artwork.title}
                  </p>
                  <p className="text-xs text-gray-500">{artwork.decade}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
