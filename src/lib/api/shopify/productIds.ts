const SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN = /^\d+$/;

export const normalizeShopifyProductId = (
  productId: string | null | undefined
): string | null => {
  if (typeof productId !== "string") {
    return null;
  }

  const normalizedProductId = productId.trim();

  if (!SHOPIFY_NUMERIC_PRODUCT_ID_PATTERN.test(normalizedProductId)) {
    return null;
  }

  return normalizedProductId;
};

export const normalizeShopifyProductIdParam = (
  productId: string | null | undefined
): string | null => {
  if (!productId) {
    return null;
  }

  try {
    return normalizeShopifyProductId(decodeURIComponent(productId));
  } catch {
    return null;
  }
};

export const shopifyProductIdToGid = (productId: string): string | null => {
  const normalizedProductId = normalizeShopifyProductId(productId);

  if (!normalizedProductId) {
    return null;
  }

  return `gid://shopify/Product/${normalizedProductId}`;
};
