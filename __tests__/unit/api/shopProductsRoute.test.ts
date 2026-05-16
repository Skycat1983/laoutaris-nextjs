import { GET } from "@/app/api/v2/public/shop/products/route";
import { getProductById } from "@/lib/api/shopify/shopifyClient";
import { ArtworkModel } from "@/lib/data/models";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import dbConnect from "@/lib/db/mongodb";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/db/mongodb", () => jest.fn());

jest.mock("@/lib/api/shopify/shopifyClient", () => ({
  getProductById: jest.fn(),
}));

jest.mock("@/lib/data/models", () => ({
  ArtworkModel: {
    find: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockGetProductById = getProductById as jest.MockedFunction<
  typeof getProductById
>;
const mockArtworkFind = ArtworkModel.find as jest.Mock;

const createRequest = (url: string) =>
  ({
    nextUrl: new URL(url),
  } as never);

const createProduct = (productId: string): SimpleProduct => ({
  id: `gid://shopify/Product/${productId}`,
  handle: `product-${productId}`,
  title: `Product ${productId}`,
  description: "A product used by the shop listing route contract test.",
  descriptionHtml:
    "<p>A product used by the shop listing route contract test.</p>",
  vendor: "Joseph Laoutaris",
  productType: "original",
  tags: ["archive"],
  price: "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
});

const mockArtworkQuery = (
  artworks: Array<{
    shopifyProducts?: Array<{
      productId: string;
      type: "original" | "print" | "book";
    }>;
  }>
) => {
  const lean = jest.fn().mockResolvedValue(artworks);
  const select = jest.fn(() => ({ lean }));
  mockArtworkFind.mockReturnValue({ select });

  return { select, lean };
};

describe("GET /api/v2/public/shop/products", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

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
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("uses route defaults and preserves the success envelope", async () => {
    const response = await GET(
      createRequest("https://example.test/api/v2/public/shop/products")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockDbConnect).toHaveBeenCalledTimes(1);
    expect(mockArtworkFind).toHaveBeenCalledWith({
      $and: [{ shopifyProducts: { $exists: true, $ne: [] } }],
    });
    expect(mockGetProductById).toHaveBeenCalledTimes(4);
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      1,
      "gid://shopify/Product/101"
    );
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      4,
      "gid://shopify/Product/104"
    );
    expect(body).toEqual({
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
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("normalizes valid filters before building MongoDB conditions", async () => {
    await GET(
      createRequest(
        "https://example.test/api/v2/public/shop/products?sortBy=price-low&decade=1970s&decade=1980s&artstyle=abstract&medium=oil&surface=canvas"
      )
    );

    expect(mockArtworkFind).toHaveBeenCalledWith({
      $and: [
        { shopifyProducts: { $exists: true, $ne: [] } },
        { decade: { $in: ["1970s", "1980s"] } },
        { artstyle: { $in: ["abstract"] } },
        { medium: { $in: ["oil"] } },
        { surface: { $in: ["canvas"] } },
      ],
    });
  });

  it("honors valid false product-type filters", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/shop/products?showOriginals=false&showPrints=false&showBooks=true"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetProductById).toHaveBeenCalledTimes(1);
    expect(mockGetProductById).toHaveBeenCalledWith(
      "gid://shopify/Product/103"
    );
    expect(body.metadata).toEqual({
      totalArtworks: 2,
      totalProducts: 1,
    });
  });

  it("skips invalid stored product IDs before calling Shopify", async () => {
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

    const response = await GET(
      createRequest("https://example.test/api/v2/public/shop/products")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetProductById).toHaveBeenCalledTimes(1);
    expect(mockGetProductById).toHaveBeenCalledWith(
      "gid://shopify/Product/201"
    );
    expect(body).toEqual({
      success: true,
      data: [createProduct("201")],
      metadata: {
        totalArtworks: 1,
        totalProducts: 1,
      },
    });
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

    const response = await GET(
      createRequest("https://example.test/api/v2/public/shop/products")
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetProductById).toHaveBeenCalledTimes(2);
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      1,
      "gid://shopify/Product/301"
    );
    expect(mockGetProductById).toHaveBeenNthCalledWith(
      2,
      "gid://shopify/Product/302"
    );
    expect(body.metadata).toEqual({
      totalArtworks: 2,
      totalProducts: 2,
    });
  });

  it("returns 400 for invalid repeated filter values before DB or Shopify work", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/shop/products?decade=1900s&artstyle=cubist&medium=stone&surface=metal"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid shop products query",
      fieldErrors: {
        decade: ["Decade filter contains an invalid value"],
        artstyle: ["Art style filter contains an invalid value"],
        medium: ["Medium filter contains an invalid value"],
        surface: ["Surface filter contains an invalid value"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockArtworkFind).not.toHaveBeenCalled();
    expect(mockGetProductById).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid product-type booleans and sort options", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/shop/products?showOriginals=0&showPrints=yes&showBooks=&sortBy=newest"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid shop products query",
      fieldErrors: {
        sortBy: [
          "Sort option must be type, price-low, price-high, title-asc, or title-desc",
        ],
        showOriginals: ["showOriginals must be true or false"],
        showPrints: ["showPrints must be true or false"],
        showBooks: ["showBooks must be true or false"],
      },
      formErrors: [],
    });
    expect(mockDbConnect).not.toHaveBeenCalled();
    expect(mockArtworkFind).not.toHaveBeenCalled();
    expect(mockGetProductById).not.toHaveBeenCalled();
  });

  it("returns a public-safe 500 envelope when internal work fails", async () => {
    mockArtworkFind.mockImplementation(() => {
      throw new Error("private database detail");
    });

    const response = await GET(
      createRequest("https://example.test/api/v2/public/shop/products")
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      error: "Failed to fetch shop products",
    });
  });
});
