import { Suspense } from "react";
import { Metadata } from "next";
import { getProductByHandle } from "@/lib/api/shopify/shopifyClient";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import { getArtworkById } from "@/lib/data/services/getArtworkById";
import { ProductStructuredData } from "@/components/metadata/PublicDetailJsonLd";
import {
  ShopProductSaleGallery,
  type ShopProductGalleryImage,
} from "@/components/shop/product-detail/ShopProductSaleGallery";
import {
  buildMissingPublicDetailMetadata,
  buildProductDetailMetadata,
  buildUnavailablePublicDetailMetadata,
} from "@/lib/metadata/publicDetailMetadata";
import {
  buildFramedPrintPreviewArtwork,
  type FramedPrintPreviewArtwork,
} from "@/lib/framePreview/productEligibility";
import { getShopProductKind } from "@/lib/shop/productClassification";
import { createServerLogger } from "@/lib/observability/logger";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { artworkDetailPath } from "@/lib/routes/publicAppRoutes";

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

const isPositiveDimension = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const getArtworkDisplayTitle = (title: string): string => {
  const trimmedTitle = title.trim();
  const titleBeforeComma = trimmedTitle.split(",")[0]?.trim();

  return titleBeforeComma || trimmedTitle || title;
};

const buildLinkedArtworkPreview = (
  product: SimpleProduct,
  linkedArtwork: ArtworkFrontend | null
): FramedPrintPreviewArtwork | null => {
  if (!linkedArtwork) return null;

  const { image } = linkedArtwork;

  if (
    !image.secure_url ||
    !isPositiveDimension(image.pixelWidth) ||
    !isPositiveDimension(image.pixelHeight)
  ) {
    return null;
  }

  return {
    src: image.secure_url,
    alt: linkedArtwork.title.trim() || product.title,
    metrics: {
      pixelWidth: image.pixelWidth,
      pixelHeight: image.pixelHeight,
    },
  };
};

const buildProductImagePreview = (
  product: SimpleProduct
): FramedPrintPreviewArtwork | null => {
  if (
    !product.image?.url ||
    !isPositiveDimension(product.image.width) ||
    !isPositiveDimension(product.image.height)
  ) {
    return null;
  }

  return {
    src: product.image.url,
    alt: product.image.altText || product.title,
    metrics: {
      pixelWidth: product.image.width,
      pixelHeight: product.image.height,
    },
  };
};

const buildProductImagePreviews = (
  product: SimpleProduct
): ShopProductGalleryImage[] => {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];

  return images.flatMap((image, index) => {
    if (
      !image.url ||
      !isPositiveDimension(image.width) ||
      !isPositiveDimension(image.height)
    ) {
      return [];
    }

    const alt = image.altText || product.title;

    return {
      id: `product-image-${index}`,
      src: image.url,
      alt,
      label: image.altText || `product image ${index + 1}`,
      metrics: {
        pixelWidth: image.width,
        pixelHeight: image.height,
      },
    };
  });
};

const buildProductSalePreview = (
  product: SimpleProduct,
  linkedArtwork: ArtworkFrontend | null
): FramedPrintPreviewArtwork | null => {
  return (
    buildFramedPrintPreviewArtwork(product, linkedArtwork) ??
    buildLinkedArtworkPreview(product, linkedArtwork) ??
    buildProductImagePreview(product)
  );
};

export default async function ProductPage({ params }: PageProps) {
  const { productHandle } = params;

  // Fetch Shopify product
  const product = await getProductByHandle(productHandle);

  if (!product) {
    notFound();
  }

  // Determine product type and fetch related data
  const productKind = getShopProductKind(product);
  const featuredArtworkIds = hasFeaturedArtworkIds(product.featuredArtworkIds)
    ? product.featuredArtworkIds
    : [];
  const isBook = productKind === "book";
  const linkedArtwork = isBook ? null : await fetchArtworkIfLinked(product);
  const bookArtworks = isBook
    ? await fetchArtworksInBook(featuredArtworkIds, product.handle)
    : [];
  const productImagePreviews = buildProductImagePreviews(product);
  const salePreviewArtwork = buildProductSalePreview(product, linkedArtwork);
  const saleArtworkDetails =
    linkedArtwork
      ? {
          id: String(linkedArtwork._id),
          title: linkedArtwork.title,
          medium: linkedArtwork.medium,
          surface: linkedArtwork.surface,
          decade: linkedArtwork.decade,
        }
      : null;
  const enquiryHref = `/project/contact?product=${encodeURIComponent(
    product.handle
  )}`;

  return (
    <>
      <Suspense fallback={null}>
        <ProductStructuredData productHandle={productHandle} />
      </Suspense>
      <main className="max-w-7xl mx-auto px-4 py-12">
        <ShopProductSaleGallery
          product={{
            availableForSale: product.availableForSale,
            compareAtPrice: product.compareAtPrice,
            currencyCode: product.currencyCode,
            description: product.description,
            handle: product.handle,
            onlineStoreUrl: product.onlineStoreUrl,
            price: product.price,
            productType: product.productType,
            tags: product.tags,
            title: product.title,
            vendor: product.vendor,
          }}
          productKind={productKind}
          linkedArtwork={saleArtworkDetails}
          artwork={salePreviewArtwork}
          galleryImages={productImagePreviews}
          enquiryHref={enquiryHref}
        />

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
                  href={artworkDetailPath(artwork._id)}
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
                    {getArtworkDisplayTitle(artwork.title)}
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
