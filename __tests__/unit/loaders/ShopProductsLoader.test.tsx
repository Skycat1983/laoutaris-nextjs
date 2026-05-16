import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { ShopProductsLoader } from "@/components/loaders/viewLoaders/ShopProductsLoader";
import { ShopProductGallery } from "@/components/compositions/ShopProductGallery";
import type { SimpleProduct } from "@/lib/data/types/shopify";

jest.mock("@/components/compositions/ShopProductGallery", () => ({
  ShopProductGallery: jest.fn(() => null),
}));

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
const mockShopProductGallery = ShopProductGallery as jest.MockedFunction<
  typeof ShopProductGallery
>;

const product: SimpleProduct = {
  id: "gid://shopify/Product/101",
  handle: "test-product",
  title: "Test Product",
  description: "A product used by the shop products loader test.",
  descriptionHtml: "<p>A product used by the shop products loader test.</p>",
  vendor: "Joseph Laoutaris",
  productType: "original",
  tags: ["archive"],
  price: "100.00",
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
};

const createJsonResponse = (body: unknown, ok = true, statusText = "OK") =>
  ({
    ok,
    statusText,
    json: async () => body,
  } as Response);

describe("ShopProductsLoader", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.test";
    mockFetch.mockResolvedValue(
      createJsonResponse({
        success: true,
        data: [product],
        metadata: {
          totalArtworks: 1,
          totalProducts: 1,
        },
      })
    );
    consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    if (originalBaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
    }
    expect(consoleLogSpy).not.toHaveBeenCalled();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("loads products with backed filters and passes them to the gallery", async () => {
    const initialFilters = {
      artstyle: "abstract" as const,
      medium: "oil" as const,
      surface: "canvas" as const,
      decade: "1970s" as const,
      showOriginals: true,
      showPrints: false,
      showBooks: true,
      sortBy: "type" as const,
    };

    const element = (await ShopProductsLoader({
      initialFilters,
    })) as ReactElement<{
      initialProducts: SimpleProduct[];
      initialFilters: typeof initialFilters;
    }>;

    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.test/api/v2/public/shop/products?artstyle=abstract&medium=oil&surface=canvas&decade=1970s&showOriginals=true&showPrints=false&showBooks=true",
      { cache: "no-store" }
    );
    expect(element.type).toBe(ShopProductGallery);
    expect(element.props).toEqual({
      initialProducts: [product],
      initialFilters,
    });
    expect(mockShopProductGallery).not.toHaveBeenCalled();
  });

  it("shows a neutral retry hint when product loading fails", async () => {
    mockFetch.mockResolvedValue(createJsonResponse({}, false, "Bad Gateway"));

    render(await ShopProductsLoader({}));

    expect(
      screen.getByText("Failed to fetch products: Bad Gateway")
    ).toBeInTheDocument();
    expect(screen.queryByText(/check the console/i)).not.toBeInTheDocument();
    expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
  });
});
