import {
  SHOPIFY_GRAPHQL_URL,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
} from "@/lib/config/shopifyConfig";
import {
  ShopifyProductsResponse,
  ShopifyProduct,
  SimpleProduct,
} from "@/lib/data/types/shopify";
import { GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY } from "./queries";

/**
 * Make a GraphQL request to Shopify Storefront API
 */
const shopifyFetch = async <T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> => {
  try {
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      // Cache settings: 0 = no cache (development), 3600 = 1 hour (production)
      next: { revalidate: process.env.NODE_ENV === "development" ? 0 : 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Shopify API error in shopifyFetch: ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json();

    if (json.errors) {
      console.error("GraphQL Errors in shopifyFetch: ", json.errors);
      throw new Error(
        `GraphQL errors in shopifyFetch: ${JSON.stringify(json.errors)}`
      );
    }

    return json.data as T;
  } catch (error) {
    console.error("Error in shopifyFetch: ", error);
    throw error;
  }
};

/**
 * Transform Shopify product to simplified format for UI
 */
const transformProduct = (product: ShopifyProduct): SimpleProduct => {
  const firstVariant = product.variants.edges[0]?.node;
  const firstImage = product.images.edges[0]?.node;

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    vendor: product.vendor,
    price:
      firstVariant?.price.amount || product.priceRange.minVariantPrice.amount,
    currencyCode:
      firstVariant?.price.currencyCode ||
      product.priceRange.minVariantPrice.currencyCode,
    compareAtPrice: firstVariant?.compareAtPrice?.amount || null,
    image: firstImage
      ? {
          url: firstImage.url,
          altText: firstImage.altText,
        }
      : null,
    availableForSale: product.availableForSale,
  };
};

/**
 * Fetch all products from Shopify
 * @param first - Number of products to fetch (default: 20)
 * @param after - Cursor for pagination
 */
export const getProducts = async (
  first = 20,
  after?: string
): Promise<{
  products: SimpleProduct[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}> => {
  try {
    const data = await shopifyFetch<ShopifyProductsResponse>({
      query: GET_PRODUCTS_QUERY,
      variables: { first, after },
    });

    const products = data.products.edges.map(({ node }) =>
      transformProduct(node)
    );

    return {
      products,
      pageInfo: {
        hasNextPage: data.products.pageInfo.hasNextPage,
        endCursor: data.products.pageInfo.endCursor,
      },
    };
  } catch (error) {
    console.error("Error fetching products in getProducts: ", error);
    throw new Error("Failed to fetch products from Shopify");
  }
};

/**
 * Fetch a single product by handle
 * @param handle - Product handle
 */
export const getProductByHandle = async (
  handle: string
): Promise<SimpleProduct | null> => {
  try {
    const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
      {
        query: GET_PRODUCT_BY_HANDLE_QUERY,
        variables: { handle },
      }
    );

    if (!data.productByHandle) {
      return null;
    }

    return transformProduct(data.productByHandle);
  } catch (error) {
    console.error(
      "Error fetching product by handle in getProductByHandle: ",
      error
    );
    throw new Error(`Failed to fetch product with handle: ${handle}`);
  }
};
