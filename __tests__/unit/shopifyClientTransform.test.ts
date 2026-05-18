jest.mock("server-only", () => ({}), { virtual: true });

import {
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_BY_ID_QUERY,
  GET_PRODUCTS_QUERY,
} from "@/lib/api/shopify/queries";
import {
  getProductByHandle,
  getProductById,
  getProducts,
} from "@/lib/api/shopify/shopifyClient";
import type { ShopifyProduct } from "@/lib/data/types/shopify";

const createShopifyProduct = (
  overrides: Partial<ShopifyProduct> = {}
): ShopifyProduct => ({
  id: "gid://shopify/Product/123456",
  handle: "test-product",
  title: "Test Product",
  description: "A product used by Shopify transform tests.",
  descriptionHtml: "<p>A product used by Shopify transform tests.</p>",
  vendor: "Joseph Laoutaris",
  productType: "Original Artwork",
  tags: ["archive", "featured"],
  availableForSale: true,
  images: {
    edges: [
      {
        node: {
          id: "gid://shopify/ProductImage/1",
          url: "https://example.test/product.jpg",
          altText: "Product image",
          width: 1200,
          height: 1200,
        },
      },
    ],
  },
  variants: {
    edges: [
      {
        node: {
          id: "gid://shopify/ProductVariant/1",
          title: "Default Title",
          price: {
            amount: "100.00",
            currencyCode: "GBP",
          },
          compareAtPrice: null,
          availableForSale: true,
          image: null,
        },
      },
    ],
  },
  priceRange: {
    minVariantPrice: {
      amount: "100.00",
      currencyCode: "GBP",
    },
    maxVariantPrice: {
      amount: "100.00",
      currencyCode: "GBP",
    },
  },
  metafields: [],
  ...overrides,
});

const mockShopifyResponse = (data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data }),
  });
};

describe("Shopify product transforms", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  const setNodeEnv = (value: string) => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value,
      configurable: true,
      writable: true,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setNodeEnv(originalNodeEnv);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  afterAll(() => {
    setNodeEnv(originalNodeEnv);
  });

  it("sends only no-store cache policy for development Shopify reads", async () => {
    setNodeEnv("development");
    mockShopifyResponse({
      productByHandle: createShopifyProduct(),
    });

    await getProductByHandle("test-product");

    const [, requestInit] = (global.fetch as jest.Mock).mock.calls[0];

    expect(requestInit).toEqual(
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": expect.any(String),
        }),
      })
    );
    expect(requestInit).not.toHaveProperty("next");
    expect(JSON.parse(requestInit.body)).toEqual({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle: "test-product" },
    });
  });

  it("sends only revalidation policy for production Shopify reads", async () => {
    setNodeEnv("production");
    mockShopifyResponse({
      products: {
        edges: [
          {
            node: createShopifyProduct(),
          },
        ],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      },
    });

    await getProducts(12, "cursor-1");

    const [, requestInit] = (global.fetch as jest.Mock).mock.calls[0];

    expect(requestInit).toEqual(
      expect.objectContaining({
        method: "POST",
        next: { revalidate: 3600 },
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": expect.any(String),
        }),
      })
    );
    expect(requestInit).not.toHaveProperty("cache");
    expect(JSON.parse(requestInit.body)).toEqual({
      query: GET_PRODUCTS_QUERY,
      variables: { first: 12, after: "cursor-1" },
    });
  });

  it("preserves Shopify ID read request variables and query body", async () => {
    mockShopifyResponse({
      product: createShopifyProduct(),
    });

    await getProductById("gid://shopify/Product/123456");

    const [, requestInit] = (global.fetch as jest.Mock).mock.calls[0];

    expect(JSON.parse(requestInit.body)).toEqual({
      query: GET_PRODUCT_BY_ID_QUERY,
      variables: { id: "gid://shopify/Product/123456" },
    });
  });

  it("preserves productType and tags for product list reads", async () => {
    mockShopifyResponse({
      products: {
        edges: [
          {
            node: createShopifyProduct({
              productType: "Book",
              tags: ["publication", "catalogue"],
            }),
          },
        ],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      },
    });

    const result = await getProducts();

    expect(result.products[0]).toEqual(
      expect.objectContaining({
        productType: "Book",
        tags: ["publication", "catalogue"],
      })
    );
  });

  it("preserves plain and HTML descriptions for product list reads", async () => {
    mockShopifyResponse({
      products: {
        edges: [
          {
            node: createShopifyProduct({
              description: "Plain list description.",
              descriptionHtml:
                "<p>Plain <strong>list</strong> description.</p>",
            }),
          },
        ],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      },
    });

    const result = await getProducts();

    expect(result.products[0]).toEqual(
      expect.objectContaining({
        description: "Plain list description.",
        descriptionHtml: "<p>Plain <strong>list</strong> description.</p>",
      })
    );
  });

  it("preserves multiple variants in Shopify order for product list reads", async () => {
    mockShopifyResponse({
      products: {
        edges: [
          {
            node: createShopifyProduct({
              variants: {
                edges: [
                  {
                    node: {
                      id: "gid://shopify/ProductVariant/first",
                      title: "Framed",
                      price: {
                        amount: "150.00",
                        currencyCode: "GBP",
                      },
                      compareAtPrice: null,
                      availableForSale: true,
                      image: null,
                    },
                  },
                  {
                    node: {
                      id: "gid://shopify/ProductVariant/second",
                      title: "Unframed",
                      price: {
                        amount: "125.00",
                        currencyCode: "GBP",
                      },
                      compareAtPrice: null,
                      availableForSale: false,
                      image: null,
                    },
                  },
                ],
              },
            }),
          },
        ],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      },
    });

    const result = await getProducts();

    expect(result.products[0].variants).toEqual([
      {
        id: "gid://shopify/ProductVariant/first",
        title: "Framed",
        availableForSale: true,
        price: {
          amount: "150.00",
          currencyCode: "GBP",
        },
        compareAtPrice: null,
        image: null,
      },
      {
        id: "gid://shopify/ProductVariant/second",
        title: "Unframed",
        availableForSale: false,
        price: {
          amount: "125.00",
          currencyCode: "GBP",
        },
        compareAtPrice: null,
        image: null,
      },
    ]);
  });

  it("preserves productType and tags for handle reads", async () => {
    mockShopifyResponse({
      productByHandle: createShopifyProduct({
        productType: "Limited Edition Print",
        tags: ["print", "edition"],
      }),
    });

    const result = await getProductByHandle("test-product");

    expect(result).toEqual(
      expect.objectContaining({
        productType: "Limited Edition Print",
        tags: ["print", "edition"],
      })
    );
  });

  it("preserves plain and HTML descriptions for handle reads", async () => {
    mockShopifyResponse({
      productByHandle: createShopifyProduct({
        description: "Plain handle description.",
        descriptionHtml:
          "<p>Plain <em>handle</em> description with a line break.<br></p>",
      }),
    });

    const result = await getProductByHandle("test-product");

    expect(result).toEqual(
      expect.objectContaining({
        description: "Plain handle description.",
        descriptionHtml:
          "<p>Plain <em>handle</em> description with a line break.<br></p>",
      })
    );
  });

  it("preserves variant compare-at price and image handling for handle reads", async () => {
    mockShopifyResponse({
      productByHandle: createShopifyProduct({
        variants: {
          edges: [
            {
              node: {
                id: "gid://shopify/ProductVariant/with-image",
                title: "Signed Edition",
                price: {
                  amount: "90.00",
                  currencyCode: "GBP",
                },
                compareAtPrice: {
                  amount: "120.00",
                  currencyCode: "GBP",
                },
                availableForSale: true,
                image: {
                  id: "gid://shopify/ProductImage/variant",
                  url: "https://example.test/variant.jpg",
                  altText: "Variant image",
                  width: 800,
                  height: 800,
                },
              },
            },
            {
              node: {
                id: "gid://shopify/ProductVariant/no-image",
                title: "Archive Copy",
                price: {
                  amount: "75.00",
                  currencyCode: "GBP",
                },
                compareAtPrice: null,
                availableForSale: false,
                image: null,
              },
            },
          ],
        },
      }),
    });

    const result = await getProductByHandle("test-product");

    expect(result?.variants).toEqual([
      {
        id: "gid://shopify/ProductVariant/with-image",
        title: "Signed Edition",
        availableForSale: true,
        price: {
          amount: "90.00",
          currencyCode: "GBP",
        },
        compareAtPrice: {
          amount: "120.00",
          currencyCode: "GBP",
        },
        image: {
          url: "https://example.test/variant.jpg",
          altText: "Variant image",
        },
      },
      {
        id: "gid://shopify/ProductVariant/no-image",
        title: "Archive Copy",
        availableForSale: false,
        price: {
          amount: "75.00",
          currencyCode: "GBP",
        },
        compareAtPrice: null,
        image: null,
      },
    ]);
  });

  it("preserves productType and tags for ID reads", async () => {
    mockShopifyResponse({
      product: createShopifyProduct({
        productType: "Original Artwork",
        tags: ["painting", "available"],
      }),
    });

    const result = await getProductById("gid://shopify/Product/123456");

    expect(result).toEqual(
      expect.objectContaining({
        productType: "Original Artwork",
        tags: ["painting", "available"],
      })
    );
  });

  it("preserves plain and HTML descriptions for ID reads", async () => {
    mockShopifyResponse({
      product: createShopifyProduct({
        description: "Plain ID description.",
        descriptionHtml: "<div><p>Plain ID description.</p></div>",
      }),
    });

    const result = await getProductById("gid://shopify/Product/123456");

    expect(result).toEqual(
      expect.objectContaining({
        description: "Plain ID description.",
        descriptionHtml: "<div><p>Plain ID description.</p></div>",
      })
    );
  });

  it("returns an empty variant list while preserving top-level price fallback for ID reads without variants", async () => {
    mockShopifyResponse({
      product: createShopifyProduct({
        variants: {
          edges: [],
        },
        priceRange: {
          minVariantPrice: {
            amount: "80.00",
            currencyCode: "GBP",
          },
          maxVariantPrice: {
            amount: "100.00",
            currencyCode: "GBP",
          },
        },
      }),
    });

    const result = await getProductById("gid://shopify/Product/123456");

    expect(result).toEqual(
      expect.objectContaining({
        price: "80.00",
        currencyCode: "GBP",
        compareAtPrice: null,
        variants: [],
      })
    );
  });

  it("logs malformed featured artwork metafields without dumping the raw metafield value", async () => {
    mockShopifyResponse({
      product: createShopifyProduct({
        id: "gid://shopify/Product/123456",
        handle: "book-product",
        metafields: [
          {
            namespace: "custom",
            key: "featured_artwork_ids",
            value: "{\"raw\":\"provider payload\"",
            type: "json",
          },
        ],
      }),
    });

    const result = await getProductById("gid://shopify/Product/123456");

    expect(result?.featuredArtworkIds).toBeUndefined();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(consoleWarnSpy.mock.calls[0][0]);
    expect(payload).toEqual(
      expect.objectContaining({
        level: "warn",
        event: "provider.shopify.metafield_parse.failed",
        surface: "shopify_provider",
        operation: "shopify.product_transform",
        provider: "shopify",
        shopifyOperation: "transformProduct",
        metafieldKey: "featured_artwork_ids",
        publicProductId: "123456",
        publicProductHandle: "book-product",
      })
    );
    expect(consoleWarnSpy.mock.calls[0][0]).not.toContain("provider payload");
  });

  it("logs GraphQL failures with a count and without raw provider error arrays", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        errors: [
          {
            message: "private provider detail",
            extensions: {
              token: "secret-token",
            },
          },
        ],
      }),
    });

    await expect(getProducts()).rejects.toThrow(
      "Failed to fetch products from Shopify"
    );

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    const payloads = consoleErrorSpy.mock.calls.map(([line]) => JSON.parse(line));
    expect(payloads[0]).toEqual(
      expect.objectContaining({
        level: "error",
        event: "provider.shopify.storefront.graphql_failed",
        surface: "shopify_provider",
        operation: "shopify.storefront_api",
        provider: "shopify",
        shopifyOperation: "getProducts",
        statusCategory: "graphql_error",
        graphqlErrorCount: 1,
      })
    );
    expect(payloads[1]).toEqual(
      expect.objectContaining({
        level: "error",
        event: "provider.shopify.product_list.failed",
        provider: "shopify",
        shopifyOperation: "getProducts",
        statusCategory: "request_failed",
        error: {
          name: "Error",
          message: "GraphQL errors in shopifyFetch",
        },
      })
    );
    expect(consoleErrorSpy.mock.calls.join("\n")).not.toContain(
      "private provider detail"
    );
    expect(consoleErrorSpy.mock.calls.join("\n")).not.toContain("secret-token");
  });
});
