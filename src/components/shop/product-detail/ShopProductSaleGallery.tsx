"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { RoomFramedArtworkPreview } from "@/components/shop/frame-preview/RoomFramedArtworkPreview";
import { FRAME_PROFILES } from "@/lib/framePreview/frameProfiles";
import { MAT_PROFILES } from "@/lib/framePreview/matProfiles";
import {
  SHOP_PRODUCT_ROOM_SCENES,
  type FramePreviewRoomScene,
} from "@/lib/framePreview/roomScenes";
import type { FramedPrintPreviewArtwork } from "@/lib/framePreview/productEligibility";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ShopProductKind } from "@/lib/shop/productClassification";
import { getShopProductDisplayTitle } from "@/lib/shop/productDisplay";

type SaleProduct = Pick<
  SimpleProduct,
  | "availableForSale"
  | "compareAtPrice"
  | "currencyCode"
  | "description"
  | "handle"
  | "onlineStoreUrl"
  | "price"
  | "productType"
  | "tags"
  | "title"
  | "vendor"
>;

export type ShopSaleArtworkDetails = {
  id: string;
  title: string;
  medium: string;
  surface: string;
  decade?: string;
};

export type ShopProductSaleGalleryProps = {
  product: SaleProduct;
  productKind: ShopProductKind;
  linkedArtwork?: ShopSaleArtworkDetails | null;
  artwork?: FramedPrintPreviewArtwork | null;
  galleryImages?: ShopProductGalleryImage[];
  enquiryHref: string;
};

export type ShopProductGalleryImage = FramedPrintPreviewArtwork & {
  id: string;
  label?: string;
};

const RAW_GALLERY_ID = "raw-artwork";

const mainRoomBounds = {
  maxWidthPx: 220,
  maxHeightPx: 170,
};

const thumbnailRoomBounds = {
  maxWidthPx: 38,
  maxHeightPx: 30,
};

type MetadataRowProps = {
  label: string;
  value: string;
};

type SlideDirection = "forward" | "backward";

type GalleryImageItem = {
  id: string;
  type: "image";
  artwork: FramedPrintPreviewArtwork;
  label: string;
};

type GalleryRoomItem = {
  id: string;
  type: "room";
  artwork: FramedPrintPreviewArtwork;
  room: FramePreviewRoomScene;
  label: string;
};

type GalleryItem = GalleryImageItem | GalleryRoomItem;

const toDisplayLabel = (value: string): string =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) =>
      word
        .split("-")
        .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
        .join("-")
    )
    .join(" ");

const tokenizeMetadata = (value: string): string[] =>
  value
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const buildProductKicker = (
  product: SaleProduct,
  productKind: ShopProductKind
): string => {
  const tokens = [
    ...tokenizeMetadata(product.productType),
    ...tokenizeMetadata(product.handle),
    ...tokenizeMetadata(product.title),
    ...tokenizeMetadata(product.description),
    ...product.tags.flatMap(tokenizeMetadata),
  ];
  const isPrint = tokens.includes("print") || tokens.includes("prints");
  const isLimitedEdition =
    tokens.includes("limited") && tokens.includes("edition");

  if (productKind === "book") {
    return "Publication";
  }

  if (productKind === "original") {
    return "Original Artwork";
  }

  if (productKind === "print" && isLimitedEdition && isPrint) {
    return "Limited Edition Print";
  }

  if (productKind === "print" || isPrint) {
    return "Print";
  }

  return toDisplayLabel(product.productType || "Product");
};

const formatMedium = (medium: string, surface: string): string => {
  const displayMedium = toDisplayLabel(medium);
  const displaySurface = surface.trim().toLowerCase();

  return displaySurface
    ? `${displayMedium} on ${displaySurface}`
    : displayMedium;
};

const formatPrice = (price: string, currencyCode: string): string => {
  const amount = Number.parseFloat(price);

  if (!Number.isFinite(amount)) {
    return `${currencyCode} ${price}`;
  }

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch {
    return `${currencyCode} ${price}`;
  }
};

const formatCmValue = (value: number): string => {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
};

const getPhysicalDimensions = (
  artwork: FramedPrintPreviewArtwork
): string | null => {
  const width =
    artwork.metrics.physicalPrintWidthCm ??
    artwork.metrics.physicalArtworkWidthCm;
  const height =
    artwork.metrics.physicalPrintHeightCm ??
    artwork.metrics.physicalArtworkHeightCm;

  if (
    typeof width !== "number" ||
    typeof height !== "number" ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }

  return `${formatCmValue(width)} x ${formatCmValue(height)} cm`;
};

const getProductTypeLabel = (
  product: SaleProduct,
  productKind: ShopProductKind
): string | null => {
  const productType = product.productType.trim();

  if (productType) {
    return toDisplayLabel(productType);
  }

  if (productKind === "print") {
    return "Fine art print";
  }

  if (productKind === "book") {
    return "Publication";
  }

  if (productKind === "original") {
    return "Original artwork";
  }

  return null;
};

const MetadataRow = ({ label, value }: MetadataRowProps) => (
  <div className="grid grid-cols-[6.5rem,minmax(0,1fr)] gap-4 border-t border-gray-200 py-4 font-archivo text-sm sm:grid-cols-[8rem,minmax(0,1fr)]">
    <dt className="text-xs font-semibold uppercase text-gray-700">{label}</dt>
    <dd className="min-w-0 break-words text-base text-gray-950">{value}</dd>
  </div>
);

type GalleryButtonProps = {
  selected: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
};

const GalleryButton = ({
  selected,
  label,
  onClick,
  children,
}: GalleryButtonProps) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={selected}
    className={`relative h-24 w-24 flex-none overflow-hidden border bg-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 lg:h-28 lg:w-28 ${
      selected
        ? "border-gray-950 ring-2 ring-gray-950"
        : "border-gray-300 hover:border-gray-900"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export const ShopProductSaleGallery = ({
  product,
  productKind,
  linkedArtwork,
  artwork,
  galleryImages = [],
  enquiryHref,
}: ShopProductSaleGalleryProps) => {
  const showRoomPreviews =
    (productKind === "print" || productKind === "original") && Boolean(artwork);
  const showPrintPreviewControls =
    product.availableForSale && productKind === "print" && Boolean(artwork);
  const [selectedGalleryId, setSelectedGalleryId] =
    useState<string>(RAW_GALLERY_ID);
  const [previousGalleryItem, setPreviousGalleryItem] =
    useState<GalleryItem | null>(null);
  const [slideDirection, setSlideDirection] =
    useState<SlideDirection>("forward");
  const [animationSequence, setAnimationSequence] = useState(0);
  const [selectedFrameProfileId, setSelectedFrameProfileId] = useState<string>(
    FRAME_PROFILES[0].id
  );
  const [selectedMatProfileId, setSelectedMatProfileId] = useState<string>(
    MAT_PROFILES[1]?.id ?? MAT_PROFILES[0].id
  );

  const selectedFrameProfile = useMemo(() => {
    return (
      FRAME_PROFILES.find((profile) => profile.id === selectedFrameProfileId) ??
      FRAME_PROFILES[0]
    );
  }, [selectedFrameProfileId]);

  const selectedMatProfile = useMemo(() => {
    return (
      MAT_PROFILES.find((profile) => profile.id === selectedMatProfileId) ??
      MAT_PROFILES[0]
    );
  }, [selectedMatProfileId]);

  const galleryItems = useMemo<GalleryItem[]>(() => {
    if (productKind === "book") {
      return galleryImages.map((galleryImage, index) => ({
        id: galleryImage.id,
        type: "image",
        artwork: galleryImage,
        label: galleryImage.label ?? `Book image ${index + 1}`,
      }));
    }

    if (!artwork) {
      return [];
    }

    const rawItem: GalleryItem = {
      id: RAW_GALLERY_ID,
      type: "image",
      artwork,
      label: `raw artwork image for ${artwork.alt}`,
    };

    if (!showRoomPreviews) {
      return [rawItem];
    }

    return [
      rawItem,
      ...SHOP_PRODUCT_ROOM_SCENES.map((room) => ({
        id: room.id,
        type: "room" as const,
        artwork,
        room,
        label: `${room.label} room preview for ${artwork.alt}`,
      })),
    ];
  }, [artwork, galleryImages, productKind, showRoomPreviews]);

  useEffect(() => {
    if (
      galleryItems.length > 0 &&
      !galleryItems.some((item) => item.id === selectedGalleryId)
    ) {
      setSelectedGalleryId(galleryItems[0].id);
    }
  }, [galleryItems, selectedGalleryId]);

  const selectedGalleryIndex = galleryItems.findIndex(
    (item) => item.id === selectedGalleryId
  );
  const selectedGalleryItem =
    selectedGalleryIndex >= 0
      ? galleryItems[selectedGalleryIndex]
      : galleryItems[0] ?? null;
  const activeGalleryId = selectedGalleryItem?.id ?? selectedGalleryId;

  useEffect(() => {
    if (!previousGalleryItem) return;

    const timeoutId = window.setTimeout(() => {
      setPreviousGalleryItem(null);
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [animationSequence, previousGalleryItem]);

  const handleGallerySelect = (nextItem: GalleryItem) => {
    if (!selectedGalleryItem || nextItem.id === selectedGalleryItem.id) {
      return;
    }

    const nextIndex = galleryItems.findIndex((item) => item.id === nextItem.id);
    const currentIndex = galleryItems.findIndex(
      (item) => item.id === selectedGalleryItem.id
    );

    setSlideDirection(nextIndex > currentIndex ? "forward" : "backward");
    setPreviousGalleryItem(selectedGalleryItem);
    setSelectedGalleryId(nextItem.id);
    setAnimationSequence((value) => value + 1);
  };

  const price = formatPrice(product.price, product.currencyCode);
  const compareAtPrice = product.compareAtPrice
    ? formatPrice(product.compareAtPrice, product.currencyCode)
    : null;
  const physicalDimensions = artwork ? getPhysicalDimensions(artwork) : null;
  const productKicker = buildProductKicker(product, productKind);
  const displayProductTitle = getShopProductDisplayTitle(
    product.title,
    productKind
  );
  const medium = linkedArtwork
    ? formatMedium(linkedArtwork.medium, linkedArtwork.surface)
    : null;
  const productTypeLabel = getProductTypeLabel(product, productKind);

  const renderGalleryVisual = (
    item: GalleryItem,
    options: { thumbnail?: boolean; priority?: boolean } = {}
  ) => {
    if (item.type === "room") {
      return (
        <RoomFramedArtworkPreview
          artwork={item.artwork}
          roomScene={item.room}
          frameProfile={selectedFrameProfile}
          matProfile={selectedMatProfile}
          bounds={options.thumbnail ? thumbnailRoomBounds : mainRoomBounds}
          profileScale={options.thumbnail ? 0.24 : 0.38}
          priority={options.priority}
          unoptimized
          imageSizes={
            options.thumbnail ? "112px" : "(max-width: 1279px) 100vw, 45vw"
          }
          className={
            options.thumbnail
              ? "aspect-auto h-full w-full bg-transparent"
              : "aspect-auto h-full w-full bg-transparent shadow-sm"
          }
          testId={
            options.thumbnail
              ? `shop-sale-room-thumbnail-${item.room.id}`
              : "shop-sale-main-room-preview"
          }
        />
      );
    }

    const imageWidth = Math.max(
      1,
      Math.round(item.artwork.metrics.pixelWidth)
    );
    const imageHeight = Math.max(
      1,
      Math.round(item.artwork.metrics.pixelHeight)
    );

    if (options.thumbnail) {
      return (
        <Image
          src={item.artwork.src}
          alt=""
          width={imageWidth}
          height={imageHeight}
          sizes="112px"
          unoptimized
          className="h-full w-full object-cover"
        />
      );
    }

    return (
      <figure
        aria-label={`Raw product image of ${item.artwork.alt}`}
        className="relative flex h-full w-full items-center justify-center"
        data-testid="shop-sale-main-raw-preview"
      >
        <Image
          src={item.artwork.src}
          alt={item.artwork.alt}
          fill
          priority={options.priority}
          unoptimized
          sizes="(max-width: 1279px) 100vw, 45vw"
          className="object-contain"
        />
      </figure>
    );
  };

  return (
    <section
      aria-labelledby="shop-sale-product-title"
      className="grid w-full gap-8 xl:grid-cols-[minmax(18rem,27rem)_minmax(32rem,1fr)_7rem] xl:items-start"
      data-testid="shop-product-sale-gallery"
    >
      <aside className="px-1 py-2 text-left xl:sticky xl:top-8">
        <div className="flex items-center gap-6">
          <p className="font-archivo text-xs font-semibold uppercase text-gray-950">
            {productKicker}
          </p>
          <span className="h-px flex-1 bg-gray-300" aria-hidden="true" />
        </div>

        <h1
          id="shop-sale-product-title"
          className="mt-8 break-words font-cormorant text-5xl font-normal leading-none text-gray-950 sm:text-6xl"
        >
          {displayProductTitle}
        </h1>

        <p className="mt-3 font-archivo text-sm text-gray-500">
          {product.vendor}
        </p>

        <dl className="mt-8">
          {medium ? (
            <MetadataRow label="Medium" value={medium} />
          ) : productTypeLabel ? (
            <MetadataRow label="Type" value={productTypeLabel} />
          ) : null}
          {physicalDimensions ? (
            <MetadataRow label="Dimensions" value={physicalDimensions} />
          ) : null}
        </dl>

        {showPrintPreviewControls ? (
          <div className="mt-6 grid gap-4 font-archivo">
            <label className="grid gap-2 text-xs font-semibold uppercase text-gray-800">
              Frame
              <select
                value={selectedFrameProfile.id}
                onChange={(event) =>
                  setSelectedFrameProfileId(event.currentTarget.value)
                }
                className="h-14 w-full border border-gray-400 bg-white px-4 text-base font-normal normal-case text-gray-950 focus:border-gray-950 focus:outline-none"
              >
                {FRAME_PROFILES.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-xs font-semibold uppercase text-gray-800">
              Mat
              <select
                value={selectedMatProfile.id}
                onChange={(event) =>
                  setSelectedMatProfileId(event.currentTarget.value)
                }
                className="h-14 w-full border border-gray-400 bg-white px-4 text-base font-normal normal-case text-gray-950 focus:border-gray-950 focus:outline-none"
              >
                {MAT_PROFILES.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        <div className="mt-8 font-archivo">
          <p className="text-3xl font-semibold text-gray-950">{price}</p>
          {compareAtPrice ? (
            <p className="mt-1 text-base text-gray-500 line-through">
              {compareAtPrice}
            </p>
          ) : null}
        </div>

        <div className="mt-8 font-archivo">
          {!product.availableForSale ? (
            <div className="border border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-950">
                Currently Unavailable
              </p>
              <p className="mt-2 text-sm text-gray-600">
                This product cannot currently be purchased.
              </p>
            </div>
          ) : product.onlineStoreUrl ? (
            <>
              <a
                href={product.onlineStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 bg-black px-6 py-4 text-center text-sm font-semibold uppercase text-white transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                Purchase on Shopify
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <p className="mt-3 text-sm text-gray-600">
                Checkout is completed on Shopify.
              </p>
              <Link
                href={enquiryHref}
                className="mt-3 inline-flex text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-black"
              >
                Contact the archive team about this product
              </Link>
            </>
          ) : (
            <>
              <Link
                href={enquiryHref}
                className="inline-flex min-h-14 w-full items-center justify-center bg-black px-6 py-4 text-center text-sm font-semibold uppercase text-white transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
              >
                Enquire About This Product
              </Link>
              <p className="mt-3 text-sm text-gray-600">
                Contact the archive team to confirm availability and purchase
                details.
              </p>
            </>
          )}
        </div>

        {linkedArtwork ? (
          <Link
            href={`/artwork/${linkedArtwork.id}`}
            className="mt-6 inline-flex font-archivo text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-black"
          >
            View archive record
          </Link>
        ) : null}

        {product.description ? (
          <div
            className="prose prose-sm mt-6 max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : null}
      </aside>

      <div
        className="relative h-[32rem] min-h-[28rem] overflow-hidden bg-transparent px-2 py-2 sm:h-[38rem] lg:px-8 xl:h-[44rem]"
        data-slide-direction={previousGalleryItem ? slideDirection : undefined}
        data-testid="shop-sale-main-viewport"
      >
        {previousGalleryItem ? (
          <div
            key={`previous-${previousGalleryItem.id}-${animationSequence}`}
            aria-hidden="true"
            className={`absolute inset-0 flex items-center justify-center px-2 py-2 lg:px-8 ${
              slideDirection === "forward"
                ? "animate-[shopSaleSlideOutRight_300ms_ease-in-out_forwards]"
                : "animate-[shopSaleSlideOutLeft_300ms_ease-in-out_forwards]"
            }`}
            data-shop-sale-slide=""
          >
            {renderGalleryVisual(previousGalleryItem)}
          </div>
        ) : null}

        {selectedGalleryItem ? (
          <div
            key={`current-${selectedGalleryItem.id}-${animationSequence}`}
            className={`absolute inset-0 flex items-center justify-center px-2 py-2 lg:px-8 ${
              previousGalleryItem
                ? slideDirection === "forward"
                  ? "animate-[shopSaleSlideInFromLeft_300ms_ease-in-out_forwards]"
                  : "animate-[shopSaleSlideInFromRight_300ms_ease-in-out_forwards]"
                : ""
            }`}
            data-shop-sale-slide=""
            data-testid="shop-sale-current-visual"
          >
            {renderGalleryVisual(selectedGalleryItem, { priority: true })}
          </div>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gray-100 font-archivo text-sm text-gray-600"
            data-testid="shop-sale-main-empty-preview"
          >
            No image available
          </div>
        )}
      </div>

      {galleryItems.length > 0 ? (
        <div
          className="flex gap-4 overflow-x-auto pb-2 xl:flex-col xl:overflow-visible xl:pb-0"
          aria-label="Product preview gallery"
        >
          {galleryItems.map((item) => (
            <GalleryButton
              key={item.id}
              selected={activeGalleryId === item.id}
              label={`Show ${item.label}`}
              onClick={() => handleGallerySelect(item)}
            >
              {renderGalleryVisual(item, { thumbnail: true })}
            </GalleryButton>
          ))}
        </div>
      ) : (
        <div className="hidden xl:block" aria-hidden="true" />
      )}

      <style>{`
        @keyframes shopSaleSlideInFromLeft {
          from {
            opacity: 0.75;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shopSaleSlideInFromRight {
          from {
            opacity: 0.75;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shopSaleSlideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0.75;
            transform: translateX(100%);
          }
        }

        @keyframes shopSaleSlideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0.75;
            transform: translateX(-100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-shop-sale-slide] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};
