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
  beforeEach(() => {
    jest.clearAllMocks();
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
});
