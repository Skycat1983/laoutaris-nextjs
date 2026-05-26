import type { SimpleProduct } from "@/lib/data/types/shopify";

export type ShopProductKind = "book" | "print" | "original" | "product";

type ProductClassificationInput = Pick<
  SimpleProduct,
  | "description"
  | "featuredArtworkIds"
  | "handle"
  | "productType"
  | "tags"
  | "title"
>;

const tokenizeMetadata = (value: string): string[] =>
  value
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const hasAnyToken = (tokens: string[], candidates: readonly string[]) =>
  tokens.some((token) => candidates.includes(token));

export const getShopProductKind = (
  product: ProductClassificationInput
): ShopProductKind => {
  const explicitTokens = [
    ...tokenizeMetadata(product.productType),
    ...product.tags.flatMap(tokenizeMetadata),
  ];
  const fallbackTokens = [
    ...tokenizeMetadata(product.handle),
    ...tokenizeMetadata(product.title),
    ...tokenizeMetadata(product.description),
  ];
  const allTokens = [...explicitTokens, ...fallbackTokens];

  if (
    Array.isArray(product.featuredArtworkIds) &&
    product.featuredArtworkIds.length > 0
  ) {
    return "book";
  }

  if (
    hasAnyToken(allTokens, [
      "book",
      "books",
      "catalog",
      "catalogue",
      "publication",
      "publications",
    ])
  ) {
    return "book";
  }

  if (hasAnyToken(allTokens, ["print", "prints", "giclee"])) {
    return "print";
  }

  if (
    hasAnyToken(explicitTokens, [
      "artwork",
      "original",
      "painting",
      "paintings",
      "drawing",
      "drawings",
      "canvas",
    ])
  ) {
    return "original";
  }

  if (
    hasAnyToken(fallbackTokens, [
      "original",
      "painting",
      "paintings",
      "drawing",
      "drawings",
      "canvas",
    ])
  ) {
    return "original";
  }

  return "product";
};
