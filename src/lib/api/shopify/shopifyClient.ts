import {
  SHOPIFY_GRAPHQL_URL,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN,
} from "@/lib/config/shopifyConfig";
import {
  ShopifyProductsResponse,
  ShopifyProduct,
  SimpleProduct,
} from "@/lib/data/types/shopify";
import { createServerLogger } from "@/lib/observability/logger";
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_BY_ID_QUERY,
} from "./queries";

const shopifyProviderLogger = createServerLogger({
  surface: "shopify_provider",
  operation: "shopify.storefront_api",
});

const shopifyTransformLogger = createServerLogger({
  surface: "shopify_provider",
  operation: "shopify.product_transform",
});

const getStatusCategory = (status: number) =>
  status >= 100 && status < 600 ? `${Math.floor(status / 100)}xx` : "unknown";

const getPublicProductIdFromGid = (id: string) =>
  id.match(/^gid:\/\/shopify\/Product\/(\d+)$/)?.[1];

const getErrorForLog = (error: unknown) =>
  error instanceof Error ? error : new Error("Unknown Shopify provider error");

const getGraphqlErrorCount = (errors: unknown) =>
  Array.isArray(errors) ? errors.length : 1;

class LoggedShopifyFetchError extends Error {}

/**
 * Make a GraphQL request to Shopify Storefront API
 */
const getShopifyFetchCachePolicy = () =>
  process.env.NODE_ENV === "development"
    ? ({ cache: "no-store" } as const)
    : ({ next: { revalidate: 3600 } } as const);

const shopifyFetch = async <T>({
  query,
  variables = {},
  shopifyOperation,
  publicProductId,
  publicProductHandle,
}: {
  query: string;
  variables?: Record<string, unknown>;
  shopifyOperation: string;
  publicProductId?: string;
  publicProductHandle?: string;
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
      ...getShopifyFetchCachePolicy(),
    });

    if (!response.ok) {
      shopifyProviderLogger.error("provider.shopify.storefront.http_failed", {
        provider: "shopify",
        shopifyOperation,
        status: response.status,
        statusCategory: getStatusCategory(response.status),
        publicProductId,
        publicProductHandle,
      });
      throw new LoggedShopifyFetchError(
        `Shopify API error in shopifyFetch: ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json();

    if (json.errors) {
      shopifyProviderLogger.error("provider.shopify.storefront.graphql_failed", {
        provider: "shopify",
        shopifyOperation,
        statusCategory: "graphql_error",
        graphqlErrorCount: getGraphqlErrorCount(json.errors),
        publicProductId,
        publicProductHandle,
      });
      throw new LoggedShopifyFetchError("GraphQL errors in shopifyFetch");
    }

    return json.data as T;
  } catch (error) {
    if (!(error instanceof LoggedShopifyFetchError)) {
      shopifyProviderLogger.error("provider.shopify.storefront.fetch_failed", {
        provider: "shopify",
        shopifyOperation,
        statusCategory: "request_failed",
        publicProductId,
        publicProductHandle,
        error: getErrorForLog(error),
      });
    }
    throw error;
  }
};

/**
 * Transform Shopify product to simplified format for UI
 */
const transformProduct = (product: ShopifyProduct): SimpleProduct => {
  const variantEdges = product.variants.edges;
  const firstVariant = variantEdges[0]?.node;
  const firstImage = product.images.edges[0]?.node;
  const variants = variantEdges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    availableForSale: node.availableForSale,
    price: {
      amount: node.price.amount,
      currencyCode: node.price.currencyCode,
    },
    compareAtPrice: node.compareAtPrice
      ? {
          amount: node.compareAtPrice.amount,
          currencyCode: node.compareAtPrice.currencyCode,
        }
      : null,
    image: node.image
      ? {
          url: node.image.url,
          altText: node.image.altText,
        }
      : null,
  }));

  // Extract metafields - filter out null values first
  const validMetafields = product.metafields?.filter(Boolean) || [];

  const mongodbArtworkId = validMetafields.find(
    (m) => m.key === "mongodb_artwork_id"
  )?.value;

  const featuredArtworkIdsRaw = validMetafields.find(
    (m) => m.key === "featured_artwork_ids"
  )?.value;

  let featuredArtworkIds: string[] | undefined;
  if (featuredArtworkIdsRaw) {
    try {
      featuredArtworkIds = JSON.parse(featuredArtworkIdsRaw);
    } catch {
      shopifyTransformLogger.warn("provider.shopify.metafield_parse.failed", {
        provider: "shopify",
        shopifyOperation: "transformProduct",
        metafieldKey: "featured_artwork_ids",
        publicProductId: getPublicProductIdFromGid(product.id),
        publicProductHandle: product.handle,
      });
    }
  }

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    vendor: product.vendor,
    productType: product.productType || "",
    tags: Array.isArray(product.tags) ? product.tags : [],
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
    variants,
    mongodbArtworkId,
    featuredArtworkIds,
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
      shopifyOperation: "getProducts",
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
    shopifyProviderLogger.error("provider.shopify.product_list.failed", {
      provider: "shopify",
      shopifyOperation: "getProducts",
      statusCategory: "request_failed",
      error: getErrorForLog(error),
    });
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
        shopifyOperation: "getProductByHandle",
        publicProductHandle: handle,
      }
    );

    if (!data.productByHandle) {
      return null;
    }

    return transformProduct(data.productByHandle);
  } catch (error) {
    shopifyProviderLogger.error("provider.shopify.product_by_handle.failed", {
      provider: "shopify",
      shopifyOperation: "getProductByHandle",
      statusCategory: "request_failed",
      publicProductHandle: handle,
      error: getErrorForLog(error),
    });
    throw new Error(`Failed to fetch product with handle: ${handle}`);
  }
};

/**
 * Fetch a single product by ID
 * @param id - Product GID (e.g., "gid://shopify/Product/123456")
 */
export const getProductById = async (
  id: string
): Promise<SimpleProduct | null> => {
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
      query: GET_PRODUCT_BY_ID_QUERY,
      variables: { id },
      shopifyOperation: "getProductById",
      publicProductId: getPublicProductIdFromGid(id),
    });

    if (!data.product) {
      return null;
    }

    return transformProduct(data.product);
  } catch (error) {
    shopifyProviderLogger.error("provider.shopify.product_by_id.failed", {
      provider: "shopify",
      shopifyOperation: "getProductById",
      statusCategory: "request_failed",
      publicProductId: getPublicProductIdFromGid(id),
      error: getErrorForLog(error),
    });
    throw new Error(`Failed to fetch product with ID: ${id}`);
  }
};
