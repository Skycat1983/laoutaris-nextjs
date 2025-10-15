// Shopify Product Types for Storefront API

export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  availableForSale: boolean;
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  metafields?: ShopifyMetafield[];
}

export interface ShopifyProductConnection {
  edges: Array<{
    node: ShopifyProduct;
  }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

export interface ShopifyProductsResponse {
  products: ShopifyProductConnection;
}

// Metafield types for artwork linking
export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

// Simplified product type for UI display
export interface SimpleProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  price: string;
  currencyCode: string;
  compareAtPrice: string | null;
  image: {
    url: string;
    altText: string | null;
  } | null;
  availableForSale: boolean;

  // For linking to MongoDB artworks
  mongodbArtworkId?: string; // For individual artwork products (from metafield)
  featuredArtworkIds?: string[]; // For books (from metafield)
}
