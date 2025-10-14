// Minimal link to Shopify products - store only what's needed to reference
export type ShopifyProductLink = {
  productId: string; // Shopify product GID
  type: "original" | "print" | "book";
};

// Helper type guards
export const getShopifyProductsByType = (
  links: ShopifyProductLink[] | undefined,
  type: ShopifyProductLink["type"]
): ShopifyProductLink[] => {
  return links?.filter((link) => link.type === type) ?? [];
};

export const hasShopifyProductType = (
  links: ShopifyProductLink[] | undefined,
  type: ShopifyProductLink["type"]
): boolean => {
  return links?.some((link) => link.type === type) ?? false;
};
