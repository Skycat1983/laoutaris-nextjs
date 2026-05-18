jest.mock("server-only", () => ({}), { virtual: true });

import { getProductById } from "@/lib/api/shopify/shopifyClient";
import { getArtworkShopProducts } from "@/lib/data/services/getArtworkShopProducts";
import type { SimpleProduct } from "@/lib/data/types/shopify";

jest.mock("@/lib/api/shopify/shopifyClient", () => ({
  getProductById: jest.fn(),
}));

const mockGetProductById = getProductById as jest.MockedFunction<
  typeof getProductById
>;

const createProduct = (
  productId: string,
  overrides: Partial<SimpleProduct> = {}
): SimpleProduct => ({
  id: `gid://shopify/Product/${productId}`,
  handle: `product-${productId}`,
  title: `Product ${productId}`,
  description: "A product used by the artwork shop product service test.",
  descriptionHtml:
    "<p>A product used by the artwork shop product service test.</p>",
  vendor: "Joseph Laoutaris",
  productType: "original",
  tags: ["archive"],
  price: "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
  ...overrides,
});

describe("getArtworkShopProducts", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProductById.mockImplementation((gid) => {
      const gidParts = gid.split("/");
      return Promise.resolve(createProduct(gidParts[gidParts.length - 1]));
    });
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("resolves artwork Shopify links into grouped server-side product summaries", async () => {
    await expect(
      getArtworkShopProducts([
        { productId: "101", type: "original" },
        { productId: "102", type: "print" },
        { productId: "103", type: "book" },
      ])
    ).resolves.toEqual({
      original: createProduct("101"),
      prints: [createProduct("102")],
      books: [createProduct("103")],
    });

    expect(mockGetProductById).toHaveBeenCalledTimes(3);
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      1,
      "gid://shopify/Product/101"
    );
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      2,
      "gid://shopify/Product/102"
    );
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      3,
      "gid://shopify/Product/103"
    );
  });

  it("skips malformed, unavailable, missing, and failed products without failing the artwork page", async () => {
    mockGetProductById.mockImplementation((gid) => {
      if (gid.endsWith("/202")) {
        return Promise.resolve(null);
      }

      if (gid.endsWith("/203")) {
        return Promise.resolve(
          createProduct("203", { availableForSale: false })
        );
      }

      if (gid.endsWith("/204")) {
        return Promise.reject(new Error("private Shopify failure"));
      }

      const gidParts = gid.split("/");
      return Promise.resolve(createProduct(gidParts[gidParts.length - 1]));
    });

    await expect(
      getArtworkShopProducts([
        { productId: "201", type: "print" },
        { productId: "gid://shopify/Product/999", type: "print" },
        { productId: "202", type: "book" },
        { productId: "203", type: "book" },
        { productId: "204", type: "original" },
      ])
    ).resolves.toEqual({
      original: null,
      prints: [createProduct("201")],
      books: [],
    });

    expect(mockGetProductById).toHaveBeenCalledTimes(4);
    expect(mockGetProductById).not.toHaveBeenCalledWith(
      "gid://shopify/Product/999"
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Artwork shop products service - Failed to fetch product 204:",
      expect.any(Error)
    );
  });

  it("returns empty groups when an artwork has no Shopify product links", async () => {
    await expect(getArtworkShopProducts(undefined)).resolves.toEqual({
      original: null,
      prints: [],
      books: [],
    });

    expect(mockGetProductById).not.toHaveBeenCalled();
  });
});
