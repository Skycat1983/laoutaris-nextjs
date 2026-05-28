import type { ReactElement } from "react";
import { ShopSectionLoader } from "@/components/loaders/sectionLoaders/ShopSectionLoader";
import { ShopPrototypeSection } from "@/components/prototypes/home/ShopPrototypeSection";
import { getShopProductList } from "@/lib/data/services/getShopProductList";
import type { SimpleProduct } from "@/lib/data/types/shopify";

jest.mock("@/lib/data/services/getShopProductList", () => ({
  getShopProductList: jest.fn(),
}));

jest.mock("@/components/prototypes/home/ShopPrototypeSection", () => ({
  ShopPrototypeSection: jest.fn(() => null),
}));

jest.mock("@/lib/observability/logger", () => ({
  createServerLogger: jest.fn(() => ({
    error: jest.fn(),
  })),
}));

const mockGetShopProductList = getShopProductList as jest.MockedFunction<
  typeof getShopProductList
>;

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

describe("ShopSectionLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a bounded homepage product set through the shared shop service", async () => {
    const products = Array.from({ length: 10 }, (_, index) =>
      createProduct(index + 1)
    );
    mockGetShopProductList.mockResolvedValue({
      success: true,
      data: products,
      metadata: {
        totalArtworks: 10,
        totalProducts: 10,
      },
    });

    const element = (await ShopSectionLoader()) as ReactElement<{
      products: SimpleProduct[];
      hasLoadError: boolean;
      productSizePreset: string;
      useAlternateBackground: boolean;
    }>;

    expect(mockGetShopProductList).toHaveBeenCalledWith({
      showOriginals: true,
      showPrints: true,
      showBooks: true,
    });
    expect(element.type).toBe(ShopPrototypeSection);
    expect(element.props).toMatchObject({
      products: products.slice(0, 8),
      hasLoadError: false,
      productSizePreset: "feature",
      useAlternateBackground: false,
    });
  });

  it("renders an unavailable shop section state for non-Next product loading failures", async () => {
    mockGetShopProductList.mockRejectedValue(new Error("Shopify unavailable"));

    const element = (await ShopSectionLoader()) as ReactElement<{
      products: SimpleProduct[];
      hasLoadError: boolean;
      productSizePreset: string;
      useAlternateBackground: boolean;
    }>;

    expect(element.type).toBe(ShopPrototypeSection);
    expect(element.props).toMatchObject({
      products: [],
      hasLoadError: true,
      productSizePreset: "feature",
      useAlternateBackground: false,
    });
  });
});
