import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ShopProductGallery } from "@/components/compositions/ShopProductGallery";
import type { SimpleProduct } from "@/lib/data/types/shopify";
import type { ShopSortOption } from "@/lib/data/options/shopSortOptions";

jest.mock("@/components/modules/cards/ProductCard", () => ({
  ProductCard: ({ product }: { product: SimpleProduct }) => (
    <article data-testid="product-card">{product.title}</article>
  ),
  ProductCardSkeleton: () => <article data-testid="product-card-skeleton" />,
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

const manyProducts: SimpleProduct[] = Array.from({ length: 14 }, (_, index) =>
  createProduct(
    `Product ${String(index + 1).padStart(2, "0")}`,
    "Fine Art Print",
    String(index + 1)
  )
);

const renderedProductTitles = () =>
  screen.getAllByTestId("product-card").map((card) => card.textContent);

describe("ShopProductGallery sorting", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    (global.fetch as jest.Mock).mockReset();
    window.history.replaceState(null, "", "/shop/products");
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
    expect(window.location.search).toBe("?sortBy=price-low");
    expect(renderedProductTitles()).toEqual([
      "A Title Print",
      "C Title Original",
      "Bookish Unknown",
      "B Title Book",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "price-high" }));
    expect(window.location.search).toBe("?sortBy=price-high");
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
    expect(window.location.search).toBe("?sortBy=title-asc");
    expect(renderedProductTitles()).toEqual([
      "A Title Print",
      "B Title Book",
      "Bookish Unknown",
      "C Title Original",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "title-desc" }));
    expect(window.location.search).toBe("?sortBy=title-desc");
    expect(renderedProductTitles()).toEqual([
      "C Title Original",
      "Bookish Unknown",
      "B Title Book",
      "A Title Print",
    ]);
  });

  it("honors an initial route sort option", () => {
    render(
      <ShopProductGallery
        initialProducts={products}
        initialFilters={{ sortBy: "price-low" }}
      />
    );

    expect(renderedProductTitles()).toEqual([
      "A Title Print",
      "C Title Original",
      "Bookish Unknown",
      "B Title Book",
    ]);
  });

  it("shows filter failures, preserves products, and clears after retry", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [createProduct("Recovered Print", "Print", "15.00")],
        }),
      });

    render(<ShopProductGallery initialProducts={products} />);

    fireEvent.click(screen.getByRole("button", { name: "filter prints" }));

    expect(
      screen.getByRole("status", { name: "Updating product results" })
    ).toHaveTextContent("Updating products");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v2/public/shop/products?showPrints=false"
    );
    expect(screen.getAllByTestId("product-card-skeleton")).toHaveLength(6);
    expect(window.location.search).toBe("?showPrints=false");

    await waitFor(() =>
      expect(
        screen.queryByRole("status", { name: "Updating product results" })
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to update product filters"
    );
    expect(renderedProductTitles()).toEqual([
      "B Title Book",
      "C Title Original",
      "A Title Print",
      "Bookish Unknown",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Retry filters" }));

    await waitFor(() =>
      expect(screen.getByText("Recovered Print")).toBeInTheDocument()
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(renderedProductTitles()).toEqual(["Recovered Print"]);
  });

  it("includes the active route sort when fetching filtered products", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [createProduct("Filtered Original", "Original Artwork", "25.00")],
      }),
    });

    render(<ShopProductGallery initialProducts={products} />);

    fireEvent.click(screen.getByRole("button", { name: "price-high" }));
    fireEvent.click(screen.getByRole("button", { name: "filter prints" }));

    await waitFor(() =>
      expect(screen.getByText("Filtered Original")).toBeInTheDocument()
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/v2/public/shop/products?sortBy=price-high&showPrints=false"
    );
    expect(window.location.search).toBe("?sortBy=price-high&showPrints=false");
  });

  it("reveals shop products in batches instead of rendering the full list at once", () => {
    render(<ShopProductGallery initialProducts={manyProducts} />);

    expect(screen.getAllByTestId("product-card")).toHaveLength(12);
    expect(
      screen.getByRole("button", { name: "Show more (2)" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show more (2)" }));

    expect(screen.getAllByTestId("product-card")).toHaveLength(14);
    expect(
      screen.queryByRole("button", { name: /Show more/ })
    ).not.toBeInTheDocument();
  });
});
