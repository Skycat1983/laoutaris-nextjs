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
});
