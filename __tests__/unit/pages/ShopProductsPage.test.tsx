import { render, screen } from "@testing-library/react";
import ProductsPage from "@/app/shop/products/page";
import { ShopProductsLoader } from "@/components/loaders/viewLoaders/ShopProductsLoader";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

jest.mock("@/components/loaders/viewLoaders/ShopProductsLoader", () => ({
  ShopProductsLoader: jest.fn(() => <div data-testid="shop-products-loader" />),
}));

const mockShopProductsLoader = ShopProductsLoader as jest.MockedFunction<
  typeof ShopProductsLoader
>;

describe("/shop/products page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes deep-linked filters and sortBy to the shop products loader", async () => {
    render(
      await ProductsPage({
        searchParams: {
          sortBy: "price-low",
          artstyle: "abstract",
          medium: "paint",
          surface: "canvas",
          decade: "2020s",
          showOriginals: "false",
          showPrints: "true",
          showBooks: "false",
        },
      })
    );

    expect(screen.getByTestId("shop-products-loader")).toBeInTheDocument();
    expect(mockShopProductsLoader).toHaveBeenCalledWith(
      {
        initialFilters: {
          artstyle: "abstract",
          medium: "paint",
          surface: "canvas",
          decade: "2020s",
          showOriginals: false,
          showPrints: true,
          showBooks: false,
          sortBy: "price-low",
        },
      },
      {}
    );
  });
});
