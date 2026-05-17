import type { ReactElement } from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { ShopProductsLoader } from "@/components/loaders/viewLoaders/ShopProductsLoader";
import { ShopProductGallery } from "@/components/compositions/ShopProductGallery";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import type { SimpleProduct } from "@/lib/data/types/shopify";

jest.mock("@/lib/data/services/getShopProductList", () => ({
  getShopProductList: jest.fn(),
}));

jest.mock("@/components/compositions/ShopProductGallery", () => ({
  ShopProductGallery: jest.fn(() => null),
}));

const mockGetShopProductList = getShopProductList as jest.MockedFunction<
  typeof getShopProductList
>;
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

describe("ShopProductsLoader", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.NEXT_PUBLIC_BASE_URL;
    mockGetShopProductList.mockResolvedValue({
      success: true,
      data: [product],
      metadata: {
        totalArtworks: 1,
        totalProducts: 1,
      },
    });
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

  it("loads products with backed filters through the server service and passes them to the gallery", async () => {
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

    expect(mockGetShopProductList).toHaveBeenCalledWith({
      sortBy: undefined,
      showOriginals: true,
      showPrints: false,
      showBooks: true,
      decade: ["1970s"],
      artstyle: ["abstract"],
      medium: ["oil"],
      surface: ["canvas"],
    });
    expect(global.fetch).not.toHaveBeenCalled();
    expect(element.type).toBe(ShopProductGallery);
    expect(element.props).toEqual({
      initialProducts: [product],
      initialFilters,
    });
    expect(mockShopProductGallery).not.toHaveBeenCalled();
  });

  it("uses route-equivalent defaults when no initial filters are present", async () => {
    await ShopProductsLoader({});

    expect(mockGetShopProductList).toHaveBeenCalledWith({
      sortBy: undefined,
      showOriginals: true,
      showPrints: true,
      showBooks: true,
      decade: [],
      artstyle: [],
      medium: [],
      surface: [],
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows a neutral retry hint when product loading fails", async () => {
    mockGetShopProductList.mockRejectedValue(
      new Error("Failed to fetch products")
    );

    render(await ShopProductsLoader({}));

    expect(screen.getByText("Failed to fetch products")).toBeInTheDocument();
    expect(screen.queryByText(/check the console/i)).not.toBeInTheDocument();
    expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects invalid loader filters before service work", async () => {
    render(
      await ShopProductsLoader({
        initialFilters: {
          artstyle: "cubist",
          showOriginals: true,
          showPrints: true,
          showBooks: true,
        },
      })
    );

    expect(screen.getByText("Invalid shop products query")).toBeInTheDocument();
    expect(mockGetShopProductList).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not import same-app HTTP dependencies, localhost fallbacks, or direct fetches", () => {
    const loaderSource = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/loaders/viewLoaders/ShopProductsLoader.tsx"
      ),
      "utf8"
    );

    expect(loaderSource).not.toContain("NEXT_PUBLIC_BASE_URL");
    expect(loaderSource).not.toContain("localhost");
    expect(loaderSource).not.toContain(["server", "PublicApi"].join(""));
    expect(loaderSource).not.toContain("serverApi");
    expect(loaderSource).not.toContain("fetch(");
  });
});
