import { GET } from "@/app/api/v2/public/shop/products/[productId]/route";
import { getProductById } from "@/lib/api/shopify/shopifyClient";
import { SimpleProduct } from "@/lib/data/types/shopify";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
}));

jest.mock("@/lib/api/shopify/shopifyClient", () => ({
  getProductById: jest.fn(),
}));

const mockGetProductById = getProductById as jest.MockedFunction<
  typeof getProductById
>;

const request = {} as never;

const createParams = (productId: string) => ({
  params: { productId },
});

const product: SimpleProduct = {
  id: "gid://shopify/Product/123456",
  handle: "test-product",
  title: "Test Product",
  description: "A product used by the route contract test.",
  vendor: "Joseph Laoutaris",
  price: "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
};

describe("GET /api/v2/public/shop/products/[productId]", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns a success envelope and calls Shopify with a product GID", async () => {
    mockGetProductById.mockResolvedValue(product);

    const response = await GET(request, createParams("123456"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetProductById).toHaveBeenCalledWith(
      "gid://shopify/Product/123456"
    );
    expect(body).toEqual({
      success: true,
      data: product,
    });
  });

  it.each(["", "abc123", "gid%3A%2F%2Fshopify%2FProduct%2F123456"])(
    "returns 400 for invalid product ID %p without calling Shopify",
    async (productId) => {
      const response = await GET(request, createParams(productId));
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(mockGetProductById).not.toHaveBeenCalled();
      expect(body).toEqual({
        success: false,
        error: "Product ID must be a numeric Shopify product ID",
      });
    }
  );

  it("returns 404 when Shopify returns no product", async () => {
    mockGetProductById.mockResolvedValue(null);

    const response = await GET(request, createParams("123456"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(mockGetProductById).toHaveBeenCalledWith(
      "gid://shopify/Product/123456"
    );
    expect(body).toEqual({
      success: false,
      error: "Product not found",
    });
  });

  it("returns a public-safe upstream error envelope when Shopify throws", async () => {
    mockGetProductById.mockRejectedValue(new Error("private upstream detail"));

    const response = await GET(request, createParams("123456"));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(mockGetProductById).toHaveBeenCalledWith(
      "gid://shopify/Product/123456"
    );
    expect(body).toEqual({
      success: false,
      error: "Failed to fetch product",
    });
  });
});
