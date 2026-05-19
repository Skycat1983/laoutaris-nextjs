import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ShopProductGallery } from "@/components/compositions/ShopProductGallery";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ShopSortOption } from "@/lib/data/types/shopTypes";

jest.mock("@/components/modules/cards/ProductCard", () => ({
  ProductCard: ({ product }: { product: SimpleProduct }) => (
    <article data-testid="product-card">{product.title}</article>
  ),
}));

jest.mock("@/components/modules/filters/ShopFilters", () => ({
  __esModule: true,
  default: ({
    onFilterChange,
  }: {
    onFilterChange: (filters: { showPrints: boolean }) => void;
  }) => (
    <button type="button" onClick={() => onFilterChange({ showPrints: false })}>
      filter prints
    </button>
  ),
}));

jest.mock("@/components/modules/filters/ShopResultsBar", () => ({
  __esModule: true,
  default: ({
    onSortChange,
  }: {
    onSortChange: (sortBy: ShopSortOption) => void;
  }) => (
    <div>
      <button type="button" onClick={() => onSortChange("price-low")}>
        price-low
      </button>
      <button type="button" onClick={() => onSortChange("price-high")}>
        price-high
      </button>
      <button type="button" onClick={() => onSortChange("title-asc")}>
        title-asc
      </button>
      <button type="button" onClick={() => onSortChange("title-desc")}>
        title-desc
      </button>
    </div>
  ),
}));

const createProduct = (
  title: string,
  productType: string,
  price: string
): SimpleProduct => ({
  id: `gid://shopify/Product/${title}`,
  handle: title.toLowerCase().replace(/\s+/g, "-"),
  title,
  description: "A product used by gallery sorting tests.",
  descriptionHtml: "<p>A product used by gallery sorting tests.</p>",
  vendor: "Joseph Laoutaris",
  productType,
  tags: [],
  price,
  currencyCode: "GBP",
  compareAtPrice: null,
  image: null,
  availableForSale: true,
  variants: [],
});

const products: SimpleProduct[] = [
  createProduct("Bookish Unknown", "", "30.00"),
  createProduct("A Title Print", "Limited Edition Print", "10.00"),
  createProduct("C Title Original", "Original Artwork", "20.00"),
  createProduct("B Title Book", " BOOK ", "40.00"),
];

const renderedProductTitles = () =>
  screen.getAllByTestId("product-card").map((card) => card.textContent);

describe("ShopProductGallery sorting", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("sorts the default type view by productType metadata instead of title text", () => {
    render(<ShopProductGallery initialProducts={products} />);

    expect(renderedProductTitles()).toEqual([
      "B Title Book",
      "C Title Original",
      "A Title Print",
      "Bookish Unknown",
    ]);
  });

  it("sorts unknown product types after known book, original, and print products", () => {
    render(<ShopProductGallery initialProducts={products} />);

    const titles = renderedProductTitles();
    expect(titles[titles.length - 1]).toBe("Bookish Unknown");
  });

  it("preserves price sorting modes", () => {
    render(<ShopProductGallery initialProducts={products} />);

    fireEvent.click(screen.getByRole("button", { name: "price-low" }));
    expect(renderedProductTitles()).toEqual([
      "A Title Print",
      "C Title Original",
      "Bookish Unknown",
      "B Title Book",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "price-high" }));
    expect(renderedProductTitles()).toEqual([
      "B Title Book",
      "Bookish Unknown",
      "C Title Original",
      "A Title Print",
    ]);
  });

  it("preserves title sorting modes", () => {
    render(<ShopProductGallery initialProducts={products} />);

    fireEvent.click(screen.getByRole("button", { name: "title-asc" }));
    expect(renderedProductTitles()).toEqual([
      "A Title Print",
      "B Title Book",
      "Bookish Unknown",
      "C Title Original",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "title-desc" }));
    expect(renderedProductTitles()).toEqual([
      "C Title Original",
      "Bookish Unknown",
      "B Title Book",
      "A Title Print",
    ]);
  });

  it("preserves the current products and clears loading after filter fetch failures", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<ShopProductGallery initialProducts={products} />);

    fireEvent.click(screen.getByRole("button", { name: "filter prints" }));

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v2/public/shop/products?showOriginals=true&showPrints=false&showBooks=true"
    );

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );
    expect(renderedProductTitles()).toEqual([
      "B Title Book",
      "C Title Original",
      "A Title Print",
      "Bookish Unknown",
    ]);
  });
});
