// Shopify configuration - reads from environment variables
// Make sure these are set in your .env file:
// SHOPIFY_STORE_DOMAIN=laoutaris.myshopify.com
// SHOPIFY_STOREFRONT_ACCESS_TOKEN=505da68638bfc961864ab6edf282b561

export const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "";
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

// Shopify Storefront API version
export const SHOPIFY_API_VERSION = "2024-10";

// Construct the Shopify Storefront API endpoint
export const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
