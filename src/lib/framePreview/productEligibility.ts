import type { ArtworkFrontend } from "@/lib/data/types/artworkTypes";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ArtworkDisplayMetrics } from "./types";

type ProductFramePreviewMetadata = Pick<
  SimpleProduct,
  | "availableForSale"
  | "featuredArtworkIds"
  | "handle"
  | "mongodbArtworkId"
  | "productType"
  | "tags"
  | "title"
>;

export type FramedPrintPreviewArtwork = {
  src: string;
  alt: string;
  metrics: ArtworkDisplayMetrics;
};

const tokenizeMetadata = (value: string): string[] =>
  value
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const productMetadataTokens = (
  product: Pick<ProductFramePreviewMetadata, "productType" | "tags">
): string[] => [
  ...tokenizeMetadata(product.productType),
  ...product.tags.flatMap(tokenizeMetadata),
];

const hasAnyToken = (tokens: string[], candidates: readonly string[]) =>
  tokens.some((token) => candidates.includes(token));

const hasFeaturedArtworkIds = (
  featuredArtworkIds: ProductFramePreviewMetadata["featuredArtworkIds"]
): boolean => Array.isArray(featuredArtworkIds) && featuredArtworkIds.length > 0;

const isPositiveDimension = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

export const isFramePreviewEligibleProduct = (
  product: ProductFramePreviewMetadata
): boolean => {
  if (!product.availableForSale || !product.mongodbArtworkId) {
    return false;
  }

  if (hasFeaturedArtworkIds(product.featuredArtworkIds)) {
    return false;
  }

  const tokens = productMetadataTokens(product);

  if (hasAnyToken(tokens, ["book", "books", "catalog", "catalogue"])) {
    return false;
  }

  return hasAnyToken(tokens, ["print", "prints"]);
};

export const buildFramedPrintPreviewArtwork = (
  product: ProductFramePreviewMetadata,
  linkedArtwork: ArtworkFrontend | null
): FramedPrintPreviewArtwork | null => {
  if (!isFramePreviewEligibleProduct(product) || !linkedArtwork) {
    return null;
  }

  const { image } = linkedArtwork;

  if (
    !image.secure_url ||
    !isPositiveDimension(image.pixelWidth) ||
    !isPositiveDimension(image.pixelHeight)
  ) {
    return null;
  }

  const artworkTitle = linkedArtwork.title.trim() || product.title;

  return {
    src: image.secure_url,
    alt: artworkTitle,
    metrics: {
      pixelWidth: image.pixelWidth,
      pixelHeight: image.pixelHeight,
    },
  };
};
