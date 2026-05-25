jest.mock("server-only", () => ({}), { virtual: true });

import { getProductById } from "@/lib/api/shopify/shopifyClient";
import { ArtworkModel } from "@/lib/data/models/artworkModel";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import dbConnect from "@/lib/db/mongodb";

jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/lib/api/shopify/shopifyClient", () => ({
  getProductById: jest.fn(),
}));

jest.mock("@/lib/data/models/artworkModel", () => ({
  ArtworkModel: {
    find: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockGetProductById = getProductById as jest.MockedFunction<
  typeof getProductById
>;
const mockArtworkFind = ArtworkModel.find as jest.Mock;

const createProduct = (
  productId: string,
  overrides: Partial<SimpleProduct> = {}
): SimpleProduct => ({
  id: `gid://shopify/Product/${productId}`,
  handle: `product-${productId}`,
  title: overrides.title ?? `Product ${productId}`,
  description: "A product used by the shop listing service test.",
  descriptionHtml: "<p>A product used by the shop listing service test.</p>",
  vendor: "Joseph Laoutaris",
  productType: overrides.productType ?? "original",
  tags: ["archive"],
  price: overrides.price ?? "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
  ...overrides,
});

const mockArtworkQuery = (
  artworks: Array<{
    shopifyProducts?: Array<{
      productId: string;
      type: "original" | "print" | "book";
    }>;
  }>
) => {
  const query = {
    select: jest.fn(),
    lean: jest.fn().mockResolvedValue(artworks),
  };
  query.select.mockReturnValue(query);
  mockArtworkFind.mockReturnValue(query);

  return query;
};

describe("getShopProductList", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined as never);
    mockArtworkQuery([
      {
        shopifyProducts: [
          { productId: "101", type: "original" },
          { productId: "102", type: "print" },
          { productId: "103", type: "book" },
          { productId: "101", type: "original" },
        ],
      },
      {
        shopifyProducts: [{ productId: "104", type: "print" }],
      },
    ]);
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

  it("uses MongoDB ownership, default product type filters, deduplication, Shopify fan-out, and metadata", async () => {
    const query = mockArtworkQuery([
      {
        shopifyProducts: [
          { productId: "101", type: "original" },
          { productId: "102", type: "print" },
          { productId: "103", type: "book" },
          { productId: "101", type: "original" },
        ],
      },
      {
        shopifyProducts: [{ productId: "104", type: "print" }],
      },
    ]);

    await expect(getShopProductList()).resolves.toEqual({
      success: true,
      data: [
        createProduct("101"),
        createProduct("102"),
        createProduct("103"),
        createProduct("104"),
      ],
      metadata: {
        totalArtworks: 2,
        totalProducts: 4,
      },
    });

    expect(mockDbConnect.mock.invocationCallOrder[0]).toBeLessThan(
      mockArtworkFind.mock.invocationCallOrder[0]
    );
    expect(mockArtworkFind).toHaveBeenCalledWith({
      $and: [{ shopifyProducts: { $exists: true, $ne: [] } }],
    });
    expect(query.select).toHaveBeenCalledWith("shopifyProducts");
    expect(query.lean).toHaveBeenCalledTimes(1);
    expect(mockGetProductById).toHaveBeenCalledTimes(4);
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      1,
      "gid://shopify/Product/101"
    );
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      4,
      "gid://shopify/Product/104"
    );
  });

  it("builds MongoDB conditions from valid filters and honors product type filters", async () => {
    const response = await getShopProductList({
      decade: ["1970s", "1980s"],
      artstyle: ["abstract"],
      medium: ["oil"],
      surface: ["canvas"],
      showOriginals: false,
      showPrints: false,
      showBooks: true,
    });

    expect(mockArtworkFind).toHaveBeenCalledWith({
      $and: [
        { shopifyProducts: { $exists: true, $ne: [] } },
        { decade: { $in: ["1970s", "1980s"] } },
        { artstyle: { $in: ["abstract"] } },
        { medium: { $in: ["oil"] } },
        { surface: { $in: ["canvas"] } },
      ],
    });
    expect(mockGetProductById).toHaveBeenCalledTimes(1);
    expect(mockGetProductById).toHaveBeenCalledWith(
      "gid://shopify/Product/103"
    );
    expect(response.metadata).toEqual({
      totalArtworks: 2,
      totalProducts: 1,
    });
  });

  it("skips malformed stored product IDs before calling Shopify", async () => {
    mockArtworkQuery([
      {
        shopifyProducts: [
          { productId: "201", type: "original" },
          { productId: "gid://shopify/Product/202", type: "print" },
          { productId: "not-a-product-id", type: "book" },
          { productId: "", type: "book" },
        ],
      },
    ]);

    await expect(getShopProductList()).resolves.toEqual({
      success: true,
      data: [createProduct("201")],
      metadata: {
        totalArtworks: 1,
        totalProducts: 1,
      },
    });

    expect(mockGetProductById).toHaveBeenCalledTimes(1);
    expect(mockGetProductById).toHaveBeenCalledWith(
      "gid://shopify/Product/201"
    );
  });

  it("deduplicates product IDs after normalization", async () => {
    mockArtworkQuery([
      {
        shopifyProducts: [
          { productId: "301", type: "original" },
          { productId: " 301 ", type: "print" },
          { productId: "302", type: "book" },
        ],
      },
      {
        shopifyProducts: [{ productId: "302", type: "book" }],
      },
    ]);

    const result = await getShopProductList();

    expect(mockGetProductById).toHaveBeenCalledTimes(2);
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      1,
      "gid://shopify/Product/301"
    );
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      2,
      "gid://shopify/Product/302"
    );
    expect(result.metadata).toEqual({
      totalArtworks: 2,
      totalProducts: 2,
    });
  });

  it("applies the route-backed sort option before returning products", async () => {
    mockArtworkQuery([
      {
        shopifyProducts: [
          { productId: "501", type: "original" },
          { productId: "502", type: "print" },
          { productId: "503", type: "book" },
        ],
      },
    ]);
    mockGetProductById.mockImplementation((gid) => {
      if (gid.endsWith("/501")) {
        return Promise.resolve(
          createProduct("501", {
            title: "Middle Original",
            productType: "Original Artwork",
            price: "30.00",
          })
        );
      }
      if (gid.endsWith("/502")) {
        return Promise.resolve(
          createProduct("502", {
            title: "Lowest Print",
            productType: "Limited Edition Print",
            price: "10.00",
          })
        );
      }

      return Promise.resolve(
        createProduct("503", {
          title: "Highest Book",
          productType: "Book",
          price: "50.00",
        })
      );
    });

    const result = await getShopProductList({ sortBy: "price-high" });

    expect(result.data.map((product) => product.title)).toEqual([
      "Highest Book",
      "Middle Original",
      "Lowest Print",
    ]);
  });

  it("skips products that fail during Shopify fan-out", async () => {
    mockArtworkQuery([
      {
        shopifyProducts: [
          { productId: "401", type: "original" },
          { productId: "402", type: "print" },
        ],
      },
    ]);
    mockGetProductById.mockImplementation((gid) => {
      if (gid.endsWith("/402")) {
        return Promise.reject(new Error("private Shopify failure"));
      }

      return Promise.resolve(createProduct("401"));
    });

    await expect(getShopProductList()).resolves.toEqual({
      success: true,
      data: [createProduct("401")],
      metadata: {
        totalArtworks: 1,
        totalProducts: 1,
      },
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
    expect(payload).toEqual(
      expect.objectContaining({
        level: "error",
        event: "service.shopify.product_fetch.failed",
        surface: "data_service",
        operation: "shopify.product_list",
        provider: "shopify",
        shopifyOperation: "getProductById",
        statusCategory: "product_fanout_failed",
        publicProductId: "402",
        error: {
          name: "Error",
          message: "private Shopify failure",
        },
      })
    );
  });
});
