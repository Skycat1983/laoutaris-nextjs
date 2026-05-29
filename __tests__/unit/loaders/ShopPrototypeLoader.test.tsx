import { readFileSync } from "fs";
import path from "path";
import { getShopPrototypeProducts } from "@/components/prototypes/home/ShopPrototypeLoader";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import { createServerLogger } from "@/lib/observability/logger";
import type { SimpleProduct } from "@/lib/data/types/shopify";

jest.mock("@/lib/data/services/getShopProductList", () => ({
  getShopProductList: jest.fn(),
}));

jest.mock("@/lib/observability/logger", () => ({
  createServerLogger: jest.fn(() => ({
    error: jest.fn(),
  })),
}));

const mockGetShopProductList = getShopProductList as jest.MockedFunction<
  typeof getShopProductList
>;
const mockCreateServerLogger = createServerLogger as jest.MockedFunction<
  typeof createServerLogger
>;

const getMockLoggerError = () => {
  const logger = mockCreateServerLogger.mock.results[0]?.value as
    | { error: jest.Mock }
    | undefined;

  if (!logger) {
    throw new Error("Expected prototype shop logger to be created");
  }

  return logger.error;
};

const createProduct = (index: number): SimpleProduct => ({
  id: `gid://shopify/Product/${index}`,
  handle: `product-${index}`,
  title: `Product ${index}`,
  description: `Product ${index} description`,
  descriptionHtml: `<p>Product ${index} description</p>`,
  vendor: "Joseph Laoutaris",
  productType: index % 2 === 0 ? "print" : "original",
  tags: ["archive"],
  price: `${index * 100}.00`,
  currencyCode: "EUR",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
});

describe("getShopPrototypeProducts", () => {
  beforeEach(() => {
    mockGetShopProductList.mockReset();
    getMockLoggerError().mockClear();
  });

  it("loads a bounded product set from the shared shop product service", async () => {
    const products = Array.from({ length: 10 }, (_, index) =>
      createProduct(index + 1)
    );
    mockGetShopProductList.mockResolvedValue({
      success: true,
      data: products,
      metadata: {
        page: 1,
        limit: 10,
        total: 10,
        totalPages: 1,
        totalArtworks: 10,
        totalProducts: 10,
      },
    });

    await expect(getShopPrototypeProducts()).resolves.toEqual({
      products: products.slice(0, 8),
      hasLoadError: false,
    });
    expect(mockGetShopProductList).toHaveBeenCalledWith({
      showOriginals: true,
      showPrints: true,
      showBooks: true,
    });
  });

  it("returns an empty section state when product loading fails", async () => {
    const error = new Error("Shopify unavailable");
    mockGetShopProductList.mockRejectedValue(error);

    await expect(getShopPrototypeProducts()).resolves.toEqual({
      products: [],
      hasLoadError: true,
    });
    expect(getMockLoggerError()).toHaveBeenCalledWith(
      "loader.prototype.home.shop.failed",
      { error }
    );
  });

  it("does not add same-app fetch or live shop component dependencies", () => {
    const loaderSource = readFileSync(
      path.join(
        process.cwd(),
        "src/components/prototypes/home/ShopPrototypeLoader.tsx"
      ),
      "utf8"
    );

    expect(loaderSource).toContain("getShopProductList");
    expect(loaderSource).not.toContain("fetch(");
    expect(loaderSource).not.toContain("ShopProductsLoader");
    expect(loaderSource).not.toContain("ShopProductGallery");
  });
});
