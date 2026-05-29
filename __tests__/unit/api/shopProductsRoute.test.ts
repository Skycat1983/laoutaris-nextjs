jest.mock("server-only", () => ({}), { virtual: true });

import { GET } from "@/app/api/v2/public/shop/products/route";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import { REQUEST_ID_HEADER } from "@/lib/observability/requestContext";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      headers: new Headers(init?.headers),
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/data/services/getShopProductList", () => ({
  getShopProductList: jest.fn(),
}));

const mockGetShopProductList = getShopProductList as jest.MockedFunction<
  typeof getShopProductList
>;

const requestId = "req-shop-products";

const createRequest = (url: string) =>
  ({
    method: "GET",
    headers: new Headers({ "x-request-id": requestId }),
    nextUrl: new URL(url),
    url,
  } as never);

const createProduct = (productId: string): SimpleProduct => ({
  id: `gid://shopify/Product/${productId}`,
  handle: `product-${productId}`,
  title: `Product ${productId}`,
  description: "A product used by the shop listing route contract test.",
  descriptionHtml:
    "<p>A product used by the shop listing route contract test.</p>",
  onlineStoreUrl: `https://laoutaris.myshopify.com/products/product-${productId}`,
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

describe("GET /api/v2/public/shop/products", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetShopProductList.mockResolvedValue({
      success: true,
      data: [createProduct("101")],
      metadata: {
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
        totalArtworks: 1,
        totalProducts: 1,
      },
    });
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    expect(consoleLogSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("validates route query params, calls the shared service, and preserves the success envelope", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/shop/products?sortBy=price-low&decade=1970s&decade=1980s&artstyle=abstract&medium=oil&surface=canvas&showOriginals=true&showPrints=false&showBooks=true"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetShopProductList).toHaveBeenCalledWith({
      sortBy: "price-low",
      page: 1,
      limit: 12,
      showOriginals: true,
      showPrints: false,
      showBooks: true,
      decade: ["1970s", "1980s"],
      artstyle: ["abstract"],
      medium: ["oil"],
      surface: ["canvas"],
    });
    expect(body).toEqual({
      success: true,
      data: [createProduct("101")],
      metadata: {
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
        totalArtworks: 1,
        totalProducts: 1,
      },
    });
  });

  it("accepts bounded page and limit params", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/shop/products?page=3&limit=6"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetShopProductList).toHaveBeenCalledWith({
      sortBy: undefined,
      page: 3,
      limit: 6,
      showOriginals: true,
      showPrints: true,
      showBooks: true,
      decade: [],
      artstyle: [],
      medium: [],
      surface: [],
    });
    expect(body.metadata).toEqual({
      page: 1,
      limit: 12,
      total: 1,
      totalPages: 1,
      totalArtworks: 1,
      totalProducts: 1,
    });
  });

  it("returns 400 for invalid repeated filter values before service work", async () => {
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
    expect(mockGetShopProductList).not.toHaveBeenCalled();
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
    expect(mockGetShopProductList).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid page and limit params before service work", async () => {
    const response = await GET(
      createRequest(
        "https://example.test/api/v2/public/shop/products?page=0&limit=51"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Invalid shop products query",
      fieldErrors: {
        page: ["Page must be at least 1"],
        limit: ["Limit must be 50 or less"],
      },
      formErrors: [],
    });
    expect(mockGetShopProductList).not.toHaveBeenCalled();
  });

  it("returns a public-safe 500 envelope when service work fails", async () => {
    mockGetShopProductList.mockRejectedValue(
      new Error("private database detail")
    );

    const response = await GET(
      createRequest("https://example.test/api/v2/public/shop/products")
    );
    const body = await response.json();
    const logPayload = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

    expect(response.status).toBe(500);
    expect(response.headers.get(REQUEST_ID_HEADER)).toBe(requestId);
    expect(body).toEqual({
      success: false,
      error: "Failed to fetch shop products",
      requestId,
    });
    expect(logPayload).toEqual(
      expect.objectContaining({
        requestId,
        route: "/api/v2/public/shop/products",
        method: "GET",
        errorLabel: "shop_products_read_failed",
      })
    );
    expect(JSON.stringify(body)).not.toContain("private database detail");
  });
});
