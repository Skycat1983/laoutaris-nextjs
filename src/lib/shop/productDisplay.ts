import type { ShopProductKind } from "@/lib/shop/productClassification";

export const getShopProductDisplayTitle = (
  title: string,
  productKind: ShopProductKind
): string => {
  const trimmedTitle = title.trim();

  if (productKind !== "print" && productKind !== "original") {
    return trimmedTitle || title;
  }

  const titleBeforeComma = trimmedTitle.split(",")[0]?.trim();

  return titleBeforeComma || trimmedTitle || title;
};
